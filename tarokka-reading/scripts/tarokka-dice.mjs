// CoS chapter 1 uses separate shuffled decks, not a prescribed dice formula.
// Rejection sampling with standard dice simulates a uniform draw without replacement.
export function officialRollFormula(index, remaining) {
  const capacity=index<3?40:14;
  if(!Number.isInteger(remaining)||remaining<1||remaining>capacity)throw new Error('Baralho inválido');
  return `1d${index<3?100:20}rr>${remaining}`;
}

export function validDrawRoll(roll,index,remaining) {
  return roll?.formula===officialRollFormula(index,remaining)&&Number.isInteger(roll.total)&&roll.total>=1&&roll.total<=remaining;
}

// DsN 5.3.4's public promise can resolve immediately when its chat option is on.
// Observe the actual animation promise on a per-call receiver, without replacing
// shared DsN methods or changing the user's settings. Keep queued hidden-tab rolls
// tied to their own completion as well.
export async function animateDiceSoNice(dsn,roll,user) {
  let finished=null;
  const renderer=Object.create(dsn);
  if(typeof dsn._showAnimation==='function')renderer._showAnimation=(...args)=>{
    finished=dsn._showAnimation(...args);
    return finished;
  };
  if(Array.isArray(dsn.hiddenAnimationQueue))renderer.hiddenAnimationQueue={push(entry){
    finished=new Promise(resolve=>{
      dsn.hiddenAnimationQueue.push({...entry,resolve(value){entry.resolve(value);resolve(value);}});
    });
  }};
  const displayed=await dsn.showForRoll.call(renderer,roll,user,false,null,false);
  return finished?await finished:displayed;
}
