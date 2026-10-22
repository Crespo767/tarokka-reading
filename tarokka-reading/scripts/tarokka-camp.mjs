import * as THREE from './lib/three.module.min.js';
import { CAMP, TABLE, TABLE_LEGS } from './tarokka-layout.mjs';

const asset=path=>`modules/tarokka-reading/assets/${path}`;
const point=(x,y,z)=>new THREE.Vector3(x,y,z);

function gridSurface(columns,rows,sample,uScale=1,vScale=1){
  const positions=[],uvs=[],indices=[];
  for(let row=0;row<=rows;row++)for(let col=0;col<=columns;col++){
    const u=col/columns,v=row/rows,p=sample(u,v);positions.push(p.x,p.y,p.z);uvs.push(u*uScale,v*vScale);
  }
  for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const a=row*(columns+1)+col,b=a+1,c=a+columns+1,d=c+1;indices.push(a,c,b,b,c,d);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function roofPoint(u,v){
  const angle=u*Math.PI*2,r=CAMP.tentRadius*v;
  return point(Math.sin(angle)*r,CAMP.apexY+(CAMP.eaveY-CAMP.apexY)*v-Math.sin(v*Math.PI)*0.33+Math.sin(angle*16)*0.035*v,CAMP.apexZ+(CAMP.centerZ-CAMP.apexZ)*v+Math.cos(angle)*r);
}
export function wallPoint(u,v){
  const angle=CAMP.entranceHalfAngle+u*(Math.PI*2-2*CAMP.entranceHalfAngle);
  const radius=CAMP.tentRadius-Math.sin(v*Math.PI)*0.13+Math.sin(angle*13)*0.035*Math.sin(v*Math.PI);
  return point(Math.sin(angle)*radius,CAMP.floorY+(CAMP.eaveY-CAMP.floorY)*v,CAMP.centerZ+Math.cos(angle)*radius);
}
export const createRoofGeometry=()=>gridSurface(128,24,roofPoint,8,3);
export const createWallGeometry=()=>gridSurface(128,16,wallPoint,8,2);

function beam(owner,a,b,width,material,parent=owner.scene){
  const axis=b.clone().sub(a),mesh=owner._mesh(new THREE.BoxGeometry(width,axis.length(),width),material,parent);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);mesh.quaternion.setFromUnitVectors(point(0,1,0),axis.normalize());return mesh;
}
function rope(owner,points,radius,material){
  const curve=new THREE.CatmullRomCurve3(points);const mesh=owner._mesh(new THREE.TubeGeometry(curve,32,radius,5,false),material);mesh.castShadow=false;return mesh;
}
function repeatingTexture(owner,path){
  return owner._texture(asset(path),tex=>{tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.anisotropy=Math.min(8,owner.renderer.capabilities.getMaxAnisotropy());});
}
function groundRug(owner){
  const tex=owner._texture(asset('materials/threadbare-rug.webp'));
  const geometry=gridSurface(24,24,(u,v)=>point((u-0.5)*7.3,CAMP.floorY+0.035+Math.sin(u*19)*Math.sin(v*17)*0.015,(v-0.5)*5.2+1.2));
  const rug=owner._mesh(geometry,new THREE.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:0.009,roughness:1,alphaTest:0.10,side:THREE.DoubleSide}));
  rug.name='threadbare-travel-rug';rug.castShadow=false;
}

