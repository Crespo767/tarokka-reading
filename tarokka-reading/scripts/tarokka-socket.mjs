export const SOCKET_EVENT='module.tarokka-reading';
export class TarokkaSocket {
  static authority() {return game.users.filter(u=>u.isGM&&u.active).sort((a,b)=>a.id.localeCompare(b.id))[0];}
  static isAuthority() {return this.authority()?.id===game.user.id;}
  static emit(data) {game.socket?.emit(SOCKET_EVENT,{...data,senderId:game.user.id});}
  static init() {
    game.socket?.on(SOCKET_EVENT,async data=>{
      if(!data?.type||data.senderId===game.user.id)return;
      const sender=game.users.get(data.senderId);
      if(!sender?.active)return;
      const fromAuthority=data.senderId===this.authority()?.id;
      try {
        if(data.type==='REQUEST_MODE') {
          if(!this.isAuthority()||!sender.isGM||!['official','reloaded'].includes(data.mode))return;
          const app=game.tarokka.ensureApp();
          if(data.readingId!==app.readingId||data.revision!==app.revision){this.emitSyncState(app.getSyncState(),data.senderId);return;}
          await app.setReadingMode(data.mode);return;
        }
        if(data.type==='REQUEST_RESET') {
          if(!this.isAuthority()||!sender.isGM)return;
          const app=game.tarokka.ensureApp();
          if(data.readingId!==app.readingId||data.revision!==app.revision){this.emitSyncState(app.getSyncState(),data.senderId);return;}
          await app.resetReading();return;
        }
        if(data.type==='REQUEST_DRAW') {
          if(!this.isAuthority())return;
          const app=game.tarokka.ensureApp();
          if(data.readingId!==app.readingId||data.revision!==app.revision){this.emitSyncState(app.getSyncState(),data.senderId);return;}
          await app.drawCard(data.positionIndex);return;
        }
        if(data.type==='REQUEST_INSPECTION'){
          if(!this.isAuthority())return;
          const app=game.tarokka.ensureApp();
          if(data.readingId!==app.readingId||data.revision!==app.revision){this.emitSyncState(app.getSyncState(),data.senderId,app.getInspectionState());return;}
          await app.shareInspection(data.positionIndex);return;
        }
        if(data.type==='REQUEST_STATE') {
          if(this.isAuthority()){const app=game.tarokka.ensureApp();this.emitSyncState(app.getSyncState(),data.senderId,app.getInspectionState());}
          return;
        }
        if(!fromAuthority)return;
        switch(data.type) {
          case 'OPEN_APP':game.tarokka.open();break;
          case 'DRAW_CARD':await game.tarokka.ensureApp().onRemoteDrawCard(data.payload);break;
          case 'INSPECT_CARD':await game.tarokka.ensureApp().onRemoteInspection(data.payload);break;
          case 'RESET':game.tarokka.ensureApp().onRemoteReset(data.state);break;
          case 'SYNC_STATE':if(data.targetUserId===game.user.id){const app=game.tarokka.ensureApp();app.applySyncState(data.state,true);if(data.inspection)await app.onRemoteInspection(data.inspection);}break;
        }
      } catch(error){console.error('Tarokka | Sincronização',error);}
    });
  }
  static emitOpenForAll(){if(this.isAuthority())this.emit({type:'OPEN_APP'});}
  static requestDraw(positionIndex,readingId,revision){
    if(!this.authority())return ui.notifications.warn('O mestre precisa estar conectado para conduzir a leitura.');
    this.emit({type:'REQUEST_DRAW',positionIndex,readingId,revision});
  }
  static requestInspection(positionIndex,readingId,revision){
    if(!this.authority())return ui.notifications.warn('O mestre precisa estar conectado para compartilhar a carta.');
    this.emit({type:'REQUEST_INSPECTION',positionIndex,readingId,revision});
  }
  static emitInspection(payload){if(this.isAuthority())this.emit({type:'INSPECT_CARD',payload});}
  static emitDrawCard(payload){if(this.isAuthority())this.emit({type:'DRAW_CARD',payload});}
  static emitReset(state){if(this.isAuthority())this.emit({type:'RESET',state});}
  static requestReset(readingId,revision){
    if(!game.user.isGM)return;
    if(!this.authority())return ui.notifications.warn('O mestre precisa estar conectado para reiniciar a leitura.');
    this.emit({type:'REQUEST_RESET',readingId,revision});
  }
  static requestMode(mode,readingId,revision){
    if(!game.user.isGM)return;
    if(!this.authority())return ui.notifications.warn('O mestre precisa estar conectado para trocar o modo.');
    this.emit({type:'REQUEST_MODE',mode,readingId,revision});
  }
  static requestCurrentState(){this.emit({type:'REQUEST_STATE'});}
  static emitSyncState(state,targetUserId,inspection){if(this.isAuthority())this.emit({type:'SYNC_STATE',state,targetUserId,inspection});}
}
