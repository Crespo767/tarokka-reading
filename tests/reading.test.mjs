import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { COMMON_DECK, HIGH_DECK, getCardReading } from '../tarokka-reading/scripts/tarokka-data.mjs';
import { createPositions, availableCards, revealPosition, publicState, restorePositions } from '../tarokka-reading/scripts/tarokka-state.mjs';
import { officialRollFormula } from '../tarokka-reading/scripts/tarokka-dice.mjs';

test('54 cartas únicas, imagens locais e leituras para todas as posições válidas',()=>{
  assert.equal(COMMON_DECK.length,40);assert.equal(HIGH_DECK.length,14);
  assert.equal(new Set([...COMMON_DECK,...HIGH_DECK].map(c=>c.id)).size,54);
  for(const card of [...COMMON_DECK,...HIGH_DECK]) {
    assert.ok(existsSync(new URL('../'+card.image.replace('modules/',''),import.meta.url)),card.image);
    for(const index of (card.suit?[0,1,2]:[3,4]))assert.ok(getCardReading(card,index).prophecy);
  }
});
test('três comuns e duas altas, sem repetição',()=>{
  const positions=createPositions();
  for(let i=0;i<5;i++) {
    const pool=availableCards(positions,i);assert.equal(pool.length,i<3?40-i:14-(i-3));
    positions[i]=revealPosition(pool[0],i);
  }
  assert.equal(new Set(positions.map(p=>p.card.id)).size,5);
});
test('estado público exclui informações do mestre e leituras alternativas',()=>{
  const positions=createPositions();positions[0]=revealPosition(COMMON_DECK[0],0);
  const state=publicState({positions,readingId:'test',revision:1,isComplete:false});
  assert.ok(!JSON.stringify(state).includes('gmInfo'));
  assert.ok(!JSON.stringify(state).includes('readings'));
  assert.ok(!JSON.stringify(state).includes(positions[0].gmInfo));
  assert.equal(restorePositions(state,false)[0].gmInfo,null);
  assert.equal(restorePositions(state,true)[0].gmInfo,positions[0].gmInfo);
});
test('restauração rejeita repetições, baralho errado e lacunas na sequência',()=>{
  const positions=createPositions();positions[0]=revealPosition(COMMON_DECK[0],0);positions[1]=revealPosition(COMMON_DECK[0],1);
  assert.equal(restorePositions({positions}).filter(p=>p.card).length,1);
  positions[0]=revealPosition(HIGH_DECK[0],0);
  assert.equal(restorePositions({positions}).filter(p=>p.card).length,0);
});

test('leituras salvas antes da otimização restauram as imagens WebP pelo ID da carta',()=>{
  const positions=createPositions();positions[0]=revealPosition(COMMON_DECK[0],0);
  const state=publicState({positions,readingId:'legacy',revision:1,isComplete:false});
  state.positions[0].card={...state.positions[0].card,image:state.positions[0].card.image.replace('.webp','.png')};
  for(const isGM of [true,false]){
    const restored=restorePositions(state,isGM)[0];assert.equal(restored.card.id,COMMON_DECK[0].id);
    assert.equal(restored.card.image,COMMON_DECK[0].image);assert.match(restored.card.image,/\.webp$/);
  }
});
test('manifesto habilita o canal de socket do Foundry',()=>{
  assert.equal(JSON.parse(readFileSync(new URL('../tarokka-reading/module.json',import.meta.url))).socket,true);
});

