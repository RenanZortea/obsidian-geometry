export interface ThemeColors {
  bg: string;
  text: string;
  textMuted: string;
  gridLine: string;
  axis: string;
  tickLabel: string;
}

const FALLBACK_LIGHT: ThemeColors = {
  bg: "#ffffff",
  text: "#333333",
  textMuted: "#666666",
  gridLine: "#e0e0e0",
  axis: "#999999",
  tickLabel: "#666666",
};

const FALLBACK_DARK: ThemeColors = {
  bg: "#1e1e1e",
  text: "#dcddde",
  textMuted: "#999999",
  gridLine: "#333333",
  axis: "#555555",
  tickLabel: "#888888",
};

export function getThemeColors(): ThemeColors {
  const el = document.body;
  const style = getComputedStyle(el);
  const isDark = el.classList.contains("theme-dark");

  const fallback = isDark ? FALLBACK_DARK : FALLBACK_LIGHT;

  return {
    bg: readVar(style, "--background-primary") || fallback.bg,
    text: readVar(style, "--text-normal") || fallback.text,
    textMuted: readVar(style, "--text-muted") || fallback.textMuted,
    gridLine: isDark ? fallback.gridLine : fallback.gridLine,
    axis: readVar(style, "--text-muted") || fallback.axis,
    tickLabel: readVar(style, "--text-muted") || fallback.tickLabel,
  };
}

function readVar(style: CSSStyleDeclaration, varName: string): string {
  return style.getPropertyValue(varName).trim();
}
