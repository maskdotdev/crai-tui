export const tokyoNightTheme = {
  name: "Tokyo Night",
  colors: {
    background: "#1a1b26",
    backgroundAlt: "#16161e",
    surface: "#1f2335",
    surfaceAlt: "#24283b",
    surfaceHighlight: "#2a3158",
    border: "#3b4261",
    borderMuted: "#2f3549",
    accent: "#7dcfff",
    accentMuted: "#7aa2f7",
    accentActive: "#bb9af7",
    textPrimary: "#c0caf5",
    textSecondary: "#a9b1d6",
    textMuted: "#565f89",
    placeholder: "#414868",
    cursor: "#c0caf5",
    positive: "#9ece6a",
    warning: "#e0af68",
    negative: "#f7768e",
    info: "#7aa2f7",
  },
} as const;

export type TokyoNightTheme = typeof tokyoNightTheme;
export type TokyoNightColors = typeof tokyoNightTheme.colors;
