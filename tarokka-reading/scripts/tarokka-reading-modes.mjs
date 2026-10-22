import { COMMON_DECK, HIGH_DECK, getCardReading } from './tarokka-data.mjs';

export const READING_MODES={official:'Oficial — sorteio',reloaded:'Reloaded — predeterminada'};
export const normalizeMode=value=>value==='reloaded'?'reloaded':'official';
// DragnaCarta, Arc C, C4f. The Tarokka Reading (current main, reviewed 2026-10-20).
export const RELOADED_CARD_IDS=['glyphs-9','swords-5','glyphs-8','high-12','high-11'];
export function predeterminedCard(index){return [...COMMON_DECK,...HIGH_DECK].find(c=>c.id===RELOADED_CARD_IDS[index])??null;}

const overrides={
  0:{
    prophecy:'Vejo o antigo inimigo de uma casa velha e nobre. A alma perdida os levará até ele.',
    location:'Leo Dilisnya guarda o Tomo de Strahd no Plano Etéreo. O encontro ocorre no ritual para restaurar Stella Wachter em Wachterhaus, N4t (Reloaded, Arco H, H8–H9). O livro cai após a derrota do orador da forca. Não usar o esconderijo oficial em N4o.',
    area:'N4t / Plano Etéreo',reference:'Curse of Strahd: Reloaded, Arco C, C4f; Arco H, H8–H9'
  },
  1:{reference:'Curse of Strahd: Reloaded, Arco C, C4f; Curse of Strahd, cap. 1, 5 de Espadas, Z7'},
  2:{
    prophecy:'Aquilo que buscam jaz em uma prisão de âmbar, onde o diabo teme pisar. Esta arma está oculta há muito tempo. A casa do dragão caído pode levá-los até ela.',
    location:'O punho da Lâmina Solar está no semiplano oculto dentro da prisão de Vampyr, acessível pelo sarcófago em X42, no Templo de Âmbar. O espírito de Patrina Velikovna habita o punho; é preciso derrotá-la e reacender a arma conforme o Arco S, S6c. Argynvostholt fornece o caminho. Não usar a tesouraria X40 da leitura oficial.',
    area:'X42 / semiplano de Vampyr',reference:'Curse of Strahd: Reloaded, Arco C, C4f; Arco S, S6c'
  },
  3:{reference:'Curse of Strahd: Reloaded, Arco C, C4f; Curse of Strahd, cap. 1, Brumas'},
  4:{reference:'Curse of Strahd: Reloaded, Arco C, C4f; Curse of Strahd, cap. 1, Marionete, K60'}
};
export function readingForMode(card,index,mode='official'){
  const base=getCardReading(card,index);
  if(normalizeMode(mode)!=='reloaded'||card?.id!==RELOADED_CARD_IDS[index])return base;
  return {...base,...overrides[index]};
}