globalThis.Application=class {constructor(){this.element=null;}static get defaultOptions(){return {};}async close(){}};
const { TarokkaReadingApp }=await import('../tarokka-reading/scripts/tarokka-app.mjs');
const { TarokkaSocket }=await import('../tarokka-reading/scripts/tarokka-socket.mjs');
function setup(isGM=true,saved={}) {
  const emitted=[],chat=[],warnings=[],formulas=[];let rolls=0;
  const users=[{id:'gm',active:true,isGM:true},{id:'player',active:true,isGM:false}];users.get=id=>users.find(u=>u.id===id);
  globalThis.game={user:users[isGM?0:1],users,settings:{get:()=>saved,set:async(_m,_k,state)=>{saved=state;}},socket:{emit:(_event,payload)=>emitted.push(payload),on:(_event,handler)=>{game.receive=handler;}}};
  globalThis.ui={notifications:{info:()=>{},warn:m=>warnings.push(m),error:m=>warnings.push(m)}};
  globalThis.ChatMessage={create:async data=>chat.push(data)};
  globalThis.Roll=class{constructor(formula){this.formula=formula;}async evaluate(){rolls++;formulas.push(this.formula);this.total=1;return this;}toJSON(){return {formula:this.formula,total:this.total,evaluated:true};}static fromJSON(json){const data=JSON.parse(json);return Object.assign(new this(data.formula),data);}};
  return {emitted,chat,warnings,formulas,get rolls(){return rolls;},get saved(){return saved;}};
}
test('jogador envia pedido sem sortear ou postar mensagens',async()=>{
  const ctx=setup(false);const app=new TarokkaReadingApp();await app.drawCard(0);
  assert.equal(ctx.rolls,0);assert.equal(ctx.chat.length,0);assert.equal(app.positions[0].state,'waiting');
  assert.equal(ctx.emitted[0].type,'REQUEST_DRAW');
});
test('mestre rola dados convencionais, registra apenas resultados públicos e restaura as cinco cartas',async()=>{
  const ctx=setup();const app=new TarokkaReadingApp();
  for(let i=0;i<5;i++)await app.drawCard(i);
  assert.equal(ctx.rolls,5);assert.equal(ctx.chat.length,5);assert.equal(app.isComplete,true);
  assert.deepEqual(ctx.formulas,['1d100rr>40','1d100rr>39','1d100rr>38','1d20rr>14','1d20rr>13']);
  assert.ok(ctx.chat.every(message=>message.content==='1'&&message.whisper.length===0&&message.blind===false));
  assert.ok(ctx.chat.every(message=>!('flavor' in message)&&!('rolls' in message)&&!('formula' in message)));
  for(const position of app.positions){assert.ok(!JSON.stringify(ctx.chat).includes(position.prophecy));assert.ok(!JSON.stringify(ctx.chat).includes(position.gmInfo));assert.ok(!JSON.stringify(ctx.chat).includes(position.card.image));}
  assert.equal(ctx.emitted.filter(message=>message.type==='DRAW_CARD').length,5);assert.ok(!JSON.stringify(ctx.emitted).includes('gmInfo'));
  const reopened=new TarokkaReadingApp();assert.deepEqual(reopened.positions,app.positions);
  assert.equal(ctx.saved.revision,5);
  assert.equal(ctx.warnings.length,0);
});
test('bloqueia dois pedidos simultâneos e recuperação de falha de dado',async()=>{
  const ctx=setup();let release;
  globalThis.Roll=class extends globalThis.Roll{evaluate(){return new Promise(resolve=>{release=()=>{this.total=1;resolve(this);};});}};
  const app=new TarokkaReadingApp();const first=app.drawCard(0);await app.drawCard(0);release();await first;
  assert.equal(ctx.emitted.filter(message=>message.type==='DRAW_CARD').length,1);assert.equal(app.revision,1);
  globalThis.Roll=class{async evaluate(){throw new Error('Falha esperada no teste');}};
  const old=console.error;console.error=()=>{};try{await app.drawCard(1);}finally{console.error=old;}
  assert.equal(app.activePosition,null);assert.equal(app.positions[1].state,'waiting');
});

test('fechar durante sorteio libera o controlador e ignora a rolagem antiga',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp(),BaseRoll=globalThis.Roll;let finishRoll,signal;
  const started=new Promise(resolve=>signal=resolve);
  globalThis.Roll=class extends BaseRoll{evaluate(){signal();return new Promise(resolve=>{finishRoll=()=>{this.total=1;resolve(this);};});}};
  const drawing=app.drawCard(0);await started;assert.equal(app.activePosition,0);
  await app.close();finishRoll();await drawing;
  assert.equal(app.activePosition,null);assert.equal(app.readingModeLocked,false);assert.equal(ctx.chat.length,0);
  assert.ok(app.positions.every(p=>!p.card));
  globalThis.Roll=BaseRoll;await app.drawCard(0);assert.equal(app.positions[0].state,'revealed');
});
test('mensagem antiga não substitui leitura atual e jogador não reinicia mesa',async()=>{
  setup();const app=new TarokkaReadingApp();await app.drawCard(0);
  const state=app.getSyncState();await app.onRemoteDrawCard({positionIndex:0,state});assert.equal(app.revision,1);
  setup(false);await app.resetReading();assert.equal(app.positions[0].state,'revealed');
});
test('socket ignora comandos diretos de jogador e aceita apenas pedidos válidos',async()=>{
  const ctx=setup();const app=new TarokkaReadingApp();game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  await game.receive({type:'RESET',senderId:'player',state:{}});assert.equal(app.revision,0);
  await game.receive({type:'REQUEST_DRAW',senderId:'player',positionIndex:0,readingId:app.readingId,revision:0});
  assert.equal(app.revision,1);
  await game.receive({type:'REQUEST_DRAW',senderId:'player',positionIndex:1,readingId:app.readingId,revision:0});
  assert.equal(app.revision,1);assert.equal(ctx.emitted.at(-1).type,'SYNC_STATE');
});


