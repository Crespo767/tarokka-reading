import test from 'node:test';
import assert from 'node:assert/strict';
import {isMadameEva,renderTarokkaTokenHUD,registerTarokkaTokenHUD,tokenAtPointer,createTarokkaPlayerClicks,promptTarokkaPlayer,registerTarokkaPlayerShortcut} from '../tarokka-reading/scripts/tarokka-token.mjs';

test('reconhece a Madame Eva do compêndio PT-BR mesmo com ator e token renomeados',()=>{
  const source='Compendium.curse-of-strahd-pt-br.atores.Actor.vRnJiRsFAF8bOURY';
  assert.equal(isMadameEva({name:'Vidente',actor:{name:'A anciã',_stats:{compendiumSource:source}}}),true);
  assert.equal(isMadameEva({actor:{name:'Renomeada',flags:{core:{sourceId:source.replace('.Actor.','.')}}}}),true);
  assert.equal(isMadameEva({document:{name:'Visitante'},actor:{name:' Madame   Eva '}}),true);
  assert.equal(isMadameEva({name:'Madam Eva'}),true);
  for(const name of ['Strahd','Ezmerelda','Eva','Madame Eva falsa'])assert.equal(isMadameEva({name}),false);
  assert.equal(isMadameEva(null),false);
});

function hudDOM(){
  const controls=[];
  const column={append(button){controls.push(button);}};
  const ownerDocument={createElement(tag){return {tag,children:[],attributes:{},listeners:{},setAttribute(key,value){this.attributes[key]=value;},append(...items){this.children.push(...items);},addEventListener(type,handler){this.listeners[type]=handler;},remove(){controls.splice(controls.indexOf(this),1);}};}};
  const root={ownerDocument,querySelector(selector){if(selector==='.tarokka-token-control')return controls[0];if(selector==='.col.right')return column;return null;}};
  return {root,controls};
}

test('atalho Tarokka abre a mesa no HUD nativo v13 e no jQuery v12, sem duplicar controles',()=>{
  let opened=0;globalThis.game={tarokka:{open(){opened++;}}};
  for(const jquery of [false,true]){
    const {root,controls}=hudDOM(),html=jquery?[root]:root;
    const hud={object:{actor:{name:'Madame Eva'}}};
    renderTarokkaTokenHUD(hud,html);renderTarokkaTokenHUD(hud,html);
    assert.equal(controls.length,1);assert.equal(controls[0].children[1].textContent,'Tarokka');
    assert.equal(controls[0].attributes['aria-label'],'Tarokka');
    let prevented=false,stopped=false;
    controls[0].listeners.click({preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});
    assert.equal(prevented&&stopped,true);
    renderTarokkaTokenHUD({document:{name:'Strahd'}},html);assert.equal(controls.length,0);
  }
  assert.equal(opened,2);
});

test('registra o controle no evento do menu de clique direito do token',()=>{
  let registered;
  globalThis.Hooks={on:(name,handler)=>{registered={name,handler};}};
  registerTarokkaTokenHUD();
  assert.equal(registered.name,'renderTokenHUD');assert.equal(registered.handler,renderTarokkaTokenHUD);
});

function playerScene(){
  globalThis.game={user:{isGM:false},tarokka:{open(){}}};
  const view={getBoundingClientRect:()=>({left:10,top:20,width:800,height:600})};
  const token={document:{name:'Madame Eva',hidden:false},actor:{name:'Madame Eva',ownership:{default:0}},visible:true,renderable:true,isVisible:true,w:100,h:100,
    // Include pan and zoom: global (400,300) -> local (0,0).
    toLocal:point=>({x:(point.x-400)/2,y:(point.y-300)/2}),hitArea:{contains:(x,y)=>x>=0&&x<100&&y>=0&&y<100}};
  const scene={ready:true,app:{view,renderer:{events:{mapPositionToPoint(point,x,y){point.x=x-10;point.y=y-20;}}}},tokens:{active:true,objects:{children:[token]}}};
  const click=(time,extras={})=>({target:view,button:0,pointerType:'mouse',clientX:450,clientY:360,timeStamp:time,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;},...extras});
  return {view,token,scene,click};
}

test('jogador sem permissão abre convite só com dois cliques esquerdos na Eva visível, com zoom e pan',()=>{
  const {scene,click}=playerScene();let invited=0;
  const {down}=createTarokkaPlayerClicks(scene,()=>{invited++;});
  const first=click(100);down(first);assert.equal(invited,0);assert.equal(first.stopped,undefined);
  const second=click(250);down(second);assert.equal(invited,1);assert.equal(second.prevented,true);assert.equal(second.stopped,true);
});

