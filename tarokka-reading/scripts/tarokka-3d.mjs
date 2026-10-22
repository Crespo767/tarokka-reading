import * as THREE from './lib/three.module.min.js';
import { TarokkaPhysics } from './tarokka-physics.mjs';
import { TABLE, CARD, SLOTS, CARD_REST_Y, DECK, CANDLES, CRYSTAL, TRAVEL_Y, CAMP, VIEW, inspectionLayout } from './tarokka-layout.mjs';

import { buildCampEnvironment, buildMedievalTable, updateLanterns } from './tarokka-camp.mjs';
import { FRAME_INTERVAL, renderPixelRatio, batchStaticMeshes } from './tarokka-performance.mjs';

const ease = t => t*t*(3-2*t);
const asset = path => `modules/tarokka-reading/assets/${path}`;

export class Tarokka3DScene {
  constructor(canvas,callbacks={}) {
    this.canvas=canvas;this.callbacks=callbacks;
    this.destroyed=false;this.animationEpoch=0;this.activeAnimations=[];
    this._motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion=this._motionQuery.matches;
    this.textures=new Set();this.cardTextures=new Map();this.cards=[];this.slotMeshes=[];this.slotFrames=[];this.candleLights=[];
    this.inspectedCardIndex=null;this.hoveredCard=null;
    this.pointerRaw={x:0,y:0};this.mouse=new THREE.Vector2();this.raycaster=new THREE.Raycaster();
    this.elapsedTime=0;this.imageSources=new Map();
    this.loadingManager=new THREE.LoadingManager(()=>{if(!this.destroyed)this.callbacks.onReady?.();},(_url,loaded,total)=>{if(!this.destroyed)this.callbacks.onLoadProgress?.(loaded,total);});
    this.imageLoader=new THREE.ImageLoader(this.loadingManager);
    this.showCrystal=callbacks.isGM===true;
    this.slotPositions=SLOTS;this.deckPosition={...DECK,y:TABLE.top+DECK.height/2};
    try {
    this._initThree();
    this.physics=new TarokkaPhysics({showCrystal:this.showCrystal});
    this._buildEnvironment();this._buildTable();this._buildMadamEva();
    if(this.showCrystal)this._buildCrystalBall();
    this._buildCandles();this._buildDeck();this._buildCardSlots();this._bindEvents();
    const moving=new Set([...this.cards,...this.slotMeshes,this.deckMesh,this.madamEvaMesh,...this.candleLights.map(c=>c.flame)]);
    this.batchedMeshSavings=batchStaticMeshes(this.scene,moving);
    this.resize(canvas.clientWidth,canvas.clientHeight);
    } catch(error){this.destroy();throw error;}
  }

