import { getCardDisplayName } from './tarokka-data.mjs';
import { inspectionLayout } from './tarokka-layout.mjs';
import { renderGMNotes } from './tarokka-gm-notes.mjs';
import { normalizeMode } from './tarokka-reading-modes.mjs';
import { officialRollFormula, validDrawRoll, animateDiceSoNice } from './tarokka-dice.mjs';
import { TarokkaSocket } from './tarokka-socket.mjs';
import { createPositions, availableCards, revealPosition, publicState, restorePositions } from './tarokka-state.mjs';

export class TarokkaReadingApp extends Application {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id:'tarokka-reading', title:'Tarokka — A leitura de Madame Eva',
      template:'modules/tarokka-reading/templates/tarokka-reading.hbs',
      width:1280,height:860,classes:['tarokka','tarokka-window','tarokka-3d-window'],resizable:true,popOut:true
    });
  }
  constructor(options={}) {
    super(options);
    this.mode='official';this.positions=createPositions(); this.scene3D=null; this.activePosition=null;
    this.isComplete=false; this.inspectedCard=null;this.sharedInspectionIndex=null;this.inspectionRevision=0;
    this.readingId=crypto.randomUUID(); this.revision=0; this._sequenceToken=0;this._resetting=false;
    const saved=game.settings.get('tarokka-reading','readingState');
    if (saved?.readingId) this.applySyncState(saved,true);
  }
  getData() { return {isGM:game.user.isGM}; }
  get root() { return this.element?.[0] ?? this.element; }
  find(selector) { return this.root?.querySelector?.(selector); }
  activateListeners(html) {
    super.activateListeners(html);
    globalThis.document?.body?.classList.add('tarokka-dsn-active');
    this.find('.tarokka-3d-app')?.classList.toggle('tarokka-player',!game.user.isGM);
    this.root.querySelectorAll('[data-gm]').forEach(el=>el.hidden=!game.user.isGM);
    this.root.querySelectorAll('[data-player]').forEach(el=>el.hidden=game.user.isGM);
    const actions={
      'draw-next':()=>this.drawNextCard(),
      'reset':()=>this.resetReading()
    };
    for (const [action,handler] of Object.entries(actions)) this.find(`[data-action="${action}"]`)?.addEventListener('click',()=>Promise.resolve(handler()).catch(e=>{console.error(e);ui.notifications.error('Não foi possível concluir a ação.');}));
    this.root.querySelectorAll('[data-position]').forEach(el=>el.addEventListener('click',()=>{
      const index=Number(el.dataset.position);
      if(this.positions[index].state==='revealed') this.requestInspection(index);
      else this.drawCard(index);
    }));
    this.find('[data-reading-mode]')?.addEventListener('change',event=>this.setReadingMode(event.target.value).catch(error=>{console.error('Tarokka | Modo de leitura',error);ui.notifications.error('Não foi possível trocar o modo de leitura.');this._updateHUD();}));
    this.find('.close-inspection')?.addEventListener('click',()=>{this.requestInspection(null);});
    if(this._inspectionKey)window.removeEventListener('keydown',this._inspectionKey);
    this._inspectionKey=e=>{if(e.key==='Escape'&&this.sharedInspectionIndex!==null)this.requestInspection(null);};window.addEventListener('keydown',this._inspectionKey);
    this._resizeObserver?.disconnect(); this.scene3D?.destroy();this.scene3D=null;
    const sceneEpoch=this._sceneEpoch=(this._sceneEpoch??0)+1;
    this._sceneReady=this._createScene(sceneEpoch);
    this._updateHUD();
    if(this.isComplete)this._updateHudStatus('“Os fios estão entrelaçados. Agora, a escolha é de vocês.”');
    if (!TarokkaSocket.isAuthority()) TarokkaSocket.requestCurrentState();
  }
  async _createScene(sceneEpoch){
    try {
      const canvas=this.find('.tarokka-canvas');
      if(!canvas)return;
      canvas.style.opacity='0';
      // Foundry loads the app controller on startup, but WebGL and physics are
      // only needed when the table is actually opened.
      const {Tarokka3DScene}=await import('./tarokka-3d.mjs');
      if(sceneEpoch!==this._sceneEpoch)return;
      this.scene3D=new Tarokka3DScene(canvas,{
        isGM:game.user.isGM,
        onReady:()=>{canvas.style.opacity='1';const loader=this.find('.tarokka-loading');if(loader)loader.hidden=true;},
        onLoadProgress:(loaded,total)=>{const progress=this.find('.tarokka-loading progress');if(progress){progress.max=total;progress.value=loaded;}},
        onCardClick:index=>this.drawCard(index), onDeckClick:()=>this.drawNextCard(),onInspectRequest:index=>this.requestInspection(index),
        onCardInspect:index=>{if(this.sharedInspectionIndex===index)this._setInspectedCard(this.positions[index]);},onCardUninspect:()=>this._setInspectedCard(null)
      });
      this.scene3D.syncInstantState(this.positions);
      this._resizeObserver=new ResizeObserver(()=>{this.scene3D?.resize(canvas.clientWidth,canvas.clientHeight);this._layoutInspection();});
      this._resizeObserver.observe(canvas);
      if(this.sharedInspectionIndex!==null&&this.activePosition===null)await this._showSharedInspection();
    } catch(error) {
      if(sceneEpoch!==this._sceneEpoch)return;
      console.error('Tarokka | WebGL',error);this.scene3D?.destroy();this.scene3D=null;
      const loading=this.find('.tarokka-loading'),failure=this.find('.tarokka-render-error');
      if(loading)loading.hidden=true;if(failure)failure.hidden=false;
    }
  }
  async drawNextCard() {
    const next=this.positions.find(p=>p.state==='waiting');
    if(next) await this.drawCard(next.index);
  }
  async drawAllCards() {
    if(!game.user.isGM || this.activePosition!==null || this._autoDrawing) return;
    if(!TarokkaSocket.isAuthority()) return ui.notifications.warn('A leitura é conduzida pelo primeiro mestre conectado.');
    this._autoDrawing=true;const token=++this._sequenceToken;
    try {
      for(let i=0;i<5 && token===this._sequenceToken;i++) {
        if(this.positions[i].state==='waiting') {await this.drawCard(i,true);if(this.positions[i].state!=='revealed')break;await new Promise(r=>setTimeout(r,600));}
      }
    } finally {this._autoDrawing=false;this._updateHUD();}
  }
  async drawCard(index,fromSequence=false) {
    if (this._resetting || !Number.isInteger(index) || index<0 || index>4 || this.activePosition!==null || (this._autoDrawing&&!fromSequence)) return;
    const next=this.positions.find(p=>p.state==='waiting');
    if(!next || next.index!==index) return;
    if(!TarokkaSocket.isAuthority()) {TarokkaSocket.requestDraw(index,this.readingId,this.revision);this._updateHudStatus('Seu pedido foi enviado a Madame Eva. Aguardando o mestre…');return;}
    this.activePosition=index;this._updateHUD();
    this._updateHudStatus(`Madame Eva volta os olhos para ${next.name.toLowerCase()}…`);
    let committed=false;
    const readingId=this.readingId,sequence=this._sequenceToken;
    const current=()=>readingId===this.readingId&&sequence===this._sequenceToken;
    try {
      if(this.sharedInspectionIndex!==null)await this.shareInspection(null);
      await this.scene3D?.uninspectCard();
      if(!current())return;
      this._setInspectedCard(null);
      const pool=availableCards(this.positions,index,this.mode);
      if(!pool.length)throw new Error('Baralho esgotado');
      // Reloaded uses the same dice presentation, independently of its fixed card.
      const remaining=availableCards(this.positions,index,'official').length;
      const roll=await new Roll(officialRollFormula(index,remaining)).evaluate();
      if(!current())return;
      if(!Number.isInteger(roll.total)||roll.total<1||roll.total>remaining)throw new Error('Resultado de dado inválido');
      const position=revealPosition(this.mode==='reloaded'?pool[0]:pool[roll.total-1],index,this.mode);
      this.positions[index]=position;this.revision++;this.isComplete=this.positions.every(p=>p.state==='revealed');committed=true;
      // Broadcast before playing the local animation. No GM interpretation is sent.
      const state=this.getSyncState();
      const dice={formula:officialRollFormula(index,remaining),total:roll.total,remaining,roll:roll.toJSON(),userId:game.user.id};
      TarokkaSocket.emitDrawCard({positionIndex:index,state,dice});
      await this._persist();
      if(!current())return;
      if(dice)await this._showRoll(dice,roll);
      if(!current())return;
      if(roll){
        try {
          await ChatMessage.create({content:String(roll.total),whisper:[],blind:false});
        } catch(error){console.error('Tarokka | Registro dos dados',error);ui.notifications.warn('A carta foi sorteada, mas o resultado dos dados não pôde ser enviado ao chat.');}
      }
      if(!current())return;
      if(this.scene3D) await this.scene3D.dealCard(index,position.card,position.prophecy);
      if(!current())return;
      // Use the same shared presentation as clicking a revealed card.
      await this.shareInspection(index,{afterDeal:true});
      this._updateHudStatus(this.isComplete?'“Os fios estão entrelaçados. Agora, a escolha é de vocês.”':`“${position.card.name}. O destino começa a tomar forma.”`);
    } catch(error) {
      if(!current())return;
      console.error('Tarokka | Sorteio',error);
      ui.notifications.error(committed?'A carta foi salva; houve uma falha na animação.':'Não foi possível revelar a carta. Tente novamente.');
      if(!committed)this._updateHudStatus('As brumas ocultaram a visão. Tente revelar a carta novamente.');
    } finally {if(current()){this.activePosition=null;this._updateHUD();if(this.sharedInspectionIndex!==null)await this._showSharedInspection();}}
  }
  async onRemoteDrawCard({positionIndex,state,dice}) {
    if(!state || state.readingId!==this.readingId || state.revision<=this.revision) return;
    this.sharedInspectionIndex=null;this._setInspectedCard(null);
    this.applySyncState(state,false,false);
    this.scene3D?.syncInstantState(this.positions.map((p,i)=>i===positionIndex?{state:'waiting'}:p));
    const pos=this.positions[positionIndex];
    if(!pos?.card) return;
    const readingId=this.readingId;
    // Each client opens the drawn card after its own dice and deal finish.
    // A background GM must not be needed for the player's local presentation.
    this.sharedInspectionIndex=positionIndex;
    this.activePosition=positionIndex;this._updateHUD();
    try {
      const remaining=(positionIndex<3?40:14)-(positionIndex<3?positionIndex:positionIndex-3);
      if(dice?.remaining===remaining&&validDrawRoll(dice,positionIndex,remaining))await this._showRoll(dice);
      if(readingId!==this.readingId||state.revision!==this.revision)return;
      if(this.scene3D)await this.scene3D.dealCard(positionIndex,pos.card,pos.prophecy);
      if(readingId!==this.readingId||state.revision!==this.revision)return;
      this._updateHudStatus(this.isComplete?'“O destino foi revelado. O caminho ainda é de vocês.”':`“${pos.card.name}. Escutem o que as cartas dizem.”`);
    } finally {if(readingId===this.readingId&&state.revision===this.revision){this.activePosition=null;this._updateHUD();if(this.sharedInspectionIndex!==null)await this._showSharedInspection();}}
  }
  getSyncState() {return publicState(this);}
  applySyncState(state,force=false,syncScene=true) {
    if(!state?.readingId || !Number.isInteger(state.revision))return;
    if(!force&&state.readingId===this.readingId&&state.revision<this.revision)return;
    const presenting=this.activePosition!==null&&state.readingId===this.readingId&&state.revision===this.revision;
    if(syncScene&&!presenting&&this.activePosition!==null){this._clearRoll();this._sequenceToken++;this.activePosition=null;}
    if(state.readingId!==this.readingId){this._clearRoll();this._sequenceToken++;this.activePosition=null;this.sharedInspectionIndex=null;this.inspectionRevision=0;}
    this.mode=normalizeMode(state.mode);this.positions=restorePositions(state,game.user.isGM);
    this.readingId=state.readingId;this.revision=state.revision;
    this.isComplete=this.positions.every(p=>p.state==='revealed');
    if(syncScene&&!presenting){this.scene3D?.syncInstantState(this.positions);this._setInspectedCard(null);}
    this._updateHUD();
  }
  async _persist() {
    const state=this.getSyncState();
    const save=async()=>{
      try {await game.settings.set('tarokka-reading','readingState',state);}
      catch(error){console.error('Tarokka | Persistência',error);ui.notifications.warn('A leitura está na memória, mas não foi salva no mundo.');}
    };
    // A slow draw save must finish before the newer reset is written. The
    // reset itself still clears and broadcasts immediately, without waiting.
    const task=this._persistTask?this._persistTask.then(save):save();
    this._persistTask=task;await task;
    if(this._persistTask===task)this._persistTask=null;
  }
  get readingModeLocked(){return this._resetting||this.activePosition!==null||!!this._autoDrawing||this.positions.some(position=>!!position.card);}
  async setReadingMode(value){
    if(!game.user.isGM||this._resetting){this._updateHUD();return;}
    const mode=normalizeMode(value);if(mode===this.mode)return;
    if(this.readingModeLocked){this._updateHUD();ui.notifications.warn('Clique em Nova leitura antes de trocar o modo de leitura.');return;}
    if(!TarokkaSocket.isAuthority()){TarokkaSocket.requestMode(mode,this.readingId,this.revision);this._updateHUD();return;}
    this.mode=mode;
    await this.resetReading();
  }
  async resetReading(broadcast=true) {
    if(broadcast&&!game.user.isGM)return;
    if(broadcast&&!TarokkaSocket.isAuthority())return TarokkaSocket.requestReset(this.readingId,this.revision);
    if(this._resetting)return;
    this._resetting=true;
    this._sequenceToken++;this._autoDrawing=false;
    this.activePosition=null;
    this._clearRoll();
    try {
      this.positions=createPositions();this.isComplete=false;this.sharedInspectionIndex=null;this.inspectionRevision=0;
      this.readingId=crypto.randomUUID();this.revision=0;
      // Reset must not depend on the render loop or a pending animation promise.
      this.scene3D?.syncInstantState(this.positions);
      this._setInspectedCard(null);
      this._updateHUD();
      if(broadcast){TarokkaSocket.emitReset(this.getSyncState());await this._persist();}
      this._updateHudStatus('“Outra vez, as brumas se movem. Que destino procuram?”');
    } finally {this._resetting=false;this._updateHUD();}
  }
  onRemoteReset(state) {
    this._clearRoll();
    this._sequenceToken++;this._autoDrawing=false;this.activePosition=null;
    this.applySyncState(state,true);this._setInspectedCard(null);
    this._updateHudStatus('“Outra vez, as brumas se movem. Que destino procuram?”');
  }
  getInspectionState(){return {readingId:this.readingId,inspectionRevision:this.inspectionRevision,positionIndex:this.sharedInspectionIndex};}
  _canInspect(index){return index===null||(Number.isInteger(index)&&index>=0&&index<5&&this.positions[index]?.state==='revealed');}
  async requestInspection(index){
    if(!this._canInspect(index)||this.activePosition!==null)return;
    const selection=index===this.sharedInspectionIndex?null:index;
    if(TarokkaSocket.isAuthority())return this.shareInspection(selection);
    TarokkaSocket.requestInspection(selection,this.readingId,this.revision);
    // Revealed cards are already public. Inspect locally while the GM shares
    // the selection with the other clients, without waiting for its animation.
    this.sharedInspectionIndex=selection;
    return this._showSharedInspection();
  }
  async shareInspection(index,{afterDeal=false}={}){
    if(!TarokkaSocket.isAuthority()||!this._canInspect(index)||(index!==null&&this.activePosition!==null&&!(afterDeal&&this.activePosition===index)))return;
    const payload={readingId:this.readingId,inspectionRevision:this.inspectionRevision+1,positionIndex:index};
    TarokkaSocket.emitInspection(payload);return this.onRemoteInspection(payload);
  }
  async onRemoteInspection(payload){
    if(!payload||payload.readingId!==this.readingId||!Number.isInteger(payload.inspectionRevision)||payload.inspectionRevision<this.inspectionRevision||!this._canInspect(payload.positionIndex))return;
    this.inspectionRevision=payload.inspectionRevision;this.sharedInspectionIndex=payload.positionIndex;
    if(this.activePosition!==null&&payload.positionIndex!==null)return;
    return this._showSharedInspection();
  }
  _showSharedInspection(){
    const readingId=this.readingId,revision=this.inspectionRevision,index=this.sharedInspectionIndex;
    this._inspectionTask=(this._inspectionTask??Promise.resolve()).then(async()=>{
      const current=()=>readingId===this.readingId&&revision===this.inspectionRevision&&index===this.sharedInspectionIndex;
      if(!current())return;
      if(index!==null&&this.scene3D?.inspectedCardIndex===index){this._setInspectedCard(this.positions[index]);return;}
      await this.scene3D?.uninspectCard();if(!current())return;
      this._setInspectedCard(null);
      if(index!==null){await this.scene3D?.inspectCard(index);if(current())this._setInspectedCard(this.positions[index]);}
    }).catch(error=>{console.error('Tarokka | Ampliação compartilhada',error);});
    return this._inspectionTask;
  }
  _layoutInspection(){
    const canvas=this.find('.tarokka-canvas'),panel=this.find('.tarokka-inspect-panel');if(!canvas||!panel)return;
    const layout=inspectionLayout(canvas.clientWidth,canvas.clientHeight);
    const panelHeight=game.user.isGM?Math.max(1,2*Math.min(layout.panelTop-24,canvas.clientHeight-layout.panelTop-24)):Math.min(layout.cardHeight,canvas.clientHeight-48);
    panel.style.setProperty('--focus-left',`${layout.panelLeft}px`);panel.style.setProperty('--focus-width',`${layout.panelWidth}px`);panel.style.setProperty('--focus-top',`${layout.panelTop}px`);panel.style.setProperty('--focus-height',`${panelHeight}px`);
  }
  _updateHUD() {
    const count=this.positions.filter(p=>p.state==='revealed').length;
    const mode=this.find('[data-reading-mode]');if(mode){mode.value=this.mode;mode.disabled=this.readingModeLocked||!game.user.isGM;mode.title=this.readingModeLocked?'Clique em Nova leitura para liberar a troca de modo.':'Escolha o modo antes de revelar a primeira carta.';}
    const progress=this.find('.tarokka-progress');if(progress)progress.textContent=`${count} / 5`;
    this.root?.querySelectorAll?.('[data-position]').forEach((el,i)=>{
      const p=this.positions[i];el.classList.toggle('is-revealed',p.state==='revealed');el.classList.toggle('is-next',i===count);
      el.querySelector('.position-state').textContent=p.state==='revealed'?'✦':'○';
      el.disabled=p.state!=='revealed'&&(this.activePosition!==null||i!==count);
      el.setAttribute('aria-label',`${p.name}: ${p.state==='revealed'?p.card.name:'aguardando'}`);
    });
    const busy=this.activePosition!==null||this._autoDrawing;
    const draw=this.find('[data-action="draw-next"]');if(draw){draw.hidden=this.isComplete&&!game.user.isGM;draw.disabled=busy;}
    const all=this.find('[data-action="draw-all"]');if(all)all.disabled=this.isComplete||busy;
    const complete=this.find('.tarokka-complete');if(complete)complete.hidden=!this.isComplete||game.user.isGM;
    const label=this.find('[data-action="draw-next"] .tarokka-draw-label');if(label)label.textContent=busy?'Tirando a carta…':'Tirar uma carta';
    const reset=this.find('[data-action="reset"]');if(reset)reset.disabled=this._resetting;
  }
  _updateHudStatus(message) {const el=this.find('.tarokka-status-text');if(el)el.textContent=message;}
  async _showRoll(dice,evaluatedRoll=null) {
    this._clearRoll();
    const {total}=dice;
    const dsn=game.dice3d;
    if(game.modules?.get('dice-so-nice')?.active&&typeof dsn?.showForRoll==='function'){
      const cancelled=Symbol('cancelled');
      const cancellation=new Promise(resolve=>{this._cancelNativeDice=()=>resolve(cancelled);});
      const cancel=this._cancelNativeDice;
      try {
        if(dsn.isEnabled?.()!==false){
          // Restore the evaluated result; never evaluate dice again on remote clients.
          const roll=evaluatedRoll??Roll.fromJSON(JSON.stringify(dice.roll));
          if(roll.total!==total||roll.formula.replace(/\s/g,'')!==dice.formula)throw new Error('Rolagem 3D inválida');
          // Tarokka already broadcasts the evaluated roll. DsN must render locally only.
          const displayed=await Promise.race([animateDiceSoNice(dsn,roll,game.users.get(dice.userId)??game.user),cancellation]);
          if(displayed===cancelled||displayed===true)return;
        }
      } catch(error){console.warn('Tarokka | Dice So Nice indisponível; usando animação simples.',error);}
      finally {if(this._cancelNativeDice===cancel)this._cancelNativeDice=null;}
    }
    const panel=this.find('.tarokka-dice');if(!panel)return;
    this._clearRoll();panel.hidden=false;
    const die=panel.querySelector('.tarokka-dice-value');die.textContent=String(total);
    const reduced=globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const animation=die.animate([{transform:'translateY(-36px) rotate(-160deg)',opacity:0},{transform:'translateY(5px) rotate(15deg)',opacity:1,offset:.75},{transform:'none',opacity:1}],{duration:reduced?0:650,easing:'ease-out'});
    this._diceAnimation=animation;
    try {
      await animation.finished;if(this._diceAnimation!==animation)return;
      die.textContent=String(total);
      const hold=die.animate([{opacity:1},{opacity:1}],{duration:reduced?0:800});this._diceAnimation=hold;
      await hold.finished;if(this._diceAnimation===hold)this._clearRoll();
    } catch { /* Reset and close cancel the animation. */ }
  }
  _clearRoll(){this._cancelNativeDice?.();this._cancelNativeDice=null;this._diceAnimation?.cancel();this._diceAnimation=null;const panel=this.find('.tarokka-dice');if(panel)panel.hidden=true;}
  _setInspectedCard(pos) {
    this.inspectedCard=pos;this.find('.tarokka-3d-app')?.classList.toggle('is-inspecting',!!pos?.card&&this.sharedInspectionIndex!==null);this._layoutInspection();const panel=this.find('.tarokka-inspect-panel');if(!panel)return;
    panel.hidden=!pos?.card;panel.classList.toggle('active',!!pos?.card);if(!pos?.card)return;
    panel.querySelector('.inspect-card-name').textContent=getCardDisplayName(pos.card);
    panel.querySelector('.inspect-prophecy').textContent=pos.prophecy;
    panel.querySelector('.inspect-gm-info').hidden=!game.user.isGM||!pos.gmInfo;
    renderGMNotes(panel.querySelector('.inspect-gm-text'),game.user.isGM?pos.gmNotes:[]);
  }
  async close(options={}) {
    this._clearRoll();
    globalThis.document?.body?.classList.remove('tarokka-dsn-active');
    if(this._inspectionKey)window.removeEventListener('keydown',this._inspectionKey);
    this._sceneEpoch=(this._sceneEpoch??0)+1;
    this._sequenceToken++;this.activePosition=null;this._autoDrawing=false;this._resizeObserver?.disconnect();this._resizeObserver=null;
    this.scene3D?.destroy();this.scene3D=null;return super.close(options);
  }
}
