import { TarokkaReadingApp } from './tarokka-app.mjs';
import { TarokkaSocket } from './tarokka-socket.mjs';
import { registerTarokkaTokenHUD, registerTarokkaPlayerShortcut } from './tarokka-token.mjs';

registerTarokkaTokenHUD();
registerTarokkaPlayerShortcut();

Hooks.once('init',()=>{
  game.settings.register('tarokka-reading','readingState',{scope:'world',config:false,type:Object,default:{}});
});
Hooks.once('ready',()=>{
  game.tarokka={
    app:null,
    ensureApp(){return this.app??=new TarokkaReadingApp();},
    open(){const app=this.ensureApp();if(!app.rendered)app.render(true);else app.bringToTop?.();return app;},
    openForAll(){
      if(!game.user.isGM)return ui.notifications.warn('Apenas o mestre pode convocar os jogadores.');
      this.open();TarokkaSocket.emitOpenForAll();
    }
  };
  TarokkaSocket.init();
});
Hooks.on('getSceneControlButtons',controls=>{
  if(!game.user.isGM)return;
  const tool={name:'tarokka-3d',title:'Leitura Tarokka — Madame Eva',icon:'fas fa-hat-wizard',button:true,onClick:()=>game.tarokka?.open(),onChange:()=>game.tarokka?.open()};
  if(Array.isArray(controls)) {
    const token=controls.find(c=>c.name==='token');if(token&&!token.tools.some(t=>t.name===tool.name))token.tools.push(tool);
  } else if(controls?.tokens||controls?.token) {
    const token=controls.tokens??controls.token;token.tools[tool.name]=tool;
  }
});
