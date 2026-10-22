import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from '../tarokka-reading/scripts/lib/three.module.min.js';
import {batchStaticMeshes,renderPixelRatio} from '../tarokka-reading/scripts/tarokka-performance.mjs';
import {buildCampEnvironment,buildMedievalTable} from '../tarokka-reading/scripts/tarokka-camp.mjs';
import {Tarokka3DScene} from '../tarokka-reading/scripts/tarokka-3d.mjs';
import {TarokkaPhysics} from '../tarokka-reading/scripts/tarokka-physics.mjs';

test('limita a resolução interna em telas Retina e 4K sem aumentar telas pequenas',()=>{
  for(const [w,h,dpr] of [[1280,860,2],[3840,2160,2],[800,600,1]]){
    const ratio=renderPixelRatio(w,h,dpr);
    assert.ok(w*h*ratio*ratio<=1200001);assert.ok(ratio<=1&&ratio<=dpr);
  }
  assert.equal(renderPixelRatio(800,600,1),1);
});

test('agrupa a tenda real em menos chamadas preservando triângulos e posições',t=>{
  const owner={scene:new THREE.Scene(),renderer:{capabilities:{getMaxAnisotropy:()=>4}},
    _mesh(geometry,material,parent=this.scene){const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;},
    _texture(_path,loaded){const texture=new THREE.Texture();loaded?.(texture);return texture;},
    _makeClothTexture:()=>new THREE.Texture(),_glowTexture:()=>new THREE.Texture()};
  buildCampEnvironment(owner);buildMedievalTable(owner);
  const summary=()=>{
    let meshes=0,triangles=0;const bounds=new THREE.Box3();
    owner.scene.updateMatrixWorld(true);
    owner.scene.traverse(object=>{if(!object.isMesh)return;meshes++;triangles+=(object.geometry.index?.count??object.geometry.attributes.position.count)/3;
      object.geometry.computeBoundingBox();bounds.union(object.geometry.boundingBox.clone().applyMatrix4(object.matrixWorld));});
    return {meshes,triangles,bounds};
  };
  const before=summary();batchStaticMeshes(owner.scene);const after=summary();
  assert.ok(after.meshes<before.meshes*0.5);assert.equal(after.triangles,before.triangles);
  assert.ok(after.bounds.min.distanceTo(before.bounds.min)<0.00001);assert.ok(after.bounds.max.distanceTo(before.bounds.max)<0.00001);
  t.diagnostic(`Objetos de malha da tenda/mesa: ${before.meshes} → ${after.meshes}`);
  owner.scene.traverse(object=>{object.geometry?.dispose();for(const material of [object.material].flat())material?.dispose();});
});

test('não agrupa cartas interativas nem vidro transparente com o cenário',()=>{
  const scene=new THREE.Scene(),material=new THREE.MeshStandardMaterial();
  const a=new THREE.Mesh(new THREE.BoxGeometry(),material),b=a.clone(),card=a.clone();
  const glass=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshStandardMaterial({transparent:true,opacity:0.1}));
  scene.add(a,b,card,glass);batchStaticMeshes(scene,new Set([card]));
  assert.ok(scene.children.includes(card)&&scene.children.includes(glass));assert.equal(scene.children.length,3);
});

test('agrupamento preserva índices, cores e coordenadas em uma cena transformada',()=>{
  const scene=new THREE.Scene();scene.position.set(3,2,-4);scene.rotation.y=0.4;
  const material=new THREE.MeshBasicMaterial({vertexColors:true}),source=new THREE.BoxGeometry();
  source.setAttribute('color',new THREE.Uint8BufferAttribute(new Uint8Array(source.attributes.position.count*3).fill(127),3,true));
  const a=new THREE.Mesh(source,material),b=new THREE.Mesh(source,material);b.position.set(2,0,0);scene.add(a,b);scene.updateMatrixWorld(true);
  const before=new THREE.Box3().setFromObject(scene),vertices=source.attributes.position.count*2;
  batchStaticMeshes(scene);scene.updateMatrixWorld(true);
  const batch=scene.children[0],after=new THREE.Box3().setFromObject(scene);
  assert.equal(batch.geometry.attributes.position.count,vertices);assert.equal(batch.geometry.index.count,source.index.count*2);
  assert.equal(batch.geometry.attributes.color.normalized,true);assert.ok(batch.geometry.attributes.color.array instanceof Uint8Array);
  assert.ok(before.min.distanceTo(after.min)<0.000001&&before.max.distanceTo(after.max)<0.000001);
  batch.geometry.dispose();material.dispose();
});

test('agrupamento não torna objetos ocultos visíveis nem descarta geometria ainda compartilhada',()=>{
  const scene=new THREE.Scene(),material=new THREE.MeshBasicMaterial(),geometry=new THREE.BoxGeometry();
  const a=new THREE.Mesh(geometry,material),b=a.clone(),hidden=a.clone(),card=a.clone();hidden.visible=false;
  let disposals=0;geometry.addEventListener('dispose',()=>disposals++);scene.add(a,b,hidden,card);
  batchStaticMeshes(scene,new Set([card]));
  assert.ok(scene.children.includes(hidden)&&scene.children.includes(card));assert.equal(hidden.visible,false);assert.equal(disposals,0);
  for(const object of scene.children)if(object.geometry!==geometry)object.geometry.dispose();geometry.dispose();material.dispose();
});

