import test from 'node:test';
import assert from 'node:assert/strict';
import {COMMON_DECK,HIGH_DECK} from '../tarokka-reading/scripts/tarokka-data.mjs';
import {createPositions,publicState,restorePositions,revealPosition} from '../tarokka-reading/scripts/tarokka-state.mjs';
import {RELOADED_CARD_IDS} from '../tarokka-reading/scripts/tarokka-reading-modes.mjs';
import {renderGMNotes} from '../tarokka-reading/scripts/tarokka-gm-notes.mjs';

test('todas as 120 leituras de tesouro incluem localização e colocação exata sem exigir referência externa',()=>{
  for(const card of COMMON_DECK)for(const index of [0,1,2]){
    const position=revealPosition(card,index),notes=new Map(position.gmNotes.map(n=>[n.label,n.text]));
    for(const label of ['Tesouro','Localização','Onde encontrar e como obter'])assert.ok(notes.get(label),`${card.id}: ${label}`);
    assert.equal(notes.has('Área'),false);assert.equal(notes.has('Referência'),false);
  }
  const priest=revealPosition(COMMON_DECK.find(c=>c.id==='glyphs-10'),0);
  assert.match(priest.gmInfo,/no chão, atrás do altar/);
  assert.match(revealPosition(COMMON_DECK.find(c=>c.id==='swords-9'),0).gmInfo,/20%/);
  assert.match(revealPosition(COMMON_DECK.find(c=>c.id==='swords-3'),2).gmInfo,/última for derrotada/);
});

test('aliados e confrontos incluem condições, alternativas e a regra da primeira chegada',()=>{
  for(const card of HIGH_DECK){
    const ally=revealPosition(card,3),location=revealPosition(card,4);
    assert.match(ally.gmInfo,/Condições e orientação:/);
    assert.match(location.gmInfo,/primeira chegada/);
    assert.match(location.gmInfo,/forçado a retornar ao próprio caixão/);
    if(card.readings.ally.npcAlt){assert.ok(ally.gmInfo.includes(card.readings.ally.npcAlt));assert.match(ally.gmInfo,/Condições da alternativa B:/);assert.match(ally.gmInfo,/não substitui automaticamente/);}
    if(card.id!=='high-4')assert.match(ally.gmInfo,/ação Inspirar/);
    if(card.id!=='high-12')assert.match(location.gmInfo,/Cena do encontro:/);
  }
});

test('notas exibem as informações em linguagem natural, preservando as fontes somente nos dados',()=>{
  const cards=[...COMMON_DECK,...HIGH_DECK],positions=[];
  for(const card of cards)for(const index of card.suit?[0,1,2]:[3,4])positions.push(revealPosition(card,index));
  for(const [index,id] of RELOADED_CARD_IDS.entries())positions.push(revealPosition(cards.find(c=>c.id===id),index,'reloaded'));
  for(const position of positions)assert.doesNotMatch(position.gmInfo,/\b[A-Z]\d+[a-z]?(?:\/\d+)?\b|\bcap\.|apêndice|Referência:|Área:|consulte\b/i,position.card.id);
  const priest=positions.find(p=>p.card.id==='glyphs-10');
  assert.match(priest.gmInfo,/Capela do Castelo Ravenloft\./);assert.match(priest.gmInfo,/no chão, atrás do altar/);
  const shrine=positions.find(p=>p.card.id==='swords-5');
  assert.match(shrine.gmInfo,/não recebe os benefícios/);assert.match(shrine.gmInfo,/Devolver o item não encerra/);
  assert.equal(COMMON_DECK.find(c=>c.id==='glyphs-10').readings.tome.area,'K15');
  assert.match(COMMON_DECK.find(c=>c.id==='glyphs-10').readings.tome.reference,/cap\. 1/);
});

test('Reloaded conserva suas orientações sem importar esconderijos oficiais do Tomo e da Lâmina',()=>{
  const cards=[...COMMON_DECK,...HIGH_DECK],positions=RELOADED_CARD_IDS.map((id,index)=>revealPosition(cards.find(c=>c.id===id),index,'reloaded'));
  assert.match(positions[0].gmInfo,/Plano Etéreo/);assert.doesNotMatch(positions[0].gmInfo,/tesouro está no baú de ferro/);
  assert.match(positions[2].gmInfo,/Vampyr/);assert.doesNotMatch(positions[2].gmInfo,/role 1d6/);
  assert.match(positions[1].gmInfo,/base da estátua/);assert.match(positions[4].gmInfo,/ao lado do baú de ferro/);
});

test('notas detalhadas ficam fora dos sockets, do estado salvo e da restauração dos jogadores',()=>{
  const positions=createPositions();positions[0]=revealPosition(COMMON_DECK.find(c=>c.id==='glyphs-10'),0);
  const state=publicState({positions,readingId:'private-notes',revision:1,isComplete:false});
  assert.doesNotMatch(JSON.stringify(state),/gmNotes|gmInfo|atrás do altar|Onde encontrar/);
  assert.equal(restorePositions(state,false)[0].gmNotes,null);
  assert.equal(restorePositions(state,false)[0].gmInfo,null);
  assert.deepEqual(restorePositions(state,true)[0].gmNotes,positions[0].gmNotes);
});

test('notas usam títulos e parágrafos como texto seguro e removem a nota da carta anterior',()=>{
  const document={createElement(tag){return {tag,children:[],append(...nodes){this.children.push(...nodes);},textContent:''};}};
  const container={ownerDocument:document,children:[],replaceChildren(){this.children=[];},append(node){this.children.push(node);}};
  renderGMNotes(container,[{label:'Área',text:'K15'},{label:'Orientação',text:'<img src=x onerror=alert(1)>'}]);
  assert.equal(container.children[0].tag,'dl');
  assert.deepEqual(container.children[0].children.map(n=>n.tag),['dt','dd','dt','dd']);
  assert.equal(container.children[0].children[3].textContent,'<img src=x onerror=alert(1)>');
  renderGMNotes(container,[]);assert.equal(container.children.length,0);
});