test('jogador abre e fecha carta pública sem esperar o mestre e sem transmitir segredos',async()=>{
  const ctx=setup(false),app=new TarokkaReadingApp();app.positions[0]=revealPosition(COMMON_DECK[0],0);
  await app.requestInspection(0);
  assert.equal(app.sharedInspectionIndex,0);assert.equal(app.inspectedCard,app.positions[0]);assert.equal(ctx.emitted[0].type,'REQUEST_INSPECTION');
  assert.equal(ctx.emitted[0].positionIndex,0);assert.ok(!JSON.stringify(ctx.emitted).includes('gmInfo'));
  await app.requestInspection(0);assert.equal(app.sharedInspectionIndex,null);assert.equal(app.inspectedCard,null);
});
test('mestre valida seleção compartilhada, rejeita carta oculta, mensagem direta e leitura antiga',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  await app.drawCard(0);await app.shareInspection(null);ctx.emitted.length=0;
  const request={type:'REQUEST_INSPECTION',senderId:'player',readingId:app.readingId,revision:app.revision,positionIndex:0};
  await game.receive({...request,positionIndex:4});assert.equal(ctx.emitted.length,0);
  await game.receive({...request,readingId:'old'});assert.equal(ctx.emitted.at(-1).type,'SYNC_STATE');ctx.emitted.length=0;
  await game.receive({type:'INSPECT_CARD',senderId:'player',payload:{readingId:app.readingId,inspectionRevision:999,positionIndex:0}});assert.equal(app.sharedInspectionIndex,null);
  await game.receive(request);assert.equal(app.sharedInspectionIndex,0);assert.equal(ctx.emitted[0].type,'INSPECT_CARD');
  assert.deepEqual(Object.keys(ctx.emitted[0].payload).sort(),['inspectionRevision','positionIndex','readingId']);
  await app.requestInspection(0);assert.equal(app.sharedInspectionIndex,null);assert.equal(ctx.emitted.at(-1).payload.positionIndex,null);
});
test('ampliação ignora mensagens antigas e inclui seleção atual na entrada de outro jogador',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  await app.drawCard(0);await app.shareInspection(0);const selected=app.getInspectionState();
  await app.shareInspection(null);await app.onRemoteInspection(selected);assert.equal(app.sharedInspectionIndex,null);
  await app.shareInspection(0);ctx.emitted.length=0;
  await game.receive({type:'REQUEST_STATE',senderId:'player'});
  const reply=ctx.emitted[0];assert.equal(reply.type,'SYNC_STATE');assert.equal(reply.inspection.positionIndex,0);assert.ok(!JSON.stringify(reply).includes('gmInfo'));
  await app.resetReading();assert.equal(app.sharedInspectionIndex,null);assert.equal(app.inspectionRevision,0);
  await app.onRemoteInspection(selected);assert.equal(app.sharedInspectionIndex,null);
});

test('mestre escolhe Reloaded com dados visuais e só troca para oficial após Nova leitura',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();await app.setReadingMode('reloaded');
  for(let i=0;i<5;i++)await app.drawCard(i);
  assert.equal(ctx.rolls,5);assert.equal(app.mode,'reloaded');
  assert.deepEqual(ctx.formulas,['1d100rr>40','1d100rr>39','1d100rr>38','1d20rr>14','1d20rr>13']);
  assert.equal(ctx.chat.length,5);assert.ok(ctx.chat.every(message=>message.content==='1'&&!('flavor' in message)));
  assert.deepEqual(app.positions.map(p=>p.card.id),['glyphs-9','swords-5','glyphs-8','high-12','high-11']);
  const reopened=new TarokkaReadingApp();assert.equal(reopened.mode,'reloaded');assert.deepEqual(reopened.positions,app.positions);
  const previousId=app.readingId;
  await app.setReadingMode('official');assert.equal(app.mode,'reloaded');assert.equal(app.readingId,previousId);assert.equal(app.isComplete,true);
  assert.deepEqual(app.positions,reopened.positions);
  await app.resetReading();assert.equal(app.readingModeLocked,false);assert.equal(app.mode,'reloaded');
  await app.setReadingMode('official');assert.equal(app.mode,'official');
  assert.notEqual(app.readingId,previousId);assert.ok(app.positions.every(p=>!p.card));assert.equal(app.sharedInspectionIndex,null);
  assert.equal(ctx.emitted.at(-1).type,'RESET');assert.equal(ctx.saved.mode,'official');
  await app.resetReading();assert.equal(app.mode,'official');
});
test('jogador não altera o modo e pedido de sorteio obedece ao modo escolhido pelo mestre',async()=>{
  setup(false);const player=new TarokkaReadingApp();await player.setReadingMode('reloaded');assert.equal(player.mode,'official');
  const ctx=setup(),app=new TarokkaReadingApp();await app.setReadingMode('reloaded');game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  await game.receive({type:'REQUEST_DRAW',senderId:'player',readingId:app.readingId,revision:0,positionIndex:0,mode:'official'});
  assert.equal(app.positions[0].card.id,'glyphs-9');assert.equal(ctx.rolls,1);assert.equal(app.mode,'reloaded');
});