export function buildCampEnvironment(owner){
  const earthTex=repeatingTexture(owner,'materials/packed-earth.webp');earthTex.repeat.set(5,5);
  const earth=owner._mesh(new THREE.CircleGeometry(19,128),new THREE.MeshStandardMaterial({map:earthTex,bumpMap:earthTex,bumpScale:0.06,roughness:1,color:0x807967}));earth.rotation.x=-Math.PI/2;earth.position.y=CAMP.floorY;earth.name='packed-earth';earth.castShadow=false;
  groundRug(owner);
  const canvasTex=repeatingTexture(owner,'materials/tent-canvas.webp');
  const canvasMat=new THREE.MeshStandardMaterial({map:canvasTex,bumpMap:canvasTex,bumpScale:0.025,color:0x796852,roughness:1,side:THREE.DoubleSide});
  const walls=owner._mesh(createWallGeometry(),canvasMat);walls.name='enclosing-patched-tent-walls';walls.castShadow=false;
  const roof=owner._mesh(createRoofGeometry(),canvasMat);roof.name='sagging-canvas-roof';roof.castShadow=false;
  const oakTex=repeatingTexture(owner,'materials/aged-oak.webp');
  const timber=new THREE.MeshStandardMaterial({map:oakTex,bumpMap:oakTex,bumpScale:0.035,color:0x85725a,roughness:0.98});
  const hemp=new THREE.MeshStandardMaterial({color:0x6f6047,roughness:1});
  const iron=new THREE.MeshStandardMaterial({color:0x241e19,roughness:0.95,metalness:0.25});
  // The center mast is behind Eva; the playable table never intersects a pole.
  const mast=owner._mesh(new THREE.CylinderGeometry(0.095,0.14,CAMP.apexY-CAMP.floorY,12),timber);mast.position.set(0,(CAMP.apexY+CAMP.floorY)/2,CAMP.apexZ);mast.name='central-tent-mast';
  for(let i=0;i<12;i++){
    const u=i/12;
    rope(owner,[roofPoint(u,0.015),roofPoint(u,0.3),roofPoint(u,0.65),roofPoint(u,0.99)],0.014,hemp);
    const angle=u*Math.PI*2;if(Math.min(angle,Math.PI*2-angle)<CAMP.entranceHalfAngle)continue;
    const top=wallPoint((angle-CAMP.entranceHalfAngle)/(Math.PI*2-2*CAMP.entranceHalfAngle),1);
    beam(owner,point(top.x,CAMP.floorY,top.z),top,0.11,timber);
    rope(owner,[point(top.x,CAMP.floorY+0.04,top.z),point(top.x*0.99,0.6,top.z),top],0.012,hemp);
  }
  for(const side of [-1,1]){
    const angle=side*CAMP.entranceHalfAngle,x=Math.sin(angle)*CAMP.tentRadius,z=CAMP.centerZ+Math.cos(angle)*CAMP.tentRadius;
    beam(owner,point(x,CAMP.floorY,z),point(x,CAMP.eaveY,z),0.16,timber);
    const flap=gridSurface(12,16,(u,v)=>point(x+side*(u*1.25+Math.sin(v*Math.PI)*0.2),CAMP.floorY+v*(CAMP.eaveY-CAMP.floorY),z+Math.sin(u*Math.PI)*0.35+u*0.35),1,2);
    const cloth=owner._mesh(flap,canvasMat);cloth.name=`tied-back-entrance-flap-${side}`;cloth.castShadow=false;
    rope(owner,[point(x,CAMP.floorY+1.8,z+0.03),point(x+side*0.55,CAMP.floorY+1.8,z+0.35),point(x+side*1.2,CAMP.floorY+1.8,z+0.2)],0.018,hemp);
  }
  // Travel furniture sits against the walls, leaving space to enter and kneel.
  const chest=new THREE.Group();chest.position.set(-4.5,CAMP.floorY,-2.7);chest.rotation.y=0.2;owner.scene.add(chest);chest.name='battered-travel-chest';
  const box=owner._mesh(new THREE.BoxGeometry(1.7,0.82,0.95),timber,chest);box.position.y=0.46;
  const lidShape=new THREE.Shape();lidShape.moveTo(-0.48,0);lidShape.lineTo(0.48,0);lidShape.quadraticCurveTo(0.48,0.45,0,0.45);lidShape.quadraticCurveTo(-0.48,0.45,-0.48,0);
  const lid=owner._mesh(new THREE.ExtrudeGeometry(lidShape,{depth:1.7,bevelEnabled:false,steps:1,curveSegments:12}),timber,chest);lid.rotation.y=Math.PI/2;lid.position.set(-0.85,0.86,0);
  for(const x of [-0.56,0.56]){const strap=owner._mesh(new THREE.BoxGeometry(0.065,0.86,0.97),iron,chest);strap.position.set(x,0.47,0);}
  owner._mesh(new THREE.BoxGeometry(0.16,0.19,0.04),iron,chest).position.set(0,0.7,0.51);
  const barrel=new THREE.Group();barrel.position.set(4.7,CAMP.floorY,-3.4);owner.scene.add(barrel);barrel.name='wine-cask';
  const barrelProfile=[[0.50,0],[0.57,0.15],[0.65,0.65],[0.62,1.12],[0.50,1.4]].map(([x,y])=>new THREE.Vector2(x,y));owner._mesh(new THREE.LatheGeometry(barrelProfile,20),timber,barrel);
  for(const y of [0.15,0.67,1.23]){const band=owner._mesh(new THREE.TorusGeometry(y===0.67?0.65:0.56,0.035,6,32),iron,barrel);band.rotation.x=Math.PI/2;band.position.y=y;}
  const sackMat=new THREE.MeshStandardMaterial({map:canvasTex,bumpMap:canvasTex,bumpScale:0.025,color:0x746044,roughness:1});
  for(const [x,z,r]of [[3.9,-4.4,0.6],[-4.8,-4.7,0.5]]){const sack=owner._mesh(new THREE.SphereGeometry(r,16,12),sackMat);sack.scale.set(0.85,1.35,0.85);sack.position.set(x,CAMP.floorY+r*1.2,z);rope(owner,[point(x-0.12,CAMP.floorY+r*2.25,z),point(x,CAMP.floorY+r*2.3,z+0.10),point(x+0.12,CAMP.floorY+r*2.25,z)],0.025,hemp);}
  const straw=[];for(let i=0;i<170;i++){const a=i*2.39996,r=3.9+(i%31)/31*5.5,x=Math.sin(a)*r,z=Math.cos(a)*r-1;straw.push(x,CAMP.floorY+0.012,z,x+Math.sin(i*3)*0.16,CAMP.floorY+0.014,z+Math.cos(i*5)*0.19);}
  const strawGeo=new THREE.BufferGeometry();strawGeo.setAttribute('position',new THREE.Float32BufferAttribute(straw,3));owner.scene.add(new THREE.LineSegments(strawGeo,new THREE.LineBasicMaterial({color:0x61523b,transparent:true,opacity:0.55})));
  // The rail intersects the central mast in the same depth plane.
  const railY=CAMP.eaveY+0.05,railZ=CAMP.apexZ;
  const railTimber=timber;
  const rail=beam(owner,point(-6.45,railY,railZ),point(6.45,railY,railZ),0.18,railTimber);
  rail.name='lantern-support-crossbeam';
  const joint=owner._mesh(new THREE.BoxGeometry(0.28,0.30,0.27),railTimber);joint.position.set(0,railY,railZ);joint.name='mast-crossbeam-joint';
  for(const side of [-1,1]){
    const brace=beam(owner,point(side*0.045,railY-0.63,railZ),point(side*0.92,railY-0.04,railZ),0.095,railTimber);brace.name='central-mast-knee-brace';
  }
  // Tight lashings wrap the crossing timbers and the front of the joint.
  for(let i=0;i<4;i++){
    const offset=(i-1.5)*0.025;
    for(const side of [-1,1]){
      const wrap=rope(owner,[point(-0.18,railY+side*0.18+offset,railZ+0.15),point(0.18,railY-side*0.18+offset,railZ+0.15),point(0.18,railY-side*0.18+offset,railZ-0.15),point(-0.18,railY+side*0.18+offset,railZ-0.15),point(-0.18,railY+side*0.18+offset,railZ+0.15)],0.013,hemp);wrap.name='mast-crossbeam-lashing';
    }
  }
  for(const x of [-6.45,6.45]){
    const post=beam(owner,point(x,CAMP.floorY,railZ),point(x,railY+0.09,railZ),0.16,timber);post.name='lantern-support-post';
    beam(owner,point(x,CAMP.eaveY-0.65,railZ),point(x-Math.sign(x)*0.65,railY,railZ),0.09,timber);
  }
  owner.lanterns=[buildHangingLantern(owner,-3.8,railZ,0),buildHangingLantern(owner,3.8,railZ,1.7)];
  const moon=new THREE.SpotLight(0x7f8b9b,0.25,24,0.65,0.9);moon.position.set(0,3.8,9);moon.target.position.set(0,CAMP.floorY,1.3);owner.scene.add(moon,moon.target);
  return {roof,walls,earth};
}

