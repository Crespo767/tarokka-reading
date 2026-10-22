import { chromium } from '@playwright/test';
import { writeFile, mkdir } from 'node:fs/promises';

const label=process.argv[2]??'current';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
  const page=await browser.newPage({viewport:{width:1280,height:860},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:4173/?session=measure-${label}-${Date.now()}`);
  await page.waitForFunction(()=>globalThis.game?.tarokka?.app?.scene3D && document.querySelector('.tarokka-loading')?.hidden,{},{timeout:60000});
  const metrics=await page.evaluate(async()=>{
    const scene=game.tarokka.app.scene3D;
    const bytes=()=>{
      const geometry=new Set();scene.scene.traverse(o=>{if(o.geometry)geometry.add(o.geometry);});
      return [...geometry].reduce((n,g)=>n+(g.index?.array.byteLength??0)+Object.values(g.attributes).reduce((sum,a)=>sum+a.array.byteLength,0),0);
    };
    const resources=performance.getEntriesByType('resource');
    let renders=0;const render=scene.renderer.render.bind(scene.renderer);
    scene.renderer.render=(...args)=>{renders++;return render(...args);};
    await new Promise(resolve=>setTimeout(resolve,1000));scene.renderer.render=render;
    return {sampleEndMs:Math.round(performance.now()),resourceBytes:resources.reduce((n,r)=>n+r.decodedBodySize,0),imageBytes:resources.filter(r=>r.initiatorType==='img').reduce((n,r)=>n+r.decodedBodySize,0),geometryBytes:bytes(),drawCalls:scene.renderer.info.render.calls,triangles:scene.renderer.info.render.triangles,gpuTextures:scene.renderer.info.memory.textures,idleRendersPerSecond:renders,errors:[]};
  });
  metrics.errors=errors;
  await mkdir('docs/previews',{recursive:true});
  await page.screenshot({path:`docs/previews/performance-${label}.png`});
  await writeFile(`docs/performance-${label}.json`,JSON.stringify(metrics,null,2)+'\n');
  console.log(JSON.stringify(metrics,null,2));
} finally {await browser.close();}
