import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TarokkaPhysics} from '../tarokka-reading/scripts/tarokka-physics.mjs';
import {TABLE,CARD,CARD_REST_Y,SLOTS,DECK,CANDLES,TRAVEL_Y} from '../tarokka-reading/scripts/tarokka-layout.mjs';

const q={x:0,y:0,z:0,w:1};
const step=(physics,seconds=3)=>{for(let i=0;i<120*seconds;i++)physics.step(1/120);};

test('gravidade e contato mantêm as cartas sobre o veludo, sem flutuar nem atravessar',()=>{
  const p=new TarokkaPhysics();
  for(let i=0;i<5;i++)p.release(i,{x:SLOTS[i].x,y:0.8,z:SLOTS[i].z},q);
  step(p);
  for(const b of p.cards){assert.ok(Math.abs(b.position.y-CARD_REST_Y)<0.004,`card height ${b.position.y}`);assert.ok(b.velocity.length()<0.02);}
  p.destroy();
});
test('cartas colidem entre si e formam uma pilha com espessura física',()=>{
  const p=new TarokkaPhysics();p.place(0,SLOTS[0]);p.release(1,{x:SLOTS[0].x,y:0.4,z:SLOTS[0].z},q);step(p);
  assert.ok(p.cards[0].position.y>=TABLE.top+CARD.thickness/2-0.004);
  assert.ok(p.cards[1].position.y-p.cards[0].position.y>=CARD.thickness-0.004);
  p.destroy();
});
test('a única pilha de cartas bloqueia uma carta em queda',()=>{
  const p=new TarokkaPhysics(),d=DECK;
  assert.equal(p.staticBodies.filter(b=>b.name.startsWith('deck-')).length,1);p.release(0,{x:d.x,y:0.7,z:d.z},q);step(p);
  assert.ok(Math.abs(p.cards[0].position.y-(TABLE.top+d.height+CARD.thickness/2))<0.006);
  p.destroy();
});
test('castiçal tem collider e recebe contatos de uma carta em queda',()=>{
  const p=new TarokkaPhysics(),c=CANDLES[0];p.release(0,{x:c.x,y:1.2,z:c.z},q);
  let contact=false;
  for(let i=0;i<240;i++){p.step(1/120);contact ||= p.world.contacts.some(eq=>(eq.bi.name==='candle-0'&&eq.bj.name==='card-0')||(eq.bj.name==='candle-0'&&eq.bi.name==='card-0'));}
  assert.ok(contact);p.destroy();
});
test('mesa física é redonda e finita; a bola não existe no cenário do jogador',()=>{
  const p=new TarokkaPhysics();assert.equal(p.staticBodies.some(b=>b.name.startsWith('crystal')),false);
  p.release(0,{x:4,y:0.6,z:0},q);step(p,1);assert.ok(p.cards[0].position.y<0);
  const gm=new TarokkaPhysics({showCrystal:true});assert.equal(gm.staticBodies.filter(b=>b.name.startsWith('crystal')).length,2);p.destroy();gm.destroy();
});
test('áreas retangulares, separadas e dentro da mesa; trajetórias liberam os adereços',()=>{
  for(let i=0;i<5;i++){
    const a=SLOTS[i];
    assert.ok(Math.hypot(Math.abs(a.x)+CARD.width/2,Math.abs(a.z)+CARD.length/2)<TABLE.playRadius);
    for(let j=i+1;j<5;j++)assert.ok(Math.abs(a.x-SLOTS[j].x)>CARD.width+0.05||Math.abs(a.z-SLOTS[j].z)>CARD.length+0.05);
    for(const c of CANDLES)assert.ok(Math.abs(a.x-c.x)>CARD.width/2+c.radius||Math.abs(a.z-c.z)>CARD.length/2+c.radius);
    const d=DECK;assert.ok(Math.abs(a.x-d.x)>CARD.width+0.06||Math.abs(a.z-d.z)>CARD.length+0.06);
  }
  assert.ok(TRAVEL_Y-Math.hypot(CARD.length/2,CARD.thickness/2)>TABLE.top+Math.max(...CANDLES.map(c=>c.height)));
});
test('o módulo não inicializa áudio nem apresenta controle de som',()=>{
  for(const file of ['tarokka-app.mjs','tarokka-3d.mjs'])assert.doesNotMatch(readFileSync(new URL('../tarokka-reading/scripts/'+file,import.meta.url),'utf8'),/tarokkaSound|AudioContext|playCard|playShuffle/);
  assert.doesNotMatch(readFileSync(new URL('../tarokka-reading/templates/tarokka-reading.hbs',import.meta.url),'utf8'),/toggle-sound|Som ligado/);
});
