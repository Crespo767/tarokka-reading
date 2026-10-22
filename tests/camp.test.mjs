import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as THREE from '../tarokka-reading/scripts/lib/three.module.min.js';
import {createRoofGeometry,createWallGeometry,wallPoint,createTableClothGeometry,buildHangingLantern,updateLanterns} from '../tarokka-reading/scripts/tarokka-camp.mjs';
import {CAMP,VIEW,TABLE_LEGS,CARD,TABLE,inspectionLayout} from '../tarokka-reading/scripts/tarokka-layout.mjs';
import {Tarokka3DScene} from '../tarokka-reading/scripts/tarokka-3d.mjs';
import {TarokkaPhysics} from '../tarokka-reading/scripts/tarokka-physics.mjs';

test('cartas fora da mesa pousam no chão de terra em vez de cair indefinidamente',()=>{
  const p=new TarokkaPhysics();p.release(0,{x:4,y:0.6,z:0},{x:0,y:0,z:0,w:1});
  for(let i=0;i<480;i++)p.step(1/120);
  assert.ok(Math.abs(p.cards[0].position.y-(CAMP.floorY+CARD.thickness/2))<0.004);p.destroy();
});
test('teto e paredes formam superfícies contínuas com entrada aberta e coordenadas finitas',()=>{
  for(const geometry of [createRoofGeometry(),createWallGeometry()]){
    assert.ok([...geometry.attributes.position.array].every(Number.isFinite));
    assert.ok([...geometry.attributes.normal.array].every(Number.isFinite));
    geometry.computeBoundingBox();assert.ok(geometry.boundingBox.min.y>=CAMP.floorY-0.001);
    geometry.dispose();
  }
  const left=wallPoint(0,0),right=wallPoint(1,0);
  assert.ok(left.x>1&&right.x<-1);assert.ok(left.z>0&&right.z>0);
  assert.equal(left.y,CAMP.floorY);
});
test('enquadramento mantém pés, chão e o topo da mesa visíveis em janelas altas e largas',()=>{
  for(const aspect of [794/840,1256/676]){
    const camera=new THREE.PerspectiveCamera(VIEW.fov,aspect,0.1,60);
    const z=Math.max(VIEW.eye.z,VIEW.eye.z/Math.min(1,aspect/VIEW.fitAspect));
    camera.position.set(VIEW.eye.x,VIEW.eye.y,z);camera.lookAt(VIEW.target.x,VIEW.target.y,VIEW.target.z);camera.updateMatrixWorld();
    for(const leg of TABLE_LEGS){const foot=new THREE.Vector3(leg.foot.x,leg.foot.y,leg.foot.z).project(camera);assert.ok(Math.abs(foot.x)<0.96&&Math.abs(foot.y)<0.96);}
    for(const x of [-3.1,3.1]){const rim=new THREE.Vector3(x,0.08,0).project(camera);assert.ok(Math.abs(rim.x)<0.96);}
  }
});
test('arte sentada e materiais da tenda são arquivos locais presentes',()=>{
  for(const path of ['madam-eva-seated.webp','materials/tent-canvas.webp','materials/packed-earth.webp','materials/aged-oak.webp'])assert.ok(existsSync(new URL('../tarokka-reading/assets/'+path,import.meta.url)),path);
});

test('veludo repousa plano dentro do tampo, deixando madeira exposta e sem saia deformada',()=>{
  const g=createTableClothGeometry(),p=g.attributes.position;
  g.computeBoundingBox();
  assert.ok(g.boundingBox.max.y-g.boundingBox.min.y<0.00001);
  assert.ok(g.boundingBox.min.y>TABLE.top);
  let radius=0;
  for(let i=0;i<p.count;i++)radius=Math.max(radius,Math.hypot(p.getX(i),p.getZ(i)));
  assert.ok(radius>TABLE.playRadius&&radius<TABLE.radius-0.20);g.dispose();
});

test('veludo plano usa apenas 128 triângulos com normais voltadas para cima',()=>{
  const geometry=createTableClothGeometry();assert.equal(geometry.index.count/3,128);
  const normals=geometry.attributes.normal;
  for(let i=0;i<normals.count;i++)assert.ok(normals.getY(i)>0.999);
  geometry.dispose();
});

test('lamparina tem estrutura suspensa, chama animada e luz estável com movimento reduzido',()=>{
  const owner={scene:new THREE.Scene(),_mesh(g,m,parent=this.scene){const mesh=new THREE.Mesh(g,m);parent.add(mesh);return mesh;},_glowTexture:()=>new THREE.Texture()};
  const a=buildHangingLantern(owner,-3.8,-3.8,0),b=buildHangingLantern(owner,3.8,-3.8,1.7);
  assert.equal(owner.scene.children.filter(c=>c.name==='hanging-iron-oil-lantern').length,2);
  assert.ok(a.group.children.filter(c=>c.isMesh).length>12);
  updateLanterns([a,b],1);const light=a.light.intensity;
  updateLanterns([a,b],2);assert.notEqual(a.light.intensity,light);assert.equal(a.flame.material.uniforms.uTime.value,2);
  assert.notEqual(a.light.intensity,b.light.intensity);
  updateLanterns([a,b],3,true);assert.equal(a.flame.material.uniforms.uTime.value,0);assert.equal(a.light.intensity,1.15);
  updateLanterns([a,b],10,true);assert.equal(a.light.intensity,1.15);
  owner.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});

test('carta ampliada ocupa a altura prevista e mantém a descrição à esquerda, sem recorte',()=>{
  for(const [width,height] of [[794,840],[1256,676],[520,740]]){
    const scene=Object.create(Tarokka3DScene.prototype);scene.canvas={clientWidth:width,clientHeight:height};
    scene.camera=new THREE.PerspectiveCamera(VIEW.fov,width/height,0.1,60);scene.camera.position.set(0,2.3,7);scene.camera.lookAt(0,-0.15,-0.5);
    const focus=scene._inspectionTransform(),layout=inspectionLayout(width,height),mesh=new THREE.Mesh(new THREE.BoxGeometry(CARD.width,CARD.thickness,CARD.length));
    mesh.position.copy(focus.position);mesh.rotation.copy(focus.rotation);mesh.scale.setScalar(focus.scale);mesh.updateMatrixWorld();
    const projected=[];
    for(const x of [-CARD.width/2,CARD.width/2])for(const z of [-CARD.length/2,CARD.length/2]){
      const p=new THREE.Vector3(x,0,z).applyMatrix4(mesh.matrixWorld).project(scene.camera);projected.push({x:(p.x+1)*width/2,y:(1-p.y)*height/2});
    }
    const left=Math.min(...projected.map(p=>p.x)),right=Math.max(...projected.map(p=>p.x)),top=Math.min(...projected.map(p=>p.y)),bottom=Math.max(...projected.map(p=>p.y));
    assert.ok(left>layout.panelLeft+layout.panelWidth+12);assert.ok(right<width-20&&top>20&&bottom<height-20);
    assert.ok(Math.abs(bottom-top-layout.cardHeight)<0.01);assert.ok(layout.cardHeight>height*0.45);mesh.geometry.dispose();mesh.material.dispose();
  }
});