test('Nova leitura limpa a mesa e a ampliação de todos, salva o reinício e permite novo sorteio',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();
  for(let i=0;i<5;i++)await app.drawCard(i);
  await app.shareInspection(2);
  const previousId=app.readingId,previousInspection=app.getInspectionState();
  const player=new TarokkaReadingApp();
  player.sharedInspectionIndex=2;player.inspectedCard=player.positions[2];
  let resetAnimations=0,playerTable;
  app.scene3D={syncInstantState:positions=>{assert.ok(positions.every(p=>!p.card));resetAnimations++;}};
  player.scene3D={syncInstantState:positions=>{playerTable=positions;}};
  ctx.emitted.length=0;
  await app.resetReading();
  assert.equal(resetAnimations,1);assert.notEqual(app.readingId,previousId);
  assert.equal(app.isComplete,false);assert.equal(app.activePosition,null);
  assert.equal(app.sharedInspectionIndex,null);assert.equal(app.inspectedCard,null);
  assert.ok(app.positions.every(p=>p.state==='waiting'&&!p.card));
  const reset=ctx.emitted.find(message=>message.type==='RESET');assert.ok(reset);
  assert.deepEqual(ctx.saved,reset.state);
  game.user=game.users.get('player');game.tarokka={ensureApp:()=>player};TarokkaSocket.init();
  await game.receive(reset);
  assert.equal(player.isComplete,false);assert.equal(player.inspectedCard,null);assert.equal(player.sharedInspectionIndex,null);
  assert.ok(playerTable.every(p=>p.state==='waiting'&&!p.card));
  await player.onRemoteInspection(previousInspection);assert.equal(player.sharedInspectionIndex,null);
  game.user=game.users.get('gm');
  app.scene3D=null;await app.drawCard(0);
  assert.equal(app.positions[0].state,'revealed');assert.equal(app.revision,1);
  assert.equal(app.positions.filter(p=>p.state==='revealed').length,1);
});

test('outro mestre pode pedir Nova leitura; jogadores e pedidos antigos não reiniciam a mesa',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();await app.drawCard(0);
  const otherGM={id:'gm2',active:true,isGM:true};game.users.push(otherGM);
  game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  game.user=otherGM;await app.resetReading();
  const request=ctx.emitted.at(-1);assert.equal(request.type,'REQUEST_RESET');assert.equal(app.revision,1);
  game.user=game.users.get('gm');
  await game.receive({...request,senderId:'player'});assert.equal(app.revision,1);
  await game.receive({...request,readingId:'obsolete'});assert.equal(app.revision,1);
  await game.receive(request);assert.equal(app.revision,0);assert.ok(app.positions.every(p=>!p.card));
  assert.equal(ctx.emitted.at(-1).type,'RESET');
});

test('Nova leitura interrompe sorteio pendente e ignora o resultado antigo',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let finishRoll;
  globalThis.Roll=class extends globalThis.Roll{evaluate(){return new Promise(resolve=>{finishRoll=()=>{this.total=1;resolve(this);};});}};
  const pending=app.drawCard(0);
  // Let drawCard pass the uninspection await and begin the pending roll.
  await Promise.resolve();await Promise.resolve();
  assert.equal(typeof finishRoll,'function');
  const previous=app.readingId;await app.resetReading();
  assert.notEqual(app.readingId,previous);assert.equal(app.activePosition,null);
  finishRoll();await pending;
  assert.ok(app.positions.every(p=>!p.card));assert.equal(ctx.chat.length,0);
  assert.equal(ctx.emitted.filter(message=>message.type==='DRAW_CARD').length,0);
});

test('reinício é transmitido antes da gravação terminar e não depende de quadros da animação',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let finishAnimation,finishSave;
  app.scene3D={uninspectCard:async()=>{},dealCard:()=>new Promise(resolve=>{finishAnimation=resolve;}),syncInstantState:()=>{}};
  const pending=app.drawCard(0);
  for(let i=0;i<12&&!finishAnimation;i++)await Promise.resolve();
  assert.equal(typeof finishAnimation,'function');
  game.settings.set=()=>new Promise(resolve=>{finishSave=resolve;});
  const resetting=app.resetReading();
  assert.ok(ctx.emitted.some(message=>message.type==='RESET'));
  assert.ok(app.positions.every(p=>!p.card));assert.equal(app.activePosition,null);
  finishAnimation();await pending;assert.equal(app.inspectedCard,null);assert.equal(ctx.chat.length,1);
  finishSave();await resetting;
});

test('gravação lenta de uma carta não sobrescreve o estado de Nova leitura',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp(),writes=[];let release,signal;
  const blocked=new Promise(resolve=>release=resolve),started=new Promise(resolve=>signal=resolve);
  game.settings.set=async(_module,_key,state)=>{if(!writes.length){signal();await blocked;}writes.push(state);};
  const drawing=app.drawCard(0);await started;const previous=app.readingId;
  const resetting=app.resetReading();
  assert.notEqual(app.readingId,previous);assert.ok(app.positions.every(p=>!p.card));
  assert.ok(ctx.emitted.some(message=>message.type==='RESET'));assert.equal(writes.length,0);
  release();await Promise.all([drawing,resetting]);
  assert.equal(writes.length,2);assert.equal(writes[0].readingId,previous);assert.equal(writes[1].readingId,app.readingId);
  assert.ok(writes[1].positions.every(p=>!p.card));assert.equal(ctx.chat.length,0);
});

test('carta sorteada é ampliada para todos e o texto espera a aproximação da imagem',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let finishFocus,signalFocus;
  const focusStarted=new Promise(resolve=>{signalFocus=resolve;});
  const steps=[];
  app.scene3D={uninspectCard:async()=>{},dealCard:async index=>{steps.push(`deal:${index}`);},
    inspectCard:index=>{steps.push(`focus:${index}`);signalFocus();return new Promise(resolve=>{finishFocus=resolve;});}};
  const drawing=app.drawCard(0);await focusStarted;
  assert.deepEqual(steps,['deal:0','focus:0']);assert.equal(app.inspectedCard,null);
  const selection=ctx.emitted.find(message=>message.type==='INSPECT_CARD');assert.equal(selection.payload.positionIndex,0);
  finishFocus();await drawing;
  assert.equal(app.inspectedCard.card.id,app.positions[0].card.id);assert.equal(app.sharedInspectionIndex,0);assert.equal(ctx.chat.length,1);
});