test('atalho ignora outros tokens, tokens ocultos, cliques fora do canvas e alterações de camada',()=>{
  const {scene,token,view,click}=playerScene();
  assert.equal(tokenAtPointer(scene,click(0)),token);
  for(const property of ['visible','isVisible','renderable','worldVisible']){
    token[property]=false;assert.equal(tokenAtPointer(scene,click(0)),null);token[property]=true;
  }
  token.document.hidden=true;assert.equal(tokenAtPointer(scene,click(0)),null);token.document.hidden=false;
  assert.equal(tokenAtPointer(scene,click(0,{target:{}})),null);
  scene.tokens.active=false;assert.equal(tokenAtPointer(scene,click(0)),null);scene.tokens.active=true;
  const other={...token,document:{name:'Strahd'},actor:{name:'Strahd'}};scene.tokens.objects.children.push(other);
  let invited=0;const {down}=createTarokkaPlayerClicks(scene,()=>invited++);down(click(0));down(click(100));assert.equal(invited,0);
  assert.equal(tokenAtPointer(scene,click(0)),other);assert.equal(view,scene.app.view);
});

test('clique direito, modificadores, intervalo longo, arraste e visão do mestre não abrem o convite',()=>{
  for(const kind of ['right','shift','slow','drag','gm']){
    const {scene,click}=playerScene();let invited=0;const {down,moved}=createTarokkaPlayerClicks(scene,()=>invited++);
    if(kind==='gm')game.user.isGM=true;
    down(click(0));
    if(kind==='drag')moved(click(50,{clientX:500}));
    down(click(kind==='slow'?800:100,kind==='right'?{button:2}:kind==='shift'?{shiftKey:true}:{}));
    assert.equal(invited,0,kind);
  }
});

test('modal Jogar Tarokka usa DialogV2 e só abre a mesa após confirmar, sem duplicar o convite',async()=>{
  playerScene();let opened=0,finish;const dialogs=[];game.tarokka.open=()=>opened++;
  globalThis.foundry={applications:{api:{DialogV2:{confirm:config=>{dialogs.push(config);return new Promise(resolve=>{finish=resolve;});}}}}};
  const first=promptTarokkaPlayer(),duplicate=promptTarokkaPlayer();assert.equal(first,duplicate);
  await Promise.resolve();assert.equal(dialogs.length,1);assert.equal(opened,0);
  assert.equal(dialogs[0].window.title,'Jogar Tarokka?');assert.equal(dialogs[0].modal,true);assert.equal(dialogs[0].no.label,'Cancelar');
  finish(true);await first;assert.equal(opened,1);
  for(const result of [false,null]){const cancelled=promptTarokkaPlayer();await Promise.resolve();finish(result);await cancelled;assert.equal(opened,1);}
});

test('convite também funciona no Dialog legado sem abrir a mesa ao cancelar',async()=>{
  playerScene();globalThis.foundry={};let opened=0;game.tarokka.open=()=>opened++;
  globalThis.Dialog={confirm:async config=>{assert.equal(config.title,'Jogar Tarokka?');assert.equal(config.defaultYes,false);return false;}};
  await promptTarokkaPlayer();assert.equal(opened,0);
  Dialog.confirm=async()=>true;await promptTarokkaPlayer();assert.equal(opened,1);
});

test('ouvintes de duplo clique são removidos e recriados ao trocar de cena, sem se acumular',()=>{
  const {scene,view}=playerScene(),hooks={},listeners=new Map();
  view.ownerDocument={addEventListener(type,handler,capture){assert.equal(capture,true);listeners.set(type,handler);},removeEventListener(type,handler,capture){assert.equal(capture,true);assert.equal(listeners.get(type),handler);listeners.delete(type);}};
  globalThis.Hooks={on:(name,handler)=>{hooks[name]=handler;}};
  registerTarokkaPlayerShortcut();hooks.canvasReady(scene);assert.equal(listeners.size,2);
  const previous=listeners.get('pointerdown');hooks.canvasReady(scene);assert.equal(listeners.size,2);assert.notEqual(listeners.get('pointerdown'),previous);
  hooks.canvasTearDown();assert.equal(listeners.size,0);
  game.user.isGM=true;hooks.canvasReady(scene);assert.equal(listeners.size,0);
});