  _texture(path,loaded,onError) {
    const tex=new THREE.Texture();
    // Preserve the existing scenery's color sampling. Card faces opt into
    // sRGB when their readable material is installed after loading.
    tex.encoding=/\/cards\/(common|high)\//.test(path)?THREE.sRGBEncoding:THREE.LinearEncoding;
    this.textures.add(tex);
    const apply=image=>{if(this.destroyed)return;tex.image=image;tex.needsUpdate=true;loaded?.(tex);this._invalidate();};
    const cached=this.imageSources.get(path);
    if(cached){if(cached.image)queueMicrotask(()=>apply(cached.image));else cached.waiters.push({apply,onError});return tex;}
    const source={image:null,waiters:[{apply,onError}]};this.imageSources.set(path,source);
    this.imageLoader.load(path,image=>{
      if(this.destroyed)return;
      // Keep full-size source files; cap GPU uploads for scenery textures.
      const limit=path.includes('/cards/')?1536:1024;
      if(Math.max(image.width,image.height)>limit){
        const scale=limit/Math.max(image.width,image.height),canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
        canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);image=canvas;
      }
      source.image=image;for(const waiter of source.waiters)waiter.apply(image);source.waiters=[];
    },undefined,error=>{
      if(this.destroyed)return;
      this.imageSources.delete(path);for(const waiter of source.waiters)waiter.onError?.(error);source.waiters=[];
    });
    return tex;
  }
  _mesh(geometry,material,parent=this.scene) {
    const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
  }
  _initThree() {
    const w=this.canvas.clientWidth||1000,h=this.canvas.clientHeight||760;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x0c0a08);
    this.scene.fog=new THREE.FogExp2(0x15110c,0.018);
    this.camera=new THREE.PerspectiveCamera(VIEW.fov,w/h,0.1,60);
    this.cameraDefaultPos=new THREE.Vector3(VIEW.eye.x,VIEW.eye.y,VIEW.eye.z);
    this.cameraTarget=new THREE.Vector3(VIEW.target.x,VIEW.target.y,VIEW.target.z);
    this.camera.position.copy(this.cameraDefaultPos);this.camera.lookAt(this.cameraTarget);
    this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(renderPixelRatio(w,h,window.devicePixelRatio));this.renderer.setSize(w,h,false);
    this.renderer.outputEncoding=THREE.sRGBEncoding;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate=false;this.renderer.shadowMap.needsUpdate=true;
    this.scene.add(new THREE.HemisphereLight(0x969aa1,0x251e18,0.20));
    const key=new THREE.SpotLight(0xe8be98,0.65,20,0.60,0.85);
    key.position.set(-1.5,3.2,1);key.target.position.set(0,0,0);
    key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.bias=-0.0002;key.shadow.normalBias=0.015;
    this.scene.add(key,key.target);
    this.backTexture=this._texture(asset('cards/tarokka-back.webp'));
  }
  _buildEnvironment() { this.camp=buildCampEnvironment(this); }
  _buildTable() { this.tableGroup=buildMedievalTable(this); }
  _makeClothTexture() {
    const c=document.createElement('canvas');c.width=c.height=1024;const ctx=c.getContext('2d');
    const pixels=ctx.createImageData(1024,1024);
    for(let y=0;y<1024;y++)for(let x=0;x<1024;x++){
      const i=(y*1024+x)*4;
      const n=((x*73856093^y*19349663)>>>0)%13-6;
      const weave=(x%3===0?3:0)+(y%3===0?2:0);
      pixels.data[i]=20+n/2+weave;pixels.data[i+1]=19+n/2+weave;pixels.data[i+2]=21+n/2+weave;pixels.data[i+3]=255;
    }
    ctx.putImageData(pixels,0,0);
    const texture=new THREE.CanvasTexture(c);texture.encoding=THREE.sRGBEncoding;texture.anisotropy=8;this.textures.add(texture);return texture;
  }
  _buildMadamEva() {
    const texture=this._texture(asset('madam-eva-seated.webp'));
    const material=new THREE.MeshStandardMaterial({map:texture,transparent:true,alphaTest:0.045,depthWrite:true,roughness:1,metalness:0,color:0xd4c8b9,emissive:0x211811,emissiveMap:texture,emissiveIntensity:0.25});
    this.madamEvaMesh=this._mesh(new THREE.PlaneGeometry(3.52,4.5),material);
    this.madamEvaMesh.position.set(0,-0.12,-3.4);this.madamEvaMesh.castShadow=false;
    this.madamEvaMesh.name='madame-eva-seated-on-old-chair';
    const faceLight=new THREE.SpotLight(0xeaa57c,0.70,8,0.45,0.9);faceLight.position.set(-0.9,0.4,0);faceLight.target.position.set(0,1.15,-3.4);this.scene.add(faceLight,faceLight.target);
  }
  _buildCrystalBall() {
    const group=new THREE.Group();group.position.set(CRYSTAL.x,TABLE.top,CRYSTAL.z);this.scene.add(group);
    const metal=new THREE.MeshStandardMaterial({color:0x8d6f3c,metalness:0.8,roughness:0.35});
    const stand=this._mesh(new THREE.CylinderGeometry(0.2,CRYSTAL.standRadius,CRYSTAL.standHeight,32),metal,group);stand.position.y=CRYSTAL.standHeight/2;
    this.crystalBall=this._mesh(new THREE.SphereGeometry(CRYSTAL.radius,40,32),new THREE.MeshPhysicalMaterial({color:0x79929d,metalness:0.08,roughness:0.1,transparent:true,opacity:0.65,clearcoat:1}),group);
    this.crystalBall.position.y=CRYSTAL.standHeight+CRYSTAL.radius;
    this.crystalLight=new THREE.PointLight(0x94b8cf,0.35,1.5);this.crystalLight.position.copy(this.crystalBall.position);group.add(this.crystalLight);
  }
  _glowTexture() {
    if(this.glowTexture)return this.glowTexture;
    const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
    const g=ctx.createRadialGradient(64,64,1,64,64,64);g.addColorStop(0,'#fff2c9');g.addColorStop(0.12,'#ffc467aa');g.addColorStop(0.4,'#ef803322');g.addColorStop(1,'#ef803300');ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
    const tex=new THREE.CanvasTexture(c);this.textures.add(tex);this.glowTexture=tex;return tex;
  }
  _buildCandles() {
    const brass=new THREE.MeshStandardMaterial({color:0x8f7249,roughness:0.42,metalness:0.8});
    const wax=new THREE.MeshStandardMaterial({color:0xc8b99b,roughness:0.9});const glowMap=this._glowTexture();
    CANDLES.forEach((c,i)=>{
      const group=new THREE.Group();group.position.set(c.x,TABLE.top,c.z);this.scene.add(group);
      const profile=[[0.15,0],[0.15,0.025],[0.11,0.045],[0.04,0.07],[0.035,0.12],[0.085,0.14],[0.09,0.16]].map(([r,y])=>new THREE.Vector2(r,y));
      this._mesh(new THREE.LatheGeometry(profile,32),brass,group);
      const candle=this._mesh(new THREE.CylinderGeometry(0.049,0.053,c.height-0.16,24),wax,group);candle.position.y=0.16+(c.height-0.16)/2;
      for(let j=0;j<5;j++){
        const a=j*Math.PI*2/5;const drip=this._mesh(new THREE.SphereGeometry(0.012,8,8),wax,group);drip.scale.y=2+j%3;drip.position.set(Math.cos(a)*0.045,c.height-0.025-j*0.02,Math.sin(a)*0.045);drip.castShadow=false;
      }
      const flame=this._mesh(new THREE.SphereGeometry(0.021,12,12),new THREE.MeshBasicMaterial({color:0xffcf82,toneMapped:false}),group);flame.position.y=c.height+0.035;flame.scale.set(0.7,2.4,0.7);flame.castShadow=false;
      const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:glowMap,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0.4}));glow.position.y=c.height+0.035;glow.scale.set(0.42,0.42,0.42);group.add(glow);
      const light=new THREE.PointLight(0xffb65a,0.70,3.5);light.position.y=c.height+0.08;group.add(light);
      this.candleLights.push({light,flame,seed:i*1.73});
    });
  }
  _buildDeck() {
    const paper=new THREE.MeshStandardMaterial({color:0xa39980,roughness:0.95});
    const back=new THREE.MeshStandardMaterial({map:this.backTexture,roughness:0.78});
    const d=DECK;
    {
      const mesh=this._mesh(new THREE.BoxGeometry(CARD.width,d.height,CARD.length),[paper,paper,back,paper,paper,paper]);
      mesh.position.set(d.x,TABLE.top+d.height/2,d.z);mesh.rotation.y=d.rotY;mesh.userData.isDeck=true;
      // Fine edges make the thickness read as a stack of paper.
      for(let j=1;j<6;j++){
        const box=new THREE.BoxGeometry(CARD.width+0.002,0.001,CARD.length+0.002),edges=new THREE.EdgesGeometry(box);box.dispose();
        const line=new THREE.LineSegments(edges,new THREE.LineBasicMaterial({color:0x4a3d2d,transparent:true,opacity:0.45}));line.position.y=-d.height/2+j*d.height/6;mesh.add(line);
      }
      mesh.name='single-tarokka-deck';this.deckMesh=mesh;
    }
    this.decks=[this.deckMesh];
  }
  _buildCardSlots() {
    const paper=new THREE.MeshStandardMaterial({color:0xada18a,roughness:0.95});
    SLOTS.forEach((slot,index)=>{
      const w=CARD.width/2+0.045,l=CARD.length/2+0.045,y=TABLE.top+0.002;
      const outline=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-w,y,-l),new THREE.Vector3(w,y,-l),new THREE.Vector3(w,y,l),new THREE.Vector3(-w,y,l),new THREE.Vector3(-w,y,-l)]);
      const frame=new THREE.Line(outline,new THREE.LineDashedMaterial({color:0xb49667,transparent:true,opacity:0.38,dashSize:0.028,gapSize:0.022}));frame.computeLineDistances();frame.position.set(slot.x,0,slot.z);this.scene.add(frame);this.slotFrames.push(frame);
      const hit=this._mesh(new THREE.PlaneGeometry(w*2,l*2),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));hit.rotation.x=-Math.PI/2;hit.position.set(slot.x,TABLE.top+0.004,slot.z);hit.userData={index,isSlot:true};hit.castShadow=false;this.slotMeshes.push(hit);
      hit.material.visible=false; // Keep raycasting without submitting invisible draw calls.
      const front=new THREE.MeshStandardMaterial({color:0x282027,roughness:0.92,metalness:0});
      const back=new THREE.MeshStandardMaterial({map:this.backTexture,roughness:0.85});
      const card=this._mesh(new THREE.BoxGeometry(CARD.width,CARD.thickness,CARD.length),[paper,paper,front,back,paper,paper]);
      card.visible=false;card.userData={index,state:'waiting',slotX:slot.x,slotY:CARD_REST_Y,slotZ:slot.z,frontMaterial:front,inspectionMaterial:new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),backMaterial:back,cardData:null};
      this.cards.push(card);
    });
  }
  _setCardTexture(card,data) {
    if(!data?.image)return;
    const cached=this.cardTextures.get(data.image);
    if(card.userData.texturePath===data.image&&cached&&(!cached.userData.loaded||card.userData.frontMaterial.map===cached))return;
    card.userData.texturePath=data.image;
    const apply=tex=>{
      if(card.userData.cardData?.id!==data.id)return;
      tex.anisotropy=Math.min(4,this.renderer.capabilities.getMaxAnisotropy());
      card.userData.frontMaterial.map=tex;card.userData.frontMaterial.color.setHex(0xffffff);card.userData.frontMaterial.needsUpdate=true;card.userData.inspectionMaterial.map=tex;card.userData.inspectionMaterial.needsUpdate=true;
    };
    if(cached){if(cached.userData.loaded)apply(cached);else cached.userData.waiters.push(apply);return;}
    const tex=this._texture(data.image,loaded=>{loaded.userData.loaded=true;for(const waiter of loaded.userData.waiters??[])waiter(loaded);loaded.userData.waiters=[];this._pruneCardTextures();},()=>{
      this.cardTextures.delete(data.image);this.textures.delete(tex);tex.dispose();
    });
    tex.userData??={};tex.userData.waiters=[apply];this.cardTextures.set(data.image,tex);
  }
  _pruneCardTextures(){
    if(this.cardTextures.size<=12)return;
    const inUse=new Set(this.cards.flatMap(card=>[card.userData.frontMaterial.map,card.userData.inspectionMaterial.map]));
    for(const [path,texture] of this.cardTextures){
      if(this.cardTextures.size<=12)break;
      if(!texture.userData.loaded||inUse.has(texture))continue;
      this.cardTextures.delete(path);this.imageSources?.delete(path);this.textures.delete(texture);texture.dispose();
    }
  }
  async _move(card,to,rotation,duration,targetScale=1) {
    const start=card.position.clone(),q=card.quaternion.clone(),startScale=card.scale.x;
    const targetQ=new THREE.Quaternion().setFromEuler(rotation);
    return this._runAnimation(duration,t=>{const e=ease(t);card.position.lerpVectors(start,to,e);card.quaternion.copy(q).slerp(targetQ,e);card.scale.setScalar(startScale+(targetScale-startScale)*e);});
  }
  async dealCard(index,data,prophecy) {
    const card=this.cards[index];if(!card||this.destroyed)return;
    const epoch=this.animationEpoch,slot=SLOTS[index],deck=DECK;
    card.userData.cardData=data;card.userData.prophecy=prophecy;card.userData.state='dealing';card.visible=true;this._setCardTexture(card,data);
    card.position.set(deck.x,TABLE.top+deck.height+CARD.thickness/2+0.004,deck.z);card.rotation.set(Math.PI,deck.rotY,0);
    this.physics.hold(index,card.position,card.quaternion);
    if(!await this._move(card,new THREE.Vector3(deck.x,TRAVEL_Y,deck.z),new THREE.Euler(Math.PI,deck.rotY,0),240))return;
    if(!await this._move(card,new THREE.Vector3(slot.x,TRAVEL_Y,slot.z),new THREE.Euler(Math.PI,0,0),650))return;
    const flipY=TABLE.top+CARD.length/2+0.07;
    if(!await this._move(card,new THREE.Vector3(slot.x,flipY,slot.z),new THREE.Euler(Math.PI,0,0),180))return;
    if(!await this._runAnimation(580,t=>{card.rotation.set(Math.PI*(1-ease(t)),0,0);}))return;
    if(!await this._move(card,new THREE.Vector3(slot.x,CARD_REST_Y+0.045,slot.z),new THREE.Euler(0.018,0,0.008),320))return;
    if(this.reducedMotion){card.position.set(slot.x,CARD_REST_Y,slot.z);card.rotation.set(0,0,0);this.physics.place(index,slot);}
    else {this.physics.release(index,card.position,card.quaternion);if(!await this._runAnimation(650))return;}
    if(epoch!==this.animationEpoch||this.destroyed)return;
    card.userData.state='revealed';this.slotFrames[index].visible=false;
  }
  async inspectCard(index) {
    if(this.inspectionTask)return this.inspectionTask;
    this.inspectionTask=this._inspectCard(index).finally(()=>{this.inspectionTask=null;});
    return this.inspectionTask;
  }
  async _inspectCard(index) {
    const card=this.cards[index];if(!card||!['revealed','inspecting'].includes(card.userData.state))return;
    if(this.inspectedCardIndex===index)return this._uninspectCard();
    const epoch=this.animationEpoch;
    if(this.inspectedCardIndex!==null)await this._uninspectCard();
    if(epoch!==this.animationEpoch||this.destroyed)return;
    this.inspectedCardIndex=index;card.userData.state='inspecting';this.physics.hold(index,card.position,card.quaternion);
    if(!await this._move(card,new THREE.Vector3(card.position.x,TRAVEL_Y,card.position.z),new THREE.Euler(0,0,0),250))return;
    const focus=this._inspectionTransform();
    card.userData.inspectionMaterial.map=card.userData.frontMaterial.map;card.userData.inspectionMaterial.needsUpdate=true;card.material[2]=card.userData.inspectionMaterial;
    if(!await this._move(card,focus.position,focus.rotation,520,focus.scale))return;
    this.callbacks.onCardInspect?.(index,card.userData.cardData,card.userData.prophecy);
  }
  _inspectionTransform(){
    const width=this.canvas.clientWidth,height=this.canvas.clientHeight,layout=inspectionLayout(width,height),distance=2.2;
    const viewHeight=2*distance*Math.tan(THREE.MathUtils.degToRad(this.camera.fov)/2),viewWidth=viewHeight*this.camera.aspect;
    this.camera.updateMatrixWorld();
    const position=this.camera.localToWorld(new THREE.Vector3((layout.cardCenterX/width-0.5)*viewWidth,(0.5-layout.cardCenterY/height)*viewHeight,-distance));
    const quaternion=this.camera.quaternion.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2));
    return {position,rotation:new THREE.Euler().setFromQuaternion(quaternion),scale:viewHeight*(layout.cardHeight/height)/CARD.length};
  }
  async uninspectCard() {
    if(this.inspectionTask)await this.inspectionTask;
    if(this.destroyed)return;
    this.inspectionTask=this._uninspectCard().finally(()=>{this.inspectionTask=null;});
    return this.inspectionTask;
  }
  async _uninspectCard() {
    if(this.inspectedCardIndex===null)return;
    const index=this.inspectedCardIndex;this.inspectedCardIndex=null;
    const card=this.cards[index],slot=SLOTS[index];
    if(!await this._move(card,new THREE.Vector3(slot.x,TRAVEL_Y,slot.z),new THREE.Euler(0,0,0),420))return;
    if(!await this._move(card,new THREE.Vector3(slot.x,CARD_REST_Y+0.035,slot.z),new THREE.Euler(0,0,0),240))return;
    if(this.reducedMotion)this.physics.place(index,slot);else{this.physics.release(index,card.position,card.quaternion);if(!await this._runAnimation(400))return;}
    card.material[2]=card.userData.frontMaterial;card.scale.setScalar(1);
    card.userData.state='revealed';this.callbacks.onCardUninspect?.(index);
  }
  resetTable() {
    this.syncInstantState(SLOTS.map(()=>({state:'waiting'})));
  }
  _cancelAnimations() {
    clearTimeout(this._backgroundTimer);this._backgroundTimer=null;
    this.animationEpoch++;for(const animation of this.activeAnimations)animation.resolve(false);this.activeAnimations=[];
  }
  syncInstantState(positions) {
    this._cancelAnimations();this.inspectedCardIndex=null;
    if(this.renderer)this.renderer.shadowMap.needsUpdate=true;
    positions.forEach((pos,i)=>{
      const card=this.cards[i];this.physics.deactivate(i);card.scale.setScalar(1);card.material[2]=card.userData.frontMaterial;
      const revealed=pos.state==='revealed'&&pos.card;card.visible=!!revealed;this.slotFrames[i].visible=!revealed;
      card.userData.state=revealed?'revealed':'waiting';card.userData.cardData=revealed?pos.card:null;card.userData.prophecy=revealed?pos.prophecy:null;
      if(revealed){card.position.set(SLOTS[i].x,CARD_REST_Y,SLOTS[i].z);card.rotation.set(0,0,0);this._setCardTexture(card,pos.card);this.physics.place(i,SLOTS[i]);}
    });
    this._invalidate();
  }
  _bindEvents() {
    this._onPointerMove=e=>{
      const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;
      this.mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);this.pointerRaw.x=this.mouse.x;this.pointerRaw.y=this.mouse.y;
      this._pointerDirty=true;this._invalidate();
    };
    this._onPointerDown=e=>{if(e.button!==0)return;this._onPointerMove(e);this._handleClick();};
    this._onPointerLeave=()=>{this.pointerRaw.x=0;this.pointerRaw.y=0;this._pointerDirty=false;this.canvas.style.cursor='default';this._invalidate();};
    this.canvas.addEventListener('pointermove',this._onPointerMove);this.canvas.addEventListener('pointerdown',this._onPointerDown);this.canvas.addEventListener('pointerleave',this._onPointerLeave);
    this._onVisibilityChange=()=>{
      if(this._presentationHidden()){cancelAnimationFrame(this.animationFrameId);this.animationFrameId=null;this._lastFrameTime=null;}
      else this._invalidate();
    };
    document.addEventListener('visibilitychange',this._onVisibilityChange);
    const windowElement=this.canvas.closest('.window-app, .tarokka-3d-window')??this.canvas.parentElement?.parentElement;
    if(windowElement){this._visibilityObserver=new MutationObserver(this._onVisibilityChange);this._visibilityObserver.observe(windowElement,{attributes:true,attributeFilter:['class','style']});}
    this._onMotionChange=event=>{this.reducedMotion=event.matches;this._invalidate();};
    this._motionQuery.addEventListener('change',this._onMotionChange);
  }
  _hits(){
    const targets=[...this.cards.filter(c=>c.visible),...this.slotMeshes,...this.decks];
    // A restored/just-moved card can be clicked before the next rendered frame.
    this.camera.updateWorldMatrix(true,false);
    for(const target of targets)target.updateWorldMatrix(true,false);
    this.raycaster.setFromCamera(this.mouse,this.camera);
    return this.raycaster.intersectObjects(targets,false);
  }
  _handleClick() {
    this.raycaster.setFromCamera(this.mouse,this.camera);const hit=this._hits()[0]?.object;
    if(hit?.userData.isDeck){this.callbacks.onDeckClick?.();return;}
    if(Number.isInteger(hit?.userData.index)){
      const i=hit.userData.index,state=this.cards[i].userData.state;
      if(state==='revealed'||state==='inspecting'){if(this.callbacks.onInspectRequest)this.callbacks.onInspectRequest(i);else this.inspectCard(i);}
      else if(state==='waiting')this.callbacks.onCardClick?.(i);
    }else if(this.inspectedCardIndex!==null){if(this.callbacks.onInspectRequest)this.callbacks.onInspectRequest(null);else this.uninspectCard();}
  }
  _animate(timestamp=performance.now()) {
    this.animationFrameId=null;
    if(this.destroyed)return;
    if(this._presentationHidden()){this._lastFrameTime=null;return;}
    if(this._lastFrameTime!=null&&timestamp-this._lastFrameTime<FRAME_INTERVAL-0.5){this._requestFrame();return;}
    const delta=this._lastFrameTime==null?1/30:Math.min((timestamp-this._lastFrameTime)/1000,0.1);
    this._lastFrameTime=timestamp;this.elapsedTime+=delta;const time=this.elapsedTime;
    const moving=this.activeAnimations.length>0||this.physics.hasAwakeCards();
    for(let i=this.activeAnimations.length-1;i>=0;i--){
      const anim=this.activeAnimations[i];anim.elapsed+=delta*1000;const t=Math.min(anim.elapsed/anim.duration,1);anim.onUpdate(t);
      if(t===1){this.activeAnimations.splice(i,1);anim.resolve(true);}
    }
    for(let i=0;i<this.cards.length;i++)if(this.physics.cards[i].mode==='held'){
      const body=this.physics.cards[i];body.position.copy(this.cards[i].position);body.quaternion.copy(this.cards[i].quaternion);body.aabbNeedsUpdate=true;
    }
    this.physics.step(delta);
    for(let i=0;i<this.cards.length;i++)if(this.physics.cards[i].mode==='dynamic'){
      const body=this.physics.cards[i];this.cards[i].position.copy(body.position);this.cards[i].quaternion.copy(body.quaternion);
    }
    const breath=this.reducedMotion?0:Math.sin(time*1.4)*0.003;this.madamEvaMesh.scale.set(1+breath/2,1+breath,1);
    this.candleLights.forEach(c=>{const flicker=this.reducedMotion?0:Math.sin(time*11+c.seed)*0.035+Math.sin(time*23+c.seed)*0.015;c.light.intensity=0.70+flicker;c.flame.scale.y=2.4+flicker;});
    updateLanterns(this.lanterns,time,this.reducedMotion);
    const px=this.reducedMotion?0:this.pointerRaw.x*0.055,py=this.reducedMotion?0:this.pointerRaw.y*0.035;
    const targetX=this.cameraDefaultPos.x+px,targetY=this.cameraDefaultPos.y+py;
    this.camera.position.x=Math.abs(targetX-this.camera.position.x)<0.00001?targetX:this.camera.position.x+(targetX-this.camera.position.x)*0.04;
    this.camera.position.y=Math.abs(targetY-this.camera.position.y)<0.00001?targetY:this.camera.position.y+(targetY-this.camera.position.y)*0.04;this.camera.lookAt(this.cameraTarget);
    if(this.inspectedCardIndex!==null&&!this.inspectionTask){
      const card=this.cards[this.inspectedCardIndex],focus=this._inspectionTransform();card.position.copy(focus.position);card.rotation.copy(focus.rotation);card.scale.setScalar(focus.scale);
    }
    if(moving)this.renderer.shadowMap.needsUpdate=true;
    if(this._pointerDirty){this._pointerDirty=false;this.canvas.style.cursor=this._hits().length?'pointer':'default';}
    this.renderer.render(this.scene,this.camera);
    if(!this.reducedMotion||this.activeAnimations.length||this.physics.hasAwakeCards())this._requestFrame();
  }
  _requestFrame(){
    if(this.destroyed||this.animationFrameId!=null||!this.renderer||this._presentationHidden()||typeof requestAnimationFrame!=='function')return;
    this.animationFrameId=requestAnimationFrame(time=>this._animate(time));
  }
  _invalidate(){this._requestFrame();}
  _runAnimation(duration,onUpdate=()=>{}) {
    if(this.destroyed)return Promise.resolve(false);
    if(this.reducedMotion||this._presentationHidden()){onUpdate(1);if(this.renderer)this.renderer.shadowMap.needsUpdate=true;this._invalidate();return Promise.resolve(true);}
    return new Promise(resolve=>{
      this.activeAnimations.push({duration,elapsed:0,onUpdate,resolve});
      this._requestFrame();
      this._watchBackgroundAnimations();
    });
  }
  _presentationHidden(){return globalThis.document?.hidden||!!this.canvas?.closest?.('.minimized');}
  _watchBackgroundAnimations(){
    if(this._backgroundTimer||this.destroyed)return;
    this._backgroundTimer=setTimeout(()=>{
      this._backgroundTimer=null;
      if(this.destroyed)return;
      if(this._presentationHidden()){
        // Hidden tables do not render frames. Complete their movements so the
        // authority remains available to players; no extra WebGL work is done.
        const pending=this.activeAnimations.splice(0);
        for(const animation of pending){animation.onUpdate(1);animation.resolve(true);}
      }
      if(this.activeAnimations.length)this._watchBackgroundAnimations();
    },200);
  }
  resize(width,height) {
    if(!width||!height||this.destroyed)return;
    if(this._width===width&&this._height===height&&this._dpr===window.devicePixelRatio)return;
    this._width=width;this._height=height;this._dpr=window.devicePixelRatio;
    const aspect=width/height;
    // Fit the complete round rim in narrow windows without jumping at a breakpoint.
    this.cameraDefaultPos.z=Math.max(VIEW.eye.z,VIEW.eye.z/Math.min(1,aspect/VIEW.fitAspect));
    this.camera.position.z=this.cameraDefaultPos.z;this.camera.aspect=aspect;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(renderPixelRatio(width,height,window.devicePixelRatio));this.renderer.setSize(width,height,false);this._invalidate();
  }
  destroy() {
    if(this.destroyed)return;
    this.destroyed=true;this._cancelAnimations();cancelAnimationFrame(this.animationFrameId);
    this.canvas.removeEventListener('pointermove',this._onPointerMove);this.canvas.removeEventListener('pointerdown',this._onPointerDown);this.canvas.removeEventListener('pointerleave',this._onPointerLeave);
    document.removeEventListener('visibilitychange',this._onVisibilityChange);this._visibilityObserver?.disconnect();
    this._motionQuery?.removeEventListener('change',this._onMotionChange);
    this.physics?.destroy();const geometries=new Set(),materials=new Set();
    this.scene?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of [o.material].flat())materials.add(m);o.shadow?.map?.dispose();o.shadow?.mapPass?.dispose();});
    for(const card of this.cards){materials.add(card.userData.frontMaterial);materials.add(card.userData.inspectionMaterial);}
    for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of this.textures)t.dispose();
    this.textures.clear();this.cardTextures.clear();this.imageSources.clear();
    this.renderer?.dispose();this.renderer?.forceContextLoss();
  }
}