test('jogador mais lento amplia a carta após terminar a distribuição, sem exibir texto isolado',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const draw=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  const focus=ctx.emitted.find(message=>message.type==='INSPECT_CARD');
  setup(false);const player=new TarokkaReadingApp();
  player.applySyncState({...draw.payload.state,revision:0,positions:[]},true);
  let finishDeal;const shown=[];
  player.scene3D={syncInstantState:()=>{},dealCard:()=>new Promise(resolve=>{finishDeal=resolve;}),uninspectCard:async()=>{},inspectCard:async index=>{shown.push(index);}};
  const dealing=player.onRemoteDrawCard(draw.payload);
  await player.onRemoteInspection(focus.payload);
  assert.equal(player.inspectedCard,null);assert.deepEqual(shown,[]);
  finishDeal();await dealing;
  assert.deepEqual(shown,[0]);assert.equal(player.inspectedCard.card.id,gm.positions[0].card.id);assert.equal(player.inspectedCard.gmInfo,null);
});

test('troca de modo é bloqueada durante sorteio pendente e liberada por Nova leitura',async()=>{
  setup();const app=new TarokkaReadingApp(),BaseRoll=globalThis.Roll;let finishRoll;
  globalThis.Roll=class extends globalThis.Roll{evaluate(){return new Promise(resolve=>{finishRoll=()=>{this.total=1;resolve(this);};});}};
  const pending=app.drawCard(0);await Promise.resolve();await Promise.resolve();
  assert.equal(app.readingModeLocked,true);
  await app.setReadingMode('reloaded');assert.equal(app.mode,'official');finishRoll();await pending;
  assert.equal(app.mode,'official');assert.equal(app.positions[0].state,'revealed');
  globalThis.Roll=BaseRoll;
  await app.resetReading();await app.setReadingMode('reloaded');
  await app.drawCard(0);assert.equal(app.positions[0].card.id,'glyphs-9');
});

test('qualquer mestre pode trocar o modo; jogadores e pedidos antigos são rejeitados',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();
  const otherGM={id:'gm2',active:true,isGM:true};game.users.push(otherGM);
  game.tarokka={ensureApp:()=>app};TarokkaSocket.init();
  game.user=otherGM;await app.setReadingMode('reloaded');const request=ctx.emitted.at(-1);
  assert.equal(request.type,'REQUEST_MODE');assert.equal(app.mode,'official');
  game.user=game.users.get('gm');
  await game.receive({...request,senderId:'player'});assert.equal(app.mode,'official');
  await game.receive({...request,readingId:'old'});assert.equal(app.mode,'official');
  await game.receive(request);assert.equal(app.mode,'reloaded');assert.ok(app.positions.every(p=>!p.card));
  assert.equal(ctx.emitted.at(-1).state.mode,'reloaded');
  await app.drawCard(0);
  const state=app.getSyncState(),resetCount=ctx.emitted.filter(message=>message.type==='RESET').length;
  await game.receive({type:'REQUEST_MODE',senderId:otherGM.id,mode:'official',readingId:app.readingId,revision:app.revision});
  assert.deepEqual(app.getSyncState(),state);assert.equal(ctx.emitted.filter(message=>message.type==='RESET').length,resetCount);
});

test('seletor bloqueia após a primeira carta, permanece bloqueado ao reabrir e libera ao reiniciar',async()=>{
  setup();const app=new TarokkaReadingApp(),selector={};
  app.find=key=>key==='[data-reading-mode]'?selector:null;
  app._updateHUD();assert.equal(selector.disabled,false);
  await app.drawCard(0);assert.equal(selector.disabled,true);assert.match(selector.title,/Nova leitura/);
  const reopened=new TarokkaReadingApp();assert.equal(reopened.readingModeLocked,true);
  await app.setReadingMode('reloaded');assert.equal(app.mode,'official');assert.equal(app.positions[0].state,'revealed');
  await app.resetReading();assert.equal(selector.disabled,false);
  await app.setReadingMode('reloaded');assert.equal(selector.value,'reloaded');assert.equal(selector.disabled,false);
});

test('cada resultado válido alcança exatamente uma carta disponível, inclusive o último',async()=>{
  for(const [index,remaining] of [[0,40],[1,39],[2,38],[3,14],[4,13]]){
    const ids=new Set();
    for(let total=1;total<=remaining;total++){
      setup();const app=new TarokkaReadingApp();
      for(let i=0;i<index;i++)app.positions[i]=revealPosition(availableCards(app.positions,i)[0],i);
      const expected=availableCards(app.positions,index)[total-1].id;
      globalThis.Roll=class extends globalThis.Roll{async evaluate(){assert.equal(this.formula,officialRollFormula(index,remaining));this.total=total;return this;}};
      await app.drawCard(index);assert.equal(app.positions[index].card.id,expected);ids.add(expected);
    }
    assert.equal(ids.size,remaining);
  }
});