// A level cloth resting within the wooden rim, without a hanging skirt.
export function createTableClothGeometry(){
  // The cloth is flat: only the irregular outer edge needs tessellation.
  const positions=[0,TABLE.top+0.0004,0],uvs=[0.5,0.5],indices=[];
  for(let i=0;i<128;i++){
    const a=i/128*Math.PI*2,r=2.865+0.014*Math.sin(a*5)+0.009*Math.sin(a*11);
    const x=Math.sin(a)*r,z=Math.cos(a)*r;
    positions.push(x,TABLE.top+0.0004,z);uvs.push(0.5+x/5.8,0.5+z/5.8);
    indices.push(0,i+1,(i+1)%128+1);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));
  geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
function tableCloth(owner){
  const g=createTableClothGeometry(),pos=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<pos.count;i++)uv.setXY(i,0.5+pos.getX(i)/5.8,0.5+pos.getZ(i)/5.8);
  const tex=owner._makeClothTexture();
  const cloth=owner._mesh(g,new THREE.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:0.003,color:0xb7b4af,roughness:1,side:THREE.DoubleSide}));
  cloth.name='worn-black-velvet-cloth';cloth.castShadow=false;
}

export function createFlameMaterial(seed=0){
  return new THREE.ShaderMaterial({
    uniforms:{uTime:{value:0},uSeed:{value:seed}},transparent:true,depthWrite:false,toneMapped:false,
    vertexShader:`
      uniform float uTime; uniform float uSeed;
      varying vec3 vFlame;
      void main(){
        vFlame=position;
        vec3 p=position;
        float h=clamp(p.y/0.30,0.0,1.0);
        float pulse=sin(uTime*8.1+uSeed)+0.4*sin(uTime*17.3+uSeed);
        p.x+=h*h*(sin(uTime*6.7+h*3.0+uSeed)*0.026);
        p.z+=h*h*cos(uTime*8.4+uSeed)*0.014;
        p.y*=1.0+pulse*0.10;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);
      }`,
    fragmentShader:`
      uniform float uTime; uniform float uSeed;
      varying vec3 vFlame;
      void main(){
        float h=clamp(vFlame.y/0.30,0.0,1.0);
        float flow=sin(h*24.0-uTime*12.0+uSeed)*0.5+0.5;
        float core=1.0-smoothstep(0.08,0.78,h);
        vec3 color=mix(vec3(1.0,0.23,0.018),vec3(1.0,0.87,0.40),core);
        color+=vec3(0.10,0.06,0.0)*flow;
        float alpha=(1.0-smoothstep(0.78,1.0,h))*0.86;
        gl_FragColor=vec4(color,alpha);
      }`
  });
}
export function updateLanterns(lanterns,time,reducedMotion=false){
  for(const lantern of lanterns??[]){
    const t=reducedMotion?0:time;
    lantern.flame.material.uniforms.uTime.value=t;
    const flicker=reducedMotion?0:Math.sin(t*8.1+lantern.seed)*0.045+Math.sin(t*17.3+lantern.seed)*0.022;
    lantern.light.intensity=1.15+flicker;
    lantern.glow.material.opacity=0.22+flicker*0.25;
  }
}
export function buildHangingLantern(owner,x,z,seed){
  const lantern=new THREE.Group();lantern.name='hanging-iron-oil-lantern';lantern.position.set(x,0.35,z);owner.scene.add(lantern);
  const iron=new THREE.MeshStandardMaterial({color:0x39302a,roughness:0.81,metalness:0.65});
  const brass=new THREE.MeshStandardMaterial({color:0x81603b,roughness:0.68,metalness:0.6});
  const glass=new THREE.MeshStandardMaterial({color:0xe6bb79,roughness:0.24,metalness:0.05,transparent:true,opacity:0.075,depthWrite:false,side:THREE.DoubleSide});
  const base=owner._mesh(new THREE.CylinderGeometry(0.27,0.23,0.075,4),iron,lantern);base.rotation.y=Math.PI/4;
  const top=owner._mesh(new THREE.CylinderGeometry(0.27,0.27,0.05,4),iron,lantern);top.position.y=0.68;top.rotation.y=Math.PI/4;
  for(const a of [-1,1])for(const b of [-1,1]){
    const upright=owner._mesh(new THREE.BoxGeometry(0.028,0.67,0.028),iron,lantern);upright.position.set(a*0.183,0.34,b*0.183);
  }
  for(const side of [-1,1]){
    const front=owner._mesh(new THREE.PlaneGeometry(0.34,0.58),glass,lantern);front.position.set(0,0.35,side*0.18);front.castShadow=false;
    const pane=owner._mesh(new THREE.PlaneGeometry(0.34,0.58),glass,lantern);pane.position.set(side*0.18,0.35,0);pane.rotation.y=Math.PI/2;pane.castShadow=false;
  }
  const cap=owner._mesh(new THREE.CylinderGeometry(0.075,0.32,0.23,4),iron,lantern);cap.rotation.y=Math.PI/4;cap.position.y=0.81;
  const chimney=owner._mesh(new THREE.CylinderGeometry(0.06,0.06,0.10,8),iron,lantern);chimney.position.y=0.97;
  const ring=owner._mesh(new THREE.TorusGeometry(0.072,0.014,6,16),iron,lantern);ring.position.y=1.075;
  const railY=CAMP.eaveY+0.05;
  // Iron strap wraps the wooden rail; its underside holds a closed hanging eye.
  for(const side of [-1,1]){
    const strap=owner._mesh(new THREE.BoxGeometry(0.10,0.23,0.026),iron);strap.position.set(x,railY,z+side*0.103);strap.name='lantern-rail-strap';
    const rivet=owner._mesh(new THREE.SphereGeometry(0.022,8,6),brass);rivet.position.set(x,railY+0.035,z+side*0.123);rivet.scale.z=0.45;
  }
  const saddle=owner._mesh(new THREE.BoxGeometry(0.10,0.026,0.232),iron);saddle.position.set(x,railY-0.101,z);
  const eye=owner._mesh(new THREE.TorusGeometry(0.065,0.013,8,20),iron);eye.position.set(x,railY-0.175,z);eye.name='lantern-fixed-hanging-eye';
  const chainStart=lantern.position.y+1.15,chainEnd=eye.position.y-0.075;
  const linkCount=Math.ceil((chainEnd-chainStart)/0.095);
  eye.rotation.y=(linkCount%2+1)*Math.PI/2;
  for(let i=0;i<=linkCount;i++){
    const link=owner._mesh(new THREE.TorusGeometry(0.038,0.009,5,10),iron);link.position.set(x,chainStart+i*(chainEnd-chainStart)/linkCount,z);link.scale.y=1.45;link.rotation.y=i%2*Math.PI/2;link.castShadow=false;
  }
  const reservoir=owner._mesh(new THREE.SphereGeometry(0.115,16,8),brass,lantern);reservoir.scale.y=0.48;reservoir.position.y=0.10;
  const burner=owner._mesh(new THREE.CylinderGeometry(0.025,0.04,0.045,12),brass,lantern);burner.position.y=0.17;
  const wick=owner._mesh(new THREE.CylinderGeometry(0.009,0.009,0.022,8),new THREE.MeshStandardMaterial({color:0x1c130c}),lantern);wick.position.y=0.20;
  const profile=[[0,0],[0.028,0.02],[0.044,0.07],[0.037,0.13],[0.019,0.21],[0,0.30]].map(([r,y])=>new THREE.Vector2(r,y));
  const flame=owner._mesh(new THREE.LatheGeometry(profile,20),createFlameMaterial(seed),lantern);flame.position.y=0.205;flame.castShadow=false;flame.receiveShadow=false;
  const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:owner._glowTexture(),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,opacity:0.22}));glow.position.y=0.37;glow.scale.set(0.9,1.05,0.9);lantern.add(glow);
  const light=new THREE.PointLight(0xffad62,1.15,10,1.4);light.position.y=0.40;lantern.add(light);
  return {group:lantern,flame,light,glow,seed};
}

