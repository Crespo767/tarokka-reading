// Shared measurements for render geometry, physical colliders and layout tests.
export const TABLE = { radius: 3.10, playRadius: 2.84, top: 0.08, thickness: 0.24 };
export const CAMP = { floorY:-2.25, tentRadius:7.5, centerZ:-1.5, eaveY:3.1, apexY:4.6, apexZ:-4.2, entranceHalfAngle:0.35 };
export const VIEW = { fov:60, eye:{x:0,y:2.3,z:7.0}, target:{x:0,y:-0.15,z:-0.5}, fitAspect:0.92 };
export const TABLE_LEGS = [
  {top:{x:-1.65,y:-0.20,z:1.60},foot:{x:-1.93,y:CAMP.floorY,z:1.87}},
  {top:{x:1.65,y:-0.20,z:1.60},foot:{x:1.93,y:CAMP.floorY,z:1.87}},
  {top:{x:-1.65,y:-0.20,z:-1.60},foot:{x:-1.93,y:CAMP.floorY,z:-1.87}},
  {top:{x:1.65,y:-0.20,z:-1.60},foot:{x:1.93,y:CAMP.floorY,z:-1.87}}
];
export const CARD = { width: 0.78, length: 1.22, thickness: 0.018 };
export const CARD_REST_Y = TABLE.top + CARD.thickness / 2 + 0.001;
export const SLOTS = [
  { x:-1.08, y:CARD_REST_Y, z:-0.10, rotY:0 },
  { x:0, y:CARD_REST_Y, z:-1.48, rotY:0 },
  { x:1.08, y:CARD_REST_Y, z:-0.10, rotY:0 },
  { x:0, y:CARD_REST_Y, z:1.28, rotY:0 },
  { x:0, y:CARD_REST_Y, z:-0.10, rotY:0 }
];
// Common and high cards share one physical stack; their pools remain in reading rules.
export const DECK = { x:2.02, z:0.64, height:0.16, rotY:-0.10 };
export const CANDLES = [
  { x:-2.38, z:-0.38, height:0.52, radius:0.15 },
  { x:-1.82, z:1.50, height:0.38, radius:0.15 },
  { x:1.67, z:-1.86, height:0.63, radius:0.15 }
];
export const CRYSTAL = { x:-1.84, z:-1.68, radius:0.25, standRadius:0.30, standHeight:0.14 };
export const TRAVEL_Y = 1.48;

// Pixel layout shared by the camera-space card and the description beside it.
export function inspectionLayout(width,height){
  const margin=24,gap=Math.min(48,Math.max(18,width*0.035));
  const panelWidth=Math.min(310,width*0.31);
  const cardHeight=Math.max(1,Math.min(height*0.76,680,(width-margin*2-gap-panelWidth)*CARD.length/CARD.width));
  const cardWidth=cardHeight*CARD.width/CARD.length;
  const left=(width-panelWidth-gap-cardWidth)/2;
  return {panelLeft:left,panelWidth,panelTop:height*0.49,cardHeight,cardWidth,cardCenterX:left+panelWidth+gap+cardWidth/2,cardCenterY:height*0.49};
}
