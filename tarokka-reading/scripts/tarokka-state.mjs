import { normalizeMode, predeterminedCard, readingForMode } from './tarokka-reading-modes.mjs';
import { COMMON_DECK, HIGH_DECK, POSITION_NAMES, getCardDisplayName, getSuitInfo } from './tarokka-data.mjs';
import { gmNotesForReading } from './tarokka-gm-notes.mjs';

export function createPositions() {
  return POSITION_NAMES.map((p,index) => ({...p,index,deckType:index<3?'common':'high',card:null,state:'waiting',prophecy:null,gmInfo:null,gmNotes:null}));
}

export function availableCards(positions, index, mode='official') {
  if(normalizeMode(mode)==='reloaded'){const card=predeterminedCard(index);return card&&!positions.some(p=>p.card?.id===card.id)?[card]:[];}
  const deck = index < 3 ? COMMON_DECK : HIGH_DECK;
  const used = new Set(positions.filter(p => p.card).map(p => p.card.id));
  return deck.filter(c => !used.has(c.id));
}

export function revealPosition(card,index,mode='official') {
  const reading = readingForMode(card,index,mode);
  const suit = getSuitInfo(card.suit);
  const gmNotes=gmNotesForReading(card,index,reading,mode);
  return {...createPositions()[index], state:'revealed', card:{id:card.id,suit:card.suit,number:card.number,name:card.name,nameEn:card.nameEn,flavor:card.flavor,suitIcon:suit.symbol,suitName:suit.name,displayName:getCardDisplayName(card),image:card.image}, prophecy:reading.prophecy, gmInfo:gmNotes.map(note=>`${note.label}: ${note.text}`).join('\n\n'),gmNotes};
}

// Only the public, selected reading travels through sockets or world settings.
export function publicState(state) {
  return {readingId:state.readingId,revision:state.revision,mode:normalizeMode(state.mode),positions:state.positions.map(p => ({index:p.index,state:p.state==='revealed'?'revealed':'waiting',card:p.state==='revealed'?p.card:null,prophecy:p.state==='revealed'?p.prophecy:null})),isComplete:state.isComplete};
}

export function restorePositions(state,isGM=false) {
  const base = createPositions();
  if (!Array.isArray(state?.positions) || state.positions.length!==5) return base;
  const used = new Set();
  for (let i=0;i<5;i++) {
    const p=state.positions[i];
    if (p.state!=='revealed') break;
    const card=(i<3?COMMON_DECK:HIGH_DECK).find(c=>c.id===p.card?.id);
    if (!card || used.has(card.id)||(normalizeMode(state.mode)==='reloaded'&&card.id!==predeterminedCard(i)?.id)) break;
    used.add(card.id);
    const restored=revealPosition(card,i,state.mode);
    if (!isGM){restored.gmInfo=null;restored.gmNotes=null;}
    base[i]=restored;
  }
  return base;
}