export function buildMedievalTable(owner){
  const group=new THREE.Group();group.name='old-low-round-table';owner.scene.add(group);
  const tex=repeatingTexture(owner,'materials/aged-oak.webp');
  const oak=new THREE.MeshStandardMaterial({map:tex,bumpMap:tex,bumpScale:0.012,color:0xb5a48c,roughness:0.98,metalness:0});
  const uprightTex=owner._texture(asset('materials/aged-oak.webp'),t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.center.set(0.5,0.5);t.rotation=Math.PI/2;t.repeat.set(0.22,1.2);});
  const uprightOak=new THREE.MeshStandardMaterial({map:uprightTex,bumpMap:uprightTex,bumpScale:0.009,color:0x79664d,roughness:1});
  const edgeTex=owner._texture(asset('materials/aged-oak.webp'),t=>{t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,0.065);t.offset.y=0.22;});
  const edgeOak=new THREE.MeshStandardMaterial({map:edgeTex,bumpMap:edgeTex,bumpScale:0.012,color:0xa18b70,roughness:1});
  const iron=new THREE.MeshStandardMaterial({color:0x28231c,roughness:0.95,metalness:0.2});
  const top=owner._mesh(new THREE.CylinderGeometry(TABLE.radius,TABLE.radius-0.02,TABLE.thickness,96),[edgeOak,oak,oak],group);top.position.y=TABLE.top-TABLE.thickness/2-0.004;top.name='rough-plank-tabletop';
  for(const [i,leg]of TABLE_LEGS.entries()){
    const mesh=beam(owner,point(leg.foot.x,leg.foot.y+0.015,leg.foot.z),point(leg.top.x,leg.top.y,leg.top.z),0.28,uprightOak,group);mesh.name=`splayed-wooden-leg-${i}`;
    const peg=owner._mesh(new THREE.CylinderGeometry(0.055,0.055,0.33,8),oak,group);peg.rotation.z=Math.PI/2;peg.position.set(leg.top.x,-0.39,leg.top.z);
  }
  // Plain mortise rails and stretchers make the load path to the four feet visible.
  for(const z of [-1.6,1.6]){beam(owner,point(-1.78,-0.37,z),point(1.78,-0.37,z),0.23,uprightOak,group);beam(owner,point(-1.83,-1.47,z*1.10),point(1.83,-1.47,z*1.10),0.15,uprightOak,group);}
  for(const x of [-1.65,1.65])beam(owner,point(x,-0.37,-1.65),point(x,-0.37,1.65),0.23,uprightOak,group);
  beam(owner,point(0,-1.47,-1.76),point(0,-1.47,1.76),0.16,uprightOak,group);
  for(const x of [-1.65,1.65])for(const z of [-1.6,1.6]){const nail=owner._mesh(new THREE.SphereGeometry(0.035,8,6),iron,group);nail.scale.y=0.3;nail.position.set(x,TABLE.top+0.002,z);}
  tableCloth(owner);return group;
}
