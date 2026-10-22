import { test, expect } from '@playwright/test';

async function ready(page){
  await expect(page.locator('.tarokka-canvas')).toBeVisible();
  await expect(page.locator('.tarokka-loading')).toBeHidden({timeout:30000});
  await expect(page.locator('.tarokka-render-error')).toBeHidden();
  await page.waitForFunction(()=>globalThis.game?.tarokka?.app?.scene3D);
}
async function pair(context){
  const session=crypto.randomUUID(),gm=await context.newPage(),player=await context.newPage(),errors=[];
  for(const page of [gm,player]){
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()}: ${response.url()}`);});
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
  }
  await gm.goto(`/?session=${session}`);await ready(gm);
  await player.goto(`/?role=player&session=${session}`);await ready(player);
  await player.waitForFunction(()=>game.users.some(user=>user.isGM&&user.active));
  return {gm,player,errors};
}
async function settled(page,index){
  await page.waitForFunction(index=>{
    const app=game.tarokka.app;
    return app.activePosition===null&&app.scene3D.inspectedCardIndex===index&&app.inspectedCard?.index===index&&!app.scene3D.inspectionTask;
  },index);
  await expect(page.locator('.tarokka-inspect-panel')).toBeVisible();
}

test('iniciar o módulo e criar o controlador não carrega WebGL ou física',async({page})=>{
  await page.route('**/startup-test',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><script type="module">
    globalThis.Application=class{};
    globalThis.Hooks={on(){},once(event,callback){callback();}};
    globalThis.game={settings:{register(){},get(){return {};}},socket:{on(){}}};
    await import('/modules/tarokka-reading/scripts/tarokka-init.mjs');
    game.tarokka.ensureApp();window.started=true;
  </script>`}));
  await page.goto('/startup-test');await page.waitForFunction(()=>window.started);
  const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));
  expect(loaded.some(url=>/three\.module|cannon-es|tarokka-3d|tarokka-camp|tarokka-physics/.test(url))).toBe(false);
});

test('mestre e jogador completam os dois modos, inspecionam, recarregam e reiniciam',async({context})=>{
  const {gm,player,errors}=await pair(context);
  for(const mode of ['official','reloaded']){
    if(mode==='reloaded')await gm.locator('[data-reading-mode]').selectOption(mode);
    for(let index=0;index<5;index++){
      await player.locator('[data-action="draw-next"]').click();
      await Promise.all([settled(gm,index),settled(player,index)]);
      const ids=await gm.evaluate(()=>game.tarokka.app.positions.filter(p=>p.card).map(p=>p.card.id));
      expect(await player.evaluate(()=>game.tarokka.app.positions.filter(p=>p.card).map(p=>p.card.id))).toEqual(ids);
      expect(new Set(ids).size).toBe(index+1);
      await expect(player.locator('.inspect-gm-info')).toBeHidden();
      expect(await player.evaluate(()=>game.tarokka.app.positions.every(p=>p.gmInfo===null&&p.gmNotes===null))).toBe(true);
      await expect(gm.locator('.inspect-gm-info')).toBeVisible();
      await player.locator('.close-inspection').click();
      await expect(player.locator('.tarokka-inspect-panel')).toBeHidden();
      await expect(gm.locator('.tarokka-inspect-panel')).toBeHidden();
    }
    if(mode==='reloaded')expect(await gm.evaluate(()=>game.tarokka.app.positions.map(p=>p.card.id))).toEqual(['glyphs-9','swords-5','glyphs-8','high-12','high-11']);
    await expect(player.locator('.tarokka-complete')).toBeVisible();
    await expect(gm.locator('[data-reading-mode]')).toBeDisabled();
    // Click the actual WebGL card at its projected position.
    const point=await player.evaluate(async()=>{
      const {Vector3}=await import('/modules/tarokka-reading/scripts/lib/three.module.min.js');
      const scene=game.tarokka.app.scene3D,card=scene.cards[2];
      scene.camera.updateMatrixWorld();const p=new Vector3().copy(card.position).project(scene.camera),r=scene.canvas.getBoundingClientRect();
      return {x:r.left+(p.x+1)*r.width/2,y:r.top+(1-p.y)*r.height/2};
    });
    await player.mouse.click(point.x,point.y);await Promise.all([settled(gm,2),settled(player,2)]);
    await player.reload();await ready(player);await settled(player,2);
    await player.keyboard.press('Escape');await expect(gm.locator('.tarokka-inspect-panel')).toBeHidden();
    await gm.locator('[data-action="reset"]').click();
    for(const page of [gm,player])await page.waitForFunction(()=>game.tarokka.app.positions.every(p=>!p.card)&&game.tarokka.app.scene3D.cards.every(c=>!c.visible));
    await expect(gm.locator('[data-reading-mode]')).toBeEnabled();
  }
  expect(errors).toEqual([]);
});

