import test from 'node:test';
import assert from 'node:assert/strict';
import {COMMON_DECK,HIGH_DECK} from '../tarokka-reading/scripts/tarokka-data.mjs';
import {availableCards,createPositions,revealPosition,restorePositions,publicState} from '../tarokka-reading/scripts/tarokka-state.mjs';
import {READING_MODES,RELOADED_CARD_IDS,readingForMode} from '../tarokka-reading/scripts/tarokka-reading-modes.mjs';

// Independent reference list checked against CoS chapter 1, Treasure Locations (pp. 12–15).
const treasureAreas={
  swords:['Q36','K85','T6','K84/31','Z7','K84/38','X5a','K25','N3s','K86'],
  stars:['K60','G','U5','Q53','X20','K84/37','N5','K37','U3','V7'],
  coins:['K84/7','S23','W10','K63','K84/5','N9a','F','N9i','K41','N2q'],
  glyphs:['S13','S9','S4','K88','Y4','K67','O4','X40','N4o','K15']
};
const castleAreas={Artifact:'K15',Beast:'K25','Broken One':'K85',Darklord:'K86',Donjon:'K67',Seer:'K37',Ghost:'K88',Executioner:'K6',Horseman:'K86',Innocent:'K85',Marionette:'K60',Mists:'Variável',Raven:'K88',Tempter:'K41'};

test('40 associações de tesouro e 14 destinos de Strahd correspondem às referências do capítulo 1',()=>{
  for(const c of COMMON_DECK)for(const key of ['tome','symbol','sword'])assert.equal(c.readings[key].area,treasureAreas[c.suit][c.number-1],c.id);
  for(const c of HIGH_DECK)assert.equal(c.readings.location.room,castleAreas[c.nameEn],c.id);
});
test('54 significados têm fonte; aliados conservam as sete alternativas oficiais e suas condições',()=>{
  for(const c of [...COMMON_DECK,...HIGH_DECK])assert.match(c.meaningSource,/apêndice E/);
  assert.equal(HIGH_DECK.filter(c=>c.readings.ally.prophecyAlt).length,7);
  for(const c of HIGH_DECK)if(c.readings.ally.prophecyAlt){assert.ok(c.readings.ally.areaAlt);assert.ok(c.readings.ally.descriptionAlt);}
  assert.match(HIGH_DECK.find(c=>c.nameEn==='Ghost').readings.ally.description,/revenant, não um fantasma/);
  assert.match(HIGH_DECK.find(c=>c.nameEn==='Raven').readings.ally.description,/reconciliar-se com Urwin/);
  assert.match(HIGH_DECK.find(c=>c.nameEn==='Horseman').readings.ally.descriptionAlt,/trai e ataca/);
  assert.match(HIGH_DECK.find(c=>c.nameEn==='Broken One').readings.location.prophecy,/tumba do homem/);
});
test('Reloaded usa as cinco cartas do Arco C e corrige as duas pistas que divergem do livro oficial',()=>{
  const positions=createPositions();
  assert.deepEqual(RELOADED_CARD_IDS,['glyphs-9','swords-5','glyphs-8','high-12','high-11']);
  for(let i=0;i<5;i++){const pool=availableCards(positions,i,'reloaded');assert.equal(pool.length,1);assert.equal(pool[0].id,RELOADED_CARD_IDS[i]);positions[i]=revealPosition(pool[0],i,'reloaded');}
  assert.match(positions[0].prophecy,/antigo inimigo/);assert.match(positions[0].gmInfo,/Leo Dilisnya/);
  assert.match(positions[2].prophecy,/prisão de âmbar/);assert.match(positions[2].gmInfo,/sarcófago de Vampyr/);
  assert.match(positions[4].gmInfo,/pico da torre norte/);
  const traitor=COMMON_DECK.find(c=>c.id==='glyphs-9'),bishop=COMMON_DECK.find(c=>c.id==='glyphs-8');
  assert.equal(readingForMode(traitor,0,'official').area,'N4o');assert.equal(readingForMode(bishop,2,'official').area,'X40');
});
test('restauração respeita o modo, mantém compatibilidade e não transmite localizações reservadas do Reloaded',()=>{
  const positions=createPositions();for(let i=0;i<5;i++)positions[i]=revealPosition(availableCards(positions,i,'reloaded')[0],i,'reloaded');
  const state=publicState({mode:'reloaded',positions,readingId:'fixed',revision:5,isComplete:true});
  const serialized=JSON.stringify(state);assert.equal(state.mode,'reloaded');assert.doesNotMatch(serialized,/Leo Dilisnya|Vampyr|Patrina|gmInfo|readings|descriptionAlt/);
  const player=restorePositions(state,false),gm=restorePositions(state,true);assert.ok(player.every(p=>p.gmInfo===null));assert.match(gm[2].gmInfo,/sarcófago de Vampyr/);
  state.positions[0].card.id='swords-1';assert.ok(restorePositions(state).every(p=>p.state==='waiting'));
  assert.equal(publicState({positions:createPositions()}).mode,'official');assert.equal(Object.keys(READING_MODES).length,2);
});
