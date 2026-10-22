import * as THREE from './lib/three.module.min.js';

export const FRAME_INTERVAL=1000/30;
export function renderPixelRatio(width,height,dpr=1){
  return Math.min(dpr||1,1,Math.sqrt(1200000/Math.max(1,width*height)));
}

// Combine opaque, immobile objects sharing a material into one draw call.
// Cards, hit targets, Eva, transparent glass and animated flames stay separate.
export function batchStaticMeshes(scene,excluded=new Set()){
  scene.updateMatrixWorld(true);
  const groups=new Map(),retired=new Set();
  const inverseScene=new THREE.Matrix4().copy(scene.matrixWorld).invert();
  scene.traverse(mesh=>{
    if(!mesh.isMesh||mesh.children.length||excluded.has(mesh)||Array.isArray(mesh.material)||mesh.material.transparent||mesh.material.isShaderMaterial||mesh.isSkinnedMesh||mesh.isInstancedMesh)return;
    for(let parent=mesh;parent;parent=parent.parent)if(!parent.visible||excluded.has(parent))return;
    if(Object.keys(mesh.geometry.morphAttributes).length||mesh.geometry.drawRange.start!==0||mesh.geometry.drawRange.count!==Infinity)return;
    const attributes=Object.entries(mesh.geometry.attributes).sort(([a],[b])=>a.localeCompare(b));
    if(attributes.some(([,a])=>a.isInterleavedBufferAttribute))return;
    const signature=attributes.map(([name,a])=>`${name}:${a.itemSize}:${a.normalized}:${a.array.constructor.name}`).join(',');
    const key=`${mesh.material.uuid}:${mesh.castShadow}:${mesh.receiveShadow}:${mesh.layers.mask}:${mesh.renderOrder}:${signature}`;
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);
  });
  let removed=0;
  for(const meshes of groups.values()){
    if(meshes.length<2)continue;
    const pieces=meshes.map(mesh=>mesh.geometry.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverseScene,mesh.matrixWorld)));
    const geometry=new THREE.BufferGeometry();
    for(const name of Object.keys(pieces[0].attributes)){
      const attribute=pieces[0].getAttribute(name),size=attribute.itemSize;
      const values=new attribute.array.constructor(pieces.reduce((sum,piece)=>sum+piece.getAttribute(name).array.length,0));
      let offset=0;for(const piece of pieces){const array=piece.getAttribute(name).array;values.set(array,offset);offset+=array.length;}
      geometry.setAttribute(name,new THREE.BufferAttribute(values,size,attribute.normalized));
    }
    const indices=[];let vertexOffset=0;
    for(const piece of pieces){
      const count=piece.index?.count??piece.attributes.position.count;
      for(let i=0;i<count;i++)indices.push(vertexOffset+(piece.index?.getX(i)??i));
      vertexOffset+=piece.attributes.position.count;
    }
    geometry.setIndex(indices);geometry.computeBoundingBox();geometry.computeBoundingSphere();
    const first=meshes[0],batch=new THREE.Mesh(geometry,first.material);
    batch.name='static-camp-batch';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;batch.layers.mask=first.layers.mask;batch.renderOrder=first.renderOrder;
    batch.matrixAutoUpdate=false;
    scene.add(batch);
    for(const mesh of meshes){mesh.parent.remove(mesh);retired.add(mesh.geometry);}
    for(const piece of pieces)piece.dispose();
    removed+=meshes.length-1;
  }
  // One traversal for the whole pass, including geometry shared across groups.
  const live=new Set();scene.traverse(object=>{if(object.geometry)live.add(object.geometry);});
  for(const old of retired)if(!live.has(old))old.dispose();
  return removed;
}