test('movimento reduzido para de renderizar em repouso; minimizar pausa e retomar redesenha',async({page})=>{
  await page.goto(`/?session=${crypto.randomUUID()}`);await ready(page);
  expect(await page.evaluate(()=>performance.getEntriesByType('resource').reduce((bytes,entry)=>bytes+entry.decodedBodySize,0))).toBeLessThan(6000000);
  await page.evaluate(()=>{
    const scene=game.tarokka.app.scene3D;window.renderCount=0;
    const render=scene.renderer.render.bind(scene.renderer);scene.renderer.render=(...args)=>{window.renderCount++;return render(...args);};
  });
  await page.waitForTimeout(250);
  expect(await page.evaluate(()=>window.renderCount)).toBeLessThanOrEqual(1);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect.poll(()=>page.evaluate(()=>window.renderCount)).toBeGreaterThan(2);
  await page.evaluate(()=>document.querySelector('#app').classList.add('minimized'));
  const paused=await page.evaluate(()=>window.renderCount);await page.waitForTimeout(250);
  expect(await page.evaluate(()=>window.renderCount)).toBe(paused);
  await page.evaluate(()=>document.querySelector('#app').classList.remove('minimized'));
  await expect.poll(()=>page.evaluate(()=>window.renderCount)).toBeGreaterThan(paused);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:800,height:750});
  await expect.poll(()=>page.evaluate(()=>game.tarokka.app.scene3D.camera.aspect)).toBeCloseTo(774/704,1);
});

test('reinício durante animação e fechar/reabrir liberam recursos e controles',async({context})=>{
  const {gm,player,errors}=await pair(context);
  await gm.emulateMedia({reducedMotion:'no-preference'});
  await player.emulateMedia({reducedMotion:'no-preference'});
  await player.locator('[data-action="draw-next"]').click();
  await gm.waitForFunction(()=>game.tarokka.app.activePosition===0);
  await gm.locator('[data-action="reset"]').click();
  await Promise.all([gm,player].map(page=>page.waitForFunction(()=>game.tarokka.app.activePosition===null&&game.tarokka.app.positions.every(p=>!p.card))));
  await gm.evaluate(async()=>{
    const app=game.tarokka.app,scene=app.scene3D;
    await app.close();window.destroyedScene={destroyed:scene.destroyed,textures:scene.textures.size,images:scene.imageSources.size,bodies:scene.physics.world.bodies.length};
    await app.render();
  });
  await ready(gm);
  expect(await gm.evaluate(()=>window.destroyedScene)).toEqual({destroyed:true,textures:0,images:0,bodies:0});
  await expect(gm.locator('[data-reading-mode]')).toBeEnabled();
  await gm.emulateMedia({reducedMotion:'reduce'});await player.emulateMedia({reducedMotion:'reduce'});
  await player.locator('[data-action="draw-next"]').click();await Promise.all([settled(gm,0),settled(player,0)]);
  expect(errors).toEqual([]);
});

test('animação completa com mestre minimizado mantém a leitura disponível',async({context},testInfo)=>{
  const {gm,player,errors}=await pair(context);
  await gm.emulateMedia({reducedMotion:'no-preference'});await player.emulateMedia({reducedMotion:'no-preference'});
  await player.locator('[data-action="draw-next"]').click();
  await gm.waitForFunction(()=>game.tarokka.app.scene3D.cards[0].userData.state==='dealing');
  await gm.evaluate(()=>document.querySelector('#app').classList.add('minimized'));
  await settled(player,0);
  await gm.waitForFunction(()=>game.tarokka.app.activePosition===null);
  await gm.evaluate(()=>document.querySelector('#app').classList.remove('minimized'));
  await settled(gm,0);
  await player.screenshot({path:testInfo.outputPath('player-inspection.png')});
  expect(errors).toEqual([]);
});

test('fechar antes de terminar a importação 3D não cria uma cena órfã',async({page})=>{
  let release,entered;
  const blocked=new Promise(resolve=>release=resolve),requested=new Promise(resolve=>entered=resolve);
  await page.route('**/tarokka-3d.mjs',async route=>{entered();await blocked;await route.continue();});
  await page.goto(`/?session=${crypto.randomUUID()}`);await requested;
  await page.evaluate(()=>game.tarokka.app.close());release();
  await page.evaluate(()=>game.tarokka.app._sceneReady);
  expect(await page.evaluate(()=>game.tarokka.app.scene3D)).toBeNull();
  await page.evaluate(()=>game.tarokka.app.render());await ready(page);
  expect(await page.evaluate(()=>game.tarokka.app.scene3D.destroyed)).toBe(false);
});
