// Small Foundry adapter. The application, 3D renderer, cards, template and CSS
// are the actual module files, so preview fixes carry through to Foundry.
const isGM=new URLSearchParams(location.search).get('role')!=='player';
const previewSession=new URLSearchParams(location.search).get('session')||'default';
const storageKey=previewSession==='default'?'tarokka-preview-state':`tarokka-preview-state-${previewSession}`;
document.querySelector('#role-name').textContent=isGM?'MESTRE':'JOGADOR';
document.title=`${isGM?'Mestre':'Jogador'} · Tarokka`;
document.querySelector('.preview-note').hidden=false;
let toastTimer;
const toast=message=>{document.querySelector('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.textContent=message;document.body.append(el);clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.remove(),4000);};
globalThis.ui={notifications:{info:toast,warn:toast,error:toast}};
globalThis.foundry={utils:{mergeObject:(a,b)=>({...a,...b})}};
globalThis.Application=class {
  static get defaultOptions(){return {};}
  constructor(){this.element=document.querySelector('#app');this.rendered=false;}
  async render(){this.element.innerHTML=await (await fetch('/modules/tarokka-reading/templates/tarokka-reading.hbs')).text();this.rendered=true;this.activateListeners(this.element);return this;}
  activateListeners(){}
  close(){this.rendered=false;this.element.replaceChildren();}
};
const channel=new BroadcastChannel(`tarokka-local-preview-${previewSession}`);
// Every tab is a distinct client, including multiple GM views.
const localUser={id:`preview-${Date.now()}-${crypto.randomUUID()}`,isGM,active:true,lastSeen:Date.now()};
const users=[localUser];users.get=id=>users.find(u=>u.id===id);
const presence=new BroadcastChannel(`tarokka-local-presence-${previewSession}`);
const announce=type=>presence.postMessage({type,user:{id:localUser.id,isGM:localUser.isGM}});
presence.addEventListener('message',({data})=>{
  if(!data?.user?.id)return;
  let user=users.get(data.user.id);
  if(!user){user={id:data.user.id,isGM:data.user.isGM===true};users.push(user);}
  user.active=data.type!=='leave';user.lastSeen=Date.now();
  if(data.type==='hello')announce('present');
});
announce('hello');
const presenceTimer=setInterval(()=>{for(const user of users)if(user!==localUser&&Date.now()-user.lastSeen>90000)user.active=false;announce('present');},2000);
// Give already-open views time to identify themselves before selecting the authority.
await new Promise(resolve=>setTimeout(resolve,150));
globalThis.game={user:localUser,users,settings:{get:()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}');}catch{return {};}},set:async(_module,_key,value)=>localStorage.setItem(storageKey,JSON.stringify(value))},socket:{emit:(_event,data)=>channel.postMessage(data),on:(_event,callback)=>channel.addEventListener('message',event=>callback(event.data))}};
globalThis.Roll=class {
  constructor(formula){this.formula=formula;const match=/^1d(\d+)(?:rr>(\d+))?$/.exec(formula);if(!match)throw new Error('Fórmula não suportada na prévia');this.sides=Number(match[1]);this.limit=Number(match[2]??match[1]);this.results=[];}
  async evaluate(){const max=2**32-(2**32%this.sides);do{let n;do{n=crypto.getRandomValues(new Uint32Array(1))[0];}while(n>=max);this.total=1+n%this.sides;this.results.push(this.total);}while(this.total>this.limit);return this;}
  toJSON(){return {formula:this.formula,total:this.total,results:this.results,evaluated:true};}
};
globalThis.ChatMessage={async create(message){showRollMessage(message);channel.postMessage({type:'PREVIEW_ROLL',message});return message;}};
function showRollMessage({content}){
  const article=document.createElement('article'),result=document.createElement('strong');
  result.textContent=content;
  article.append(result);document.querySelector('#chat-log').append(article);
}
channel.addEventListener('message',({data})=>{if(data?.type==='PREVIEW_ROLL')showRollMessage(data.message);});
const rollLink=document.createElement('a');rollLink.href='#';rollLink.textContent='Rolagens';rollLink.addEventListener('click',event=>{event.preventDefault();document.querySelector('#chat').showModal();});document.querySelector('.preview-note').append(rollLink);
document.querySelector('#chat>button').addEventListener('click',()=>document.querySelector('#chat').close());
const {TarokkaReadingApp}=await import('/modules/tarokka-reading/scripts/tarokka-app.mjs');
const {TarokkaSocket}=await import('/modules/tarokka-reading/scripts/tarokka-socket.mjs');
game.tarokka={app:null,ensureApp(){return this.app??=new TarokkaReadingApp();},open(){const app=this.ensureApp();if(!app.rendered)app.render();return app;}};
TarokkaSocket.init();await game.tarokka.ensureApp().render();
window.addEventListener('pagehide',()=>{announce('leave');clearInterval(presenceTimer);game.tarokka.app?.scene3D?.destroy();channel.close();presence.close();});