test('falha ao registrar dados no chat preserva a carta e não provoca novo sorteio',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();
  globalThis.ChatMessage.create=async()=>{throw new Error('Falha esperada');};
  const old=console.error;console.error=()=>{};try{await app.drawCard(0);}finally{console.error=old;}
  assert.equal(ctx.rolls,1);assert.equal(app.positions[0].state,'revealed');assert.equal(ctx.saved.revision,1);assert.equal(ctx.warnings.length,1);
});

test('animação precede distribuição e Nova leitura cancela a apresentação pendente',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let rejectAnimation,signal;
  const started=new Promise(resolve=>{signal=resolve;});let deals=0;
  const animation={finished:new Promise((_resolve,reject)=>{rejectAnimation=reject;}),cancel:()=>rejectAnimation(new Error('Cancelada'))};
  const die={textContent:'',animate:()=>{signal();return animation;}};
  const panel={hidden:true,querySelector:selector=>{assert.equal(selector,'.tarokka-dice-value');return die;}};
  app.find=selector=>selector==='.tarokka-dice'?panel:null;
  app.scene3D={uninspectCard:async()=>{},dealCard:async()=>{deals++;},syncInstantState:()=>{}};
  const pending=app.drawCard(0);await started;
  assert.equal(panel.hidden,false);assert.equal(die.textContent,'1');assert.equal(deals,0);assert.equal(ctx.chat.length,0);
  await app.resetReading();await pending;
  assert.equal(panel.hidden,true);assert.equal(deals,0);assert.equal(ctx.chat.length,0);assert.ok(app.positions.every(p=>!p.card));
});

test('jogador apresenta os mesmos dados do mestre sem rolar ou duplicar mensagens',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  const playerCtx=setup(false),player=new TarokkaReadingApp();
  player.applySyncState({...payload.state,revision:0,positions:[]},true);
  const shown=[];player._showRoll=async dice=>shown.push(dice);
  await player.onRemoteDrawCard(payload);
  assert.deepEqual(shown,[payload.dice]);assert.equal(playerCtx.rolls,0);assert.equal(playerCtx.chat.length,0);
});

test('jogador amplia a carta tirada após seus dados e distribuição mesmo sem mensagem de inspeção do mestre',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  const playerCtx=setup(false),player=new TarokkaReadingApp();
  player.applySyncState({...payload.state,revision:0,positions:[]},true);
  let finishDice,finishDeal,signalDice,signalDeal;
  const diceStarted=new Promise(resolve=>signalDice=resolve),dealStarted=new Promise(resolve=>signalDeal=resolve),steps=[];
  player._showRoll=()=>{signalDice();return new Promise(resolve=>finishDice=resolve);};
  player.scene3D={syncInstantState:()=>{},uninspectCard:async()=>{},
    dealCard:()=>{steps.push('deal');signalDeal();return new Promise(resolve=>finishDeal=resolve);},
    inspectCard:async index=>{steps.push(`focus-${index}`);}};
  const pending=player.onRemoteDrawCard(payload);await diceStarted;
  assert.equal(player.inspectedCard,null);assert.deepEqual(steps,[]);
  finishDice();await dealStarted;
  assert.equal(player.inspectedCard,null);assert.deepEqual(steps,['deal']);
  finishDeal();await pending;
  assert.deepEqual(steps,['deal','focus-0']);assert.equal(player.inspectedCard.card.id,payload.state.positions[0].card.id);
  assert.equal(player.inspectedCard.gmInfo,null);assert.equal(player.activePosition,null);
  assert.equal(playerCtx.rolls,0);assert.equal(playerCtx.chat.length,0);
});

test('resposta de sincronização repetida durante os dados não cancela a distribuição do jogador',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  setup(false);const player=new TarokkaReadingApp();player.applySyncState({...payload.state,revision:0,positions:[]},true);
  let finishDice,signal;const started=new Promise(resolve=>signal=resolve);let syncs=0,deals=0;
  player._showRoll=()=>{signal();return new Promise(resolve=>finishDice=resolve);};
  player.scene3D={syncInstantState:()=>syncs++,dealCard:async()=>deals++,uninspectCard:async()=>{},inspectCard:async()=>{}};
  const pending=player.onRemoteDrawCard(payload);await started;
  player.applySyncState(payload.state,true);
  assert.equal(syncs,1);assert.equal(player.activePosition,0);
  finishDice();await pending;
  assert.equal(deals,1);assert.ok(player.inspectedCard?.card);assert.equal(player.activePosition,null);
});

