// 40x32 pixel dog sprite (sitting, cartoon style)
// Palette: 0=transparent, 1=body-brown, 2=body-dark, 3=muzzle/belly, 4=nose/eyes, 5=tongue, 6=ears

export const DOG_PALETTE = [
  'transparent',  // 0
  '#c8853a',      // 1 main coat brown/tan
  '#8b5a2b',      // 2 dark markings
  '#f5d9b0',      // 3 muzzle/belly cream
  '#1a0a00',      // 4 nose/eyes black
  '#ff4444',      // 5 tongue
  '#a06028',      // 6 ear inner
  '#e8a050',      // 7 highlight
];

function row(s: string): number[] {
  return s.split('').map(Number);
}

// 40-wide rows, 32 tall
// Dog sitting, facing right (toward manager)
const IDLE_FRAME_0: number[][] = [
  // Row 0-3: ears + top of head
  row('00000000002211110000000000000000000000000000'),
  row('00000000022211111100000000000000000000000000'),
  row('00000000222111111100000000000000000000000000'),
  row('00000000221111111000000000000000000000000000'),
  // Row 4-9: head
  row('00000002211111111100000000000000000000000000'),
  row('00000022111444111100000000000000000000000000'),// eyes
  row('00000022111111111110000000000000000000000000'),
  row('00000021113331111110000000000000000000000000'),// muzzle starts
  row('00000022133333331110000000000000000000000000'),
  row('00000002233344333110000000000000000000000000'),// nose
  // Row 10-14: neck + chest
  row('00000002221333312100000000000000000000000000'),
  row('00000002211333311100000000000000000000000000'),
  row('00000002211133311100000000000000000000000000'),
  row('00000011111133311110000000000000000000000000'),
  row('00000111111133311111000000000000000000000000'),
  // Row 15-21: body
  row('00001111111133333111100000000000000000000000'),
  row('00011111111133333111110000000000000000000000'),
  row('00111111111133333111111000000000000000000000'),
  row('01111111111133333111111100000000000000000000'),
  row('01111111111133333111111100000000000000000000'),
  row('01111111111133333111111100000000000000000000'),
  row('01111111111133333111111100000000000000000000'),
  // Row 22-27: lower body + back legs
  row('01111111222233333222111100000000000000000000'),
  row('11111112222233333222211100000000000000000000'),
  row('11111122222233333222221100000000000000000000'),
  row('11122222222233333222222110000000000000000000'),
  row('11222222222233333222222110000000000000000000'),
  row('01222222222133333122222100000000000000000000'),
  // Row 28-31: paws + tail
  row('00122222221133311122222100000000000000000000'),
  row('00022222221133311122222000000000000000000000'),
  row('00002222221133311122220000000000000000000000'),
  row('00000222220133311022220000000000000000000000'),
];

// Frame 1: tail wags right (tail pixel on right)
function wagTailRight(rows: number[][]): number[][] {
  return rows.map((r, i) => {
    const nr = [...r];
    if (i >= 20 && i <= 28 && nr.length > 35) {
      // Shift rightmost tail pixel
      nr[34] = nr[33] || 0;
      nr[33] = 0;
    }
    return nr;
  });
}

// Frame 2-3: lean forward (shift whole sprite 2px right)
function leanForward(rows: number[][]): number[][] {
  return rows.map((r) => {
    const shifted = [0, 0, ...r.slice(0, r.length - 2)];
    return shifted;
  });
}

// Frame 4-5: excited - tongue out
function tongueOut(rows: number[][]): number[][] {
  return rows.map((r, i) => {
    const nr = [...r];
    if (i === 10) {
      // Add tongue between muzzle pixels
      nr[8] = 5; nr[9] = 5; nr[10] = 5;
    }
    if (i === 11) {
      nr[8] = 5; nr[9] = 5;
    }
    // Also make ears perk up (row 0-1 modify)
    return nr;
  });
}

export const DOG_FRAMES: number[][][] = [
  IDLE_FRAME_0,
  wagTailRight(IDLE_FRAME_0),
  leanForward(IDLE_FRAME_0),
  leanForward(wagTailRight(IDLE_FRAME_0)),
  tongueOut(leanForward(IDLE_FRAME_0)),
  tongueOut(leanForward(wagTailRight(IDLE_FRAME_0))),
];

export const DOG_WIDTH = 40;
export const DOG_HEIGHT = 32;