test('mesa parada não executa passos de física; soltura reativa os contatos',()=>{
  const physics=new TarokkaPhysics();let steps=0;const original=physics.world.step.bind(physics.world);
  physics.world.step=(...args)=>{steps++;return original(...args);};
  for(let i=0;i<120;i++)physics.step(1/120);assert.equal(steps,0);
  physics.release(0,{x:0,y:0.4,z:0},{x:0,y:0,z:0,w:1});physics.step(1/120);assert.ok(steps>0);physics.destroy();
});

test('reinício 3D cancela animações sem aguardar um quadro e oculta todas as cartas',async()=>{
  const scene=Object.create(Tarokka3DScene.prototype);scene.animationEpoch=0;scene.activeAnimations=[];scene.inspectedCardIndex=0;
  scene.physics=new TarokkaPhysics();scene.slotFrames=Array.from({length:5},()=>({visible:false}));
  scene.cards=Array.from({length:5},()=>{
    const front=new THREE.MeshBasicMaterial(),mesh=new THREE.Mesh(new THREE.BoxGeometry(),[front,front,front]);
    mesh.userData={frontMaterial:front,state:'inspecting',cardData:{id:'old'}};return mesh;
  });
  const pending=scene._runAnimation(1000);scene.resetTable();
  assert.equal(await pending,false);assert.equal(scene.inspectedCardIndex,null);
  assert.ok(scene.cards.every(card=>!card.visible&&card.userData.state==='waiting'&&!card.userData.cardData));
  assert.ok(scene.physics.cards.every(body=>body.mode==='inactive'));scene.physics.destroy();
});

test('sincronizações repetidas reutilizam a textura da carta; descarte respeita texturas em uso',()=>{
  const scene=Object.create(Tarokka3DScene.prototype);scene.cardTextures=new Map();scene.textures=new Set();scene.renderer={capabilities:{getMaxAnisotropy:()=>4}};
  const card={userData:{cardData:{id:'a'},frontMaterial:new THREE.MeshStandardMaterial(),inspectionMaterial:new THREE.MeshBasicMaterial()}};scene.cards=[card];
  let loaded,loads=0;
  scene._texture=(_path,callback)=>{loads++;loaded=callback;return new THREE.Texture();};
  const data={id:'a',image:'a.png'};
  scene._setCardTexture(card,data);scene._setCardTexture(card,data);loaded(scene.cardTextures.get(data.image));
  scene._setCardTexture(card,data);assert.equal(loads,1);assert.ok(card.userData.frontMaterial.map);
  for(let i=0;i<20;i++){const texture=new THREE.Texture();texture.userData={loaded:true};scene.cardTextures.set(`${i}.png`,texture);}
  scene._pruneCardTextures();assert.equal(scene.cardTextures.size,12);assert.ok(scene.cardTextures.has('a.png'));
});

test('sincronizações durante o carregamento não acumulam callbacks da mesma carta',()=>{
  const scene=Object.create(Tarokka3DScene.prototype);scene.cardTextures=new Map();scene.textures=new Set();
  scene.renderer={capabilities:{getMaxAnisotropy:()=>4}};
  const card={userData:{cardData:{id:'a'},frontMaterial:new THREE.MeshStandardMaterial(),inspectionMaterial:new THREE.MeshBasicMaterial()}};scene.cards=[card];
  let callback,loads=0;scene._texture=(_path,loaded)=>{loads++;callback=loaded;return new THREE.Texture();};
  for(let i=0;i<100;i++)scene._setCardTexture(card,{id:'a',image:'a.webp'});
  const texture=scene.cardTextures.get('a.webp');assert.equal(loads,1);assert.equal(texture.userData.waiters.length,1);
  callback(texture);assert.equal(card.userData.frontMaterial.map,texture);assert.equal(texture.userData.waiters.length,0);
  texture.dispose();card.userData.frontMaterial.dispose();card.userData.inspectionMaterial.dispose();
});

test('clique detecta uma carta restaurada antes do próximo quadro de renderização',()=>{
  const scene=Object.create(Tarokka3DScene.prototype);
  scene.camera=new THREE.PerspectiveCamera(50,1,0.1,50);scene.camera.updateMatrixWorld();
  const card=new THREE.Mesh(new THREE.BoxGeometry(0.8,1.2,0.02),new THREE.MeshBasicMaterial());
  card.position.set(1.2,0,-5);card.userData={index:0,state:'revealed'};
  scene.cards=[card];scene.slotMeshes=[];scene.decks=[];scene.raycaster=new THREE.Raycaster();
  const point=card.position.clone().project(scene.camera);scene.mouse=new THREE.Vector2(point.x,point.y);
  let selected=null;scene.callbacks={onInspectRequest:index=>selected=index};scene._handleClick();
  assert.equal(selected,0);card.geometry.dispose();card.material.dispose();
});

test('minimizar a mesa durante um movimento libera a animação sem depender de quadros',async()=>{
  const scene=Object.create(Tarokka3DScene.prototype);scene.animationEpoch=0;scene.activeAnimations=[];
  let minimized=false,progress=0;scene.canvas={closest:()=>minimized?{}:null};
  const pending=scene._runAnimation(900,t=>progress=t);minimized=true;
  assert.equal(await pending,true);assert.equal(progress,1);assert.equal(scene.activeAnimations.length,0);
  assert.equal(await scene._runAnimation(900,t=>progress=t),true);assert.equal(progress,1);
  scene._cancelAnimations();assert.equal(scene._backgroundTimer,null);
});