test('reset durante a distribuição remota não reabre a carta anterior',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  setup(false);const player=new TarokkaReadingApp();player.applySyncState({...payload.state,revision:0,positions:[]},true);
  let finishDeal,signal;const started=new Promise(resolve=>signal=resolve);let focuses=0;
  player._showRoll=async()=>{};
  player.scene3D={syncInstantState:()=>{},dealCard:()=>{signal();return new Promise(resolve=>finishDeal=resolve);},inspectCard:async()=>focuses++};
  const pending=player.onRemoteDrawCard(payload);await started;
  player.onRemoteReset({...payload.state,readingId:'new-reading',revision:0,positions:[]});
  finishDeal();await pending;
  assert.equal(focuses,0);assert.equal(player.inspectedCard,null);assert.equal(player.sharedInspectionIndex,null);assert.equal(player.activePosition,null);
});

function enableDiceSoNice(showForRoll){
  game.modules=new Map([['dice-so-nice',{active:true}]]);
  game.dice3d={isEnabled:()=>true,showForRoll};
}

test('Dice So Nice usa a rolagem original uma vez, aguarda o 3D e mantém apenas o número no chat',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let finishDice,signal;const started=new Promise(resolve=>{signal=resolve;});
  const calls=[],steps=[];
  enableDiceSoNice((...args)=>{calls.push(args);signal();return new Promise(resolve=>{finishDice=resolve;});});
  app.scene3D={uninspectCard:async()=>{},dealCard:async()=>steps.push('card'),inspectCard:async()=>steps.push('focus')};
  app.find=selector=>{assert.notEqual(selector,'.tarokka-dice-value');return null;};
  const pending=app.drawCard(0);await started;
  assert.equal(calls.length,1);assert.deepEqual(steps,[]);
  const [roll,user,synchronize,users,blind]=calls[0];
  assert.ok(roll instanceof Roll);assert.equal(roll.total,1);assert.equal(user.id,'gm');
  assert.equal(synchronize,false);assert.equal(users,null);assert.equal(blind,false);
  assert.equal(ctx.chat.length,0);
  finishDice(true);await pending;
  assert.equal(ctx.chat.length,1);assert.equal(ctx.chat[0].content,'1');
  assert.deepEqual(steps,['card','focus']);assert.equal(ctx.rolls,1);
});

test('jogador restaura o dado avaliado no Dice So Nice sem novo sorteio, chat ou retransmissão',async()=>{
  const ctx=setup(),gm=new TarokkaReadingApp();await gm.drawCard(0);
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  const playerCtx=setup(false),player=new TarokkaReadingApp(),calls=[];
  enableDiceSoNice(async(...args)=>{calls.push(args);return true;});
  player.applySyncState({...payload.state,revision:0,positions:[]},true);
  await player.onRemoteDrawCard(payload);
  assert.equal(calls.length,1);assert.deepEqual(calls[0][0].toJSON(),payload.dice.roll);
  assert.equal(calls[0][1].id,'gm');assert.equal(calls[0][2],false);
  assert.equal(playerCtx.rolls,0);assert.equal(playerCtx.chat.length,0);assert.equal(playerCtx.emitted.length,0);
});

test('Nova leitura libera a espera do Dice So Nice e descarta a distribuição e o chat antigos',async()=>{
  const ctx=setup();const app=new TarokkaReadingApp();let signal,finishDice,deals=0;const started=new Promise(resolve=>{signal=resolve;});
  enableDiceSoNice(()=>{signal();return new Promise(resolve=>{finishDice=resolve;});});
  app.scene3D={uninspectCard:async()=>{},dealCard:async()=>deals++,syncInstantState:()=>{}};
  const pending=app.drawCard(0);await started;await app.resetReading();await pending;
  assert.equal(deals,0);assert.equal(ctx.chat.length,0);assert.equal(app.activePosition,null);assert.ok(app.positions.every(p=>!p.card));
  finishDice(true);await Promise.resolve();assert.equal(deals,0);assert.equal(ctx.chat.length,0);
});

test('Dice So Nice desativado, indisponível ou com falha recorre ao dado simples sem novo sorteio',async()=>{
  for(const behavior of ['disabled','declined','failed']){
    const ctx=setup(),app=new TarokkaReadingApp();let simple=0,native=0;
    enableDiceSoNice(async()=>{native++;if(behavior==='failed')throw new Error('Falha esperada');return false;});
    if(behavior==='disabled')game.dice3d.isEnabled=()=>false;
    const die={textContent:'',animate:()=>{simple++;return {finished:Promise.resolve(),cancel(){}};}};
    const panel={hidden:true,querySelector:()=>die};app.find=selector=>selector==='.tarokka-dice'?panel:null;
    const warn=console.warn;console.warn=()=>{};try{await app.drawCard(0);}finally{console.warn=warn;}
    assert.equal(native,behavior==='disabled'?0:1);assert.equal(simple,2);
    assert.equal(ctx.rolls,1);assert.equal(ctx.chat.length,1);assert.equal(app.positions[0].state,'revealed');
  }
});

