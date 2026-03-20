// 32x48 pixel manager sprite data
// Palette: 0=transparent, 1=skin, 2=hair/shoes, 3=suit, 4=shirt, 5=tie, 6=suit-dark, 7=skin-shadow

export const MANAGER_PALETTE = [
  'transparent',   // 0
  '#f4a46b',       // 1 skin
  '#2a1a0a',       // 2 hair/dark
  '#555577',       // 3 suit mid
  '#eeeeff',       // 4 shirt white
  '#cc2222',       // 5 tie red
  '#33334a',       // 6 suit dark
  '#d4845b',       // 7 skin shadow
  '#888899',       // 8 suit light
  '#ffffff',       // 9 bright white
];

// Frame 0 & 1: idle breathing (chest 1px shift)
// Frame 2 & 3: slight head bob
// Each frame: 48 rows × 32 cols

// Compact representation: each row as array of palette indices
function row(s: string): number[] {
  return s.split('').map(Number);
}

// 32-wide rows for a suited manager figure
// Head rows 0-9, shoulders 10-14, body 15-30, legs 31-47
const BASE_ROWS: number[][] = [
  // Row 0-2: hat/hair area
  row('00000000001122221111220000000000'),
  row('00000000112222222222221100000000'),
  row('00000000122222222222222100000000'),
  // Row 3-8: face
  row('00000001122111111111122110000000'),
  row('00000001211111111111112110000000'),
  row('00000001211121111211112110000000'),// eyes
  row('00000001211111111111112110000000'),
  row('00000001211117111711112110000000'),// nostrils
  row('00000001211171117111112110000000'),// mouth
  row('00000001122111111111122110000000'),
  // Row 10-13: neck + collar
  row('00000000011111111111110000000000'),
  row('00000000011144411111110000000000'),
  row('00000000044144411444400000000000'),
  row('00000000441155511554400000000000'),
  // Row 14-19: shoulders + chest
  row('00000066636388883668366600000000'),
  row('00006663338488884863366600000000'),
  row('00066633334844445543336600000000'),
  row('00666333344554455433333660000000'),
  row('06663333445554555543333360000000'),
  row('66633334455555555544333366000000'),
  // Row 20-25: torso
  row('66333344455555555544433366000000'),
  row('63333444555555555554433336000000'),
  row('63334445555555555554443336000000'),
  row('63344455555555555554443336000000'),
  row('63344455555555555554443336000000'),
  row('63344455555555555554443336000000'),
  // Row 26-30: waist / belt
  row('63344222222222222222223336000000'),
  row('63342222222222222222223336000000'),
  row('63342222332222222233223336000000'),
  row('63342223332222222333223336000000'),
  row('63342233333222222333323336000000'),
  // Row 31-38: upper legs
  row('00633333333222222333333360000000'),
  row('00633333222222222222333360000000'),
  row('00663322222222222222233660000000'),
  row('00066332222222222222333600000000'),
  row('00006633222222222222336600000000'),
  row('00000663322222222223366000000000'),
  row('00000066332222222233660000000000'),
  row('00000006632222222236600000000000'),
  // Row 39-47: lower legs / shoes
  row('00000006632222222236600000000000'),
  row('00000006622222222226600000000000'),
  row('00000006622222222226600000000000'),
  row('00000006622222222226600000000000'),
  row('00000006622222222226600000000000'),
  row('00000002222222222222200000000000'),
  row('00000022222222222222220000000000'),
  row('00000022222222222222220000000000'),
  row('00000002222000000222200000000000'),
];

// Frame 1: bob head down 1px (shift rows)
function shiftHeadDown(rows: number[][]): number[][] {
  const result = rows.map((r) => [...r]);
  // Shift top 10 rows down by inserting blank row at top
  const head = result.slice(0, 10);
  const blank = new Array(32).fill(0);
  return [blank, ...head, ...result.slice(10)].slice(0, 48);
}

export const MANAGER_FRAMES: number[][][] = [
  BASE_ROWS,
  shiftHeadDown(BASE_ROWS),
  BASE_ROWS,
  shiftHeadDown(BASE_ROWS),
];

export const MANAGER_WIDTH = 32;
export const MANAGER_HEIGHT = 48;
