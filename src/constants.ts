export const COLORS = {
  red: "#FF4444",
  blue: "#4444FF",
  yellow: "#FFFF44",
  white: "#FFFFFF",
  black: "#333333",
  orange: "#FFA500",
  green: "#44FF44",
  purple: "#8A2BE2",
}

// COLORS のキーを型として再利用できるようにする
export type ColorKey = keyof typeof COLORS

// レベルごとに使う color の配列が、必ず COLORS のキーを並べたものだと型で保証する
export const LEVEL_COLORS: {
  1: ColorKey[],
  2: ColorKey[],
  3: ColorKey[],
} = {
  1: ["red", "blue", "yellow"],
  2: ["red", "blue", "yellow", "white", "black"],
  3: ["red", "blue", "yellow", "white", "black", "orange", "green", "purple"],
}


