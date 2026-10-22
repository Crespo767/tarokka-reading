const EVA_SOURCE='Compendium.curse-of-strahd-pt-br.atores.Actor.vRnJiRsFAF8bOURY';
const EVA_LEGACY_SOURCE='Compendium.curse-of-strahd-pt-br.atores.vRnJiRsFAF8bOURY';
const normalizeName=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLowerCase();

export function isMadameEva(token) {
  const document=token?.document??token;
  const actor=token?.actor??document?.actor;
  // Imported actors retain their compendium origin even after being renamed.
  const sources=[actor?._stats?.compendiumSource,actor?.flags?.core?.sourceId,document?._stats?.compendiumSource];
  if(sources.some(source=>source===EVA_SOURCE||source===EVA_LEGACY_SOURCE))return true;
  return [actor?.name,document?.name].some(name=>['madame eva','madam eva'].includes(normalizeName(name)));
}

export function renderTarokkaTokenHUD(hud,html) {
  // Foundry v12 supplies jQuery; v13 supplies the native element.
  const root=html?.querySelector?html:html?.[0];
  if(!root?.querySelector)return;
  root.querySelector('.tarokka-token-control')?.remove();
  if(!isMadameEva(hud?.object??hud?.document))return;
  const column=root.querySelector('.col.right')??root.querySelector('.col.left');
  if(!column)return;
  const button=root.ownerDocument.createElement('button');
  button.type='button';button.className='control-icon tarokka-token-control';
  button.title='Abrir a leitura Tarokka';button.setAttribute('aria-label','Tarokka');
  const icon=root.ownerDocument.createElement('i');icon.className='fas fa-hat-wizard';icon.setAttribute('aria-hidden','true');
  const label=root.ownerDocument.createElement('span');label.textContent='Tarokka';
  button.append(icon,label);
  button.addEventListener('click',event=>{
    event.preventDefault();event.stopPropagation();game.tarokka?.open();
  });
  column.append(button);
}

export function registerTarokkaTokenHUD(){Hooks.on('renderTokenHUD',renderTarokkaTokenHUD);}

let playPrompt=null;
export function promptTarokkaPlayer(){
  if(playPrompt)return playPrompt;
  playPrompt=Promise.resolve().then(async()=>{
    const content='<p>Deseja jogar Tarokka com Madame Eva?</p>';
    const DialogV2=globalThis.foundry?.applications?.api?.DialogV2;
    const accepted=DialogV2
      ?await DialogV2.confirm({window:{title:'Jogar Tarokka?'},content,modal:true,rejectClose:false,yes:{label:'Jogar'},no:{label:'Cancelar'}})
      :await Dialog.confirm({title:'Jogar Tarokka?',content,defaultYes:false,rejectClose:false});
    if(accepted===true)game.tarokka?.open();
  }).catch(error=>{
    console.error('Tarokka | Convite da Madame Eva',error);
    ui.notifications.error('Não foi possível abrir a leitura Tarokka.');
  }).finally(()=>{playPrompt=null;});
  return playPrompt;
}

// DOM capture runs before Pixi's token permission checks. Hit-test only rendered,
// visible tokens so NPC ownership is unnecessary and hidden tokens stay private.
export function tokenAtPointer(sceneCanvas,event){
  const renderer=sceneCanvas.app?.renderer,view=sceneCanvas.app?.canvas??sceneCanvas.app?.view;
  if(!sceneCanvas.ready||sceneCanvas.tokens?.active===false||!view||event.target!==view)return null;
  const point={x:0,y:0};
  if(renderer?.events?.mapPositionToPoint)renderer.events.mapPositionToPoint(point,event.clientX,event.clientY);
  else{
    const rect=view.getBoundingClientRect();
    if(!rect.width||!rect.height)return null;
    point.x=(event.clientX-rect.left)*(renderer?.screen?.width??rect.width)/rect.width;
    point.y=(event.clientY-rect.top)*(renderer?.screen?.height??rect.height)/rect.height;
  }
  const tokens=sceneCanvas.tokens?.objects?.children??sceneCanvas.tokens?.placeables??[];
  for(const token of [...tokens].reverse()){
    if(!token.document||token.document.hidden||!token.visible||token.renderable===false||token.worldVisible===false||token.worldAlpha===0||token.isVisible===false)continue;
    const local=token.toLocal(point);
    const hit=token.hitArea??token.shape;
    if(hit?.contains?hit.contains(local.x,local.y):(local.x>=0&&local.y>=0&&local.x<token.w&&local.y<token.h))return token;
  }
  return null;
}

export function createTarokkaPlayerClicks(sceneCanvas,play=promptTarokkaPlayer){
  let previous=null;
  const moved=event=>{
    if(previous&&Math.hypot(event.clientX-previous.x,event.clientY-previous.y)>8)previous=null;
  };
  const down=event=>{
    if(game.user.isGM||event.button!==0||(event.pointerType&&event.pointerType!=='mouse')||event.shiftKey||event.ctrlKey||event.altKey||event.metaKey){previous=null;return;}
    const token=tokenAtPointer(sceneCanvas,event);
    if(!isMadameEva(token)){previous=null;return;}
    const now=event.timeStamp;
    if(previous&&previous.token===token&&now>=previous.time&&now-previous.time<=500&&Math.hypot(event.clientX-previous.x,event.clientY-previous.y)<=8){
      previous=null;
      event.preventDefault();event.stopImmediatePropagation();
      void play();
      return;
    }
    previous={token,time:now,x:event.clientX,y:event.clientY};
  };
  return {down,moved};
}

export function registerTarokkaPlayerShortcut(){
  let detach=()=>{};
  const attach=sceneCanvas=>{
    detach();detach=()=>{};
    const view=sceneCanvas?.app?.canvas??sceneCanvas?.app?.view;
    const root=view?.ownerDocument;
    if(!root||game.user.isGM)return;
    const {down,moved}=createTarokkaPlayerClicks(sceneCanvas);
    root.addEventListener('pointerdown',down,true);
    root.addEventListener('pointermove',moved,true);
    detach=()=>{root.removeEventListener('pointerdown',down,true);root.removeEventListener('pointermove',moved,true);};
  };
  Hooks.on('canvasReady',attach);
  Hooks.on('canvasTearDown',()=>{detach();detach=()=>{};});
  Hooks.on('ready',()=>{if(globalThis.canvas?.ready)attach(canvas);});
}
