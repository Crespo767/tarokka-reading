import * as CANNON from './lib/cannon-es.js';
import { TABLE, CARD, CARD_REST_Y, DECK, CANDLES, CRYSTAL, CAMP, TABLE_LEGS } from './tarokka-layout.mjs';

export class TarokkaPhysics {
  constructor({showCrystal=false}={}) {
    this.world=new CANNON.World({gravity:new CANNON.Vec3(0,-9.82,0),allowSleep:true});
    this.world.solver.iterations=24;
    this.world.solver.tolerance=1e-7;
    this.surface=new CANNON.Material('velvet');
    this.paper=new CANNON.Material('paper');
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.surface,this.paper,{friction:0.65,restitution:0.025,contactEquationStiffness:1e7,contactEquationRelaxation:4}));
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.paper,this.paper,{friction:0.5,restitution:0.02}));
    this.world.defaultContactMaterial.friction=0.65;
    this.world.defaultContactMaterial.restitution=0.025;
    this.staticBodies=[];
    this.table=this.addStatic(new CANNON.Cylinder(TABLE.radius,TABLE.radius,TABLE.thickness,48),0,TABLE.top-TABLE.thickness/2,0,'table');
    const earth=this.addStatic(new CANNON.Plane(),0,CAMP.floorY,0,'earth');earth.quaternion.setFromEuler(-Math.PI/2,0,0);
    for(const [i,leg] of TABLE_LEGS.entries()){
      const a=new CANNON.Vec3(leg.top.x,leg.top.y,leg.top.z),b=new CANNON.Vec3(leg.foot.x,leg.foot.y,leg.foot.z);
      const axis=a.vsub(b),center=a.vadd(b).scale(0.5);const length=axis.length();axis.normalize();
      const body=this.addStatic(new CANNON.Box(new CANNON.Vec3(0.14,length/2,0.14)),center.x,center.y,center.z,`table-leg-${i}`);
      body.quaternion.setFromVectors(new CANNON.Vec3(0,1,0),axis);
    }
    {
      const d=DECK;
      const body=this.addStatic(new CANNON.Box(new CANNON.Vec3(CARD.width/2,d.height/2,CARD.length/2)),d.x,TABLE.top+d.height/2,d.z,'deck-0');
      body.quaternion.setFromEuler(0,d.rotY,0);
    }
    for(const [i,c] of CANDLES.entries())this.addStatic(new CANNON.Cylinder(c.radius,c.radius,c.height,16),c.x,TABLE.top+c.height/2,c.z,`candle-${i}`);
    if(showCrystal) {
      this.addStatic(new CANNON.Cylinder(CRYSTAL.standRadius,CRYSTAL.standRadius,CRYSTAL.standHeight,24),CRYSTAL.x,TABLE.top+CRYSTAL.standHeight/2,CRYSTAL.z,'crystal-stand');
      this.addStatic(new CANNON.Sphere(CRYSTAL.radius),CRYSTAL.x,TABLE.top+CRYSTAL.standHeight+CRYSTAL.radius,CRYSTAL.z,'crystal');
    }
    this.cards=Array.from({length:5},(_,index)=>{
      const body=new CANNON.Body({mass:0.015,material:this.paper,shape:new CANNON.Box(new CANNON.Vec3(CARD.width/2,CARD.thickness/2,CARD.length/2)),linearDamping:0.4,angularDamping:0.7,allowSleep:true,sleepSpeedLimit:0.045,sleepTimeLimit:0.35});
      body.name=`card-${index}`;body.mode='inactive';return body;
    });
  }
  addStatic(shape,x,y,z,name) {
    const body=new CANNON.Body({mass:0,material:this.surface,shape,position:new CANNON.Vec3(x,y,z)});
    body.name=name;this.world.addBody(body);this.staticBodies.push(body);return body;
  }
  attach(body) {if(!this.world.bodies.includes(body))this.world.addBody(body);}
  hold(index,position,quaternion) {
    const body=this.cards[index];this.attach(body);
    body.type=CANNON.Body.KINEMATIC;body.collisionFilterMask=0;body.mode='held';
    body.position.copy(position);if(quaternion)body.quaternion.copy(quaternion);
    body.velocity.setZero();body.angularVelocity.setZero();body.updateMassProperties();body.aabbNeedsUpdate=true;body.wakeUp();return body;
  }
  release(index,position,quaternion,{sleep=false}={}) {
    const body=this.cards[index];this.attach(body);body.type=CANNON.Body.DYNAMIC;
    body.mass=0.015;body.collisionFilterMask=-1;body.mode='dynamic';
    body.position.copy(position);body.quaternion.copy(quaternion);body.velocity.setZero();body.angularVelocity.setZero();
    body.updateMassProperties();body.aabbNeedsUpdate=true;body.wakeUp();if(sleep)body.sleep();return body;
  }
  place(index,slot) {return this.release(index,{x:slot.x,y:CARD_REST_Y,z:slot.z},new CANNON.Quaternion(),{sleep:true});}
  deactivate(index) {const body=this.cards[index];this.world.removeBody(body);body.mode='inactive';body.velocity.setZero();body.angularVelocity.setZero();}
  hasAwakeCards(){return this.cards.some(body=>body.mode==='dynamic'&&body.sleepState!==CANNON.Body.SLEEPING);}
  step(delta) {if(this.hasAwakeCards())this.world.step(1/120,Math.min(Math.max(delta,0),1/20),8);}
  destroy(){for(const body of [...this.world.bodies])this.world.removeBody(body);}
}
