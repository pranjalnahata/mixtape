export const THEMES = [
  {
    key: "green-clover",
    name: "Green Clover",
    accent: "#6f8f62",
    accentSoft: "#dfe9d8",
    tapeBody: "#f3efe7",
    tapeEdge: "#ede6dc",
    labelTone: "#fff9ef",
    pattern:
      "radial-gradient(circle at 13px 13px, rgba(111, 143, 98, 0.85) 0 3px, transparent 3px), radial-gradient(circle at 23px 17px, rgba(111, 143, 98, 0.72) 0 2px, transparent 2px), linear-gradient(180deg, rgba(255,255,255,0.6), rgba(238,244,233,0.7))",
  },
  {
    key: "sunny-grid",
    name: "Sunny Grid",
    accent: "#d9b84a",
    accentSoft: "#f5efc3",
    tapeBody: "#f7f1db",
    tapeEdge: "#efe4b7",
    labelTone: "#fffdf3",
    pattern:
      "linear-gradient(0deg, rgba(217,184,74,0.24) 1px, transparent 1px), linear-gradient(90deg, rgba(217,184,74,0.24) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.7), rgba(250,247,226,0.72))",
  },
  {
    key: "cherry-lines",
    name: "Cherry Lines",
    accent: "#c07672",
    accentSoft: "#f0d7d3",
    tapeBody: "#f7efef",
    tapeEdge: "#f3dfdd",
    labelTone: "#fff8f6",
    pattern:
      "linear-gradient(45deg, rgba(192,118,114,0.34) 1px, transparent 1px), linear-gradient(-45deg, rgba(192,118,114,0.24) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.6), rgba(249,240,240,0.74))",
  },
  {
    key: "blue-flower",
    name: "Blue Flower",
    accent: "#6b86b5",
    accentSoft: "#dce7f5",
    tapeBody: "#edf3fa",
    tapeEdge: "#d9e6f6",
    labelTone: "#f8fbff",
    pattern:
      "radial-gradient(circle at 16px 13px, rgba(107,134,181,0.75) 0 2px, transparent 2px), radial-gradient(circle at 11px 18px, rgba(107,134,181,0.48) 0 5px, transparent 5px), linear-gradient(180deg, rgba(255,255,255,0.72), rgba(236,243,250,0.8))",
  },
] as const;

export const DEFAULT_THEME_KEY = THEMES[0].key;

export function getThemeByKey(themeKey: string) {
  return THEMES.find((theme) => theme.key === themeKey) ?? THEMES[0];
}