test('chat espera a animação real mesmo quando a API do Dice So Nice retorna imediatamente',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let finishDice,signal;
  const started=new Promise(resolve=>{signal=resolve;}),steps=[];
  const nativeAnimation=()=>{signal();return new Promise(resolve=>{finishDice=resolve;});};
  const showForRoll=function(roll,user){this._showAnimation({roll,user},{});return Promise.resolve();};
  enableDiceSoNice(showForRoll);game.dice3d._showAnimation=nativeAnimation;
  globalThis.ChatMessage.create=async data=>{steps.push('chat');ctx.chat.push(data);};
  app.scene3D={uninspectCard:async()=>{},dealCard:async()=>steps.push('card'),inspectCard:async()=>{}};
  const pending=app.drawCard(0);await started;
  for(let i=0;i<8;i++)await Promise.resolve();
  assert.equal(ctx.chat.length,0);assert.deepEqual(steps,[]);
  assert.equal(game.dice3d._showAnimation,nativeAnimation);assert.equal(game.dice3d.showForRoll,showForRoll);
  finishDice(true);await pending;
  assert.deepEqual(steps,['chat','card']);assert.equal(ctx.chat[0].content,'1');assert.equal(ctx.rolls,1);
});

test('chat espera a conclusão da rolagem do Dice So Nice enfileirada em aba oculta',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();let signal;const queued=new Promise(resolve=>{signal=resolve;});
  enableDiceSoNice(function(){return new Promise(resolve=>{this.hiddenAnimationQueue.push({resolve,timestamp:123});resolve();signal();});});
  const queue=[];game.dice3d.hiddenAnimationQueue=queue;
  const pending=app.drawCard(0);await queued;
  for(let i=0;i<8;i++)await Promise.resolve();
  assert.equal(ctx.chat.length,0);assert.equal(queue.length,1);assert.equal(game.dice3d.hiddenAnimationQueue,queue);
  queue.shift().resolve(true);await pending;
  assert.equal(ctx.chat.length,1);assert.equal(ctx.chat[0].content,'1');
});

test('chat espera o fim das duas etapas da animação simples antes de publicar só o número',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();const finishes=[],signals=[];
  const stages=[new Promise(resolve=>signals.push(resolve)),new Promise(resolve=>signals.push(resolve))];
  const die={textContent:'',animate(){const i=finishes.length;signals[i]();return {finished:new Promise(resolve=>finishes.push(resolve)),cancel(){}};}};
  const panel={hidden:true,querySelector:()=>die};app.find=selector=>selector==='.tarokka-dice'?panel:null;
  const pending=app.drawCard(0);await stages[0];assert.equal(ctx.chat.length,0);
  finishes[0]();await stages[1];assert.equal(ctx.chat.length,0);
  finishes[1]();await pending;
  assert.equal(panel.hidden,true);assert.equal(ctx.chat.length,1);assert.equal(ctx.chat[0].content,'1');
});

test('dados mínimos e máximos do Reloaded mantêm as mesmas cinco cartas e pistas',async()=>{
  const readings=[];
  for(const edge of ['min','max']){
    const ctx=setup(),app=new TarokkaReadingApp();await app.setReadingMode('reloaded');
    globalThis.Roll=class extends globalThis.Roll{async evaluate(){await super.evaluate();if(edge==='max')this.total=Number(this.formula.split('>')[1]);return this;}};
    for(let i=0;i<5;i++)await app.drawCard(i);
    readings.push(app.positions);
    assert.deepEqual(ctx.chat.map(message=>message.content),edge==='min'?['1','1','1','1','1']:['40','39','38','14','13']);
    assert.deepEqual(app.positions.map(p=>p.card.id),['glyphs-9','swords-5','glyphs-8','high-12','high-11']);
  }
  assert.deepEqual(readings[0],readings[1]);
});

test('Reloaded aguarda Dice So Nice antes do chat e transmite os mesmos dados ao jogador',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();await app.setReadingMode('reloaded');
  let signal,finish;const started=new Promise(resolve=>{signal=resolve;});
  enableDiceSoNice(()=>{signal();return new Promise(resolve=>{finish=resolve;});});
  const pending=app.drawCard(0);await started;assert.equal(ctx.chat.length,0);
  finish(true);await pending;assert.equal(ctx.chat.length,1);assert.equal(ctx.chat[0].content,'1');
  const {payload}=ctx.emitted.find(message=>message.type==='DRAW_CARD');
  const playerCtx=setup(false),player=new TarokkaReadingApp(),calls=[];
  enableDiceSoNice(async(...args)=>{calls.push(args);return true;});
  player.applySyncState({...payload.state,revision:0,positions:[]},true);
  await player.onRemoteDrawCard(payload);
  assert.equal(calls.length,1);assert.deepEqual(calls[0][0].toJSON(),payload.dice.roll);
  assert.equal(player.positions[0].card.id,'glyphs-9');assert.equal(playerCtx.rolls,0);assert.equal(playerCtx.chat.length,0);
});

test('reiniciar Reloaded durante os dados cancela o chat pendente e limpa a carta fixa',async()=>{
  const ctx=setup(),app=new TarokkaReadingApp();await app.setReadingMode('reloaded');
  let signal,finish;const started=new Promise(resolve=>{signal=resolve;});
  enableDiceSoNice(()=>{signal();return new Promise(resolve=>{finish=resolve;});});
  const pending=app.drawCard(0);await started;await app.resetReading();await pending;
  finish(true);await Promise.resolve();
  assert.equal(ctx.chat.length,0);assert.ok(app.positions.every(p=>!p.card));assert.equal(app.mode,'reloaded');
});
