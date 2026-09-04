// src/ui/code-preview.ts
var AUTO_SHIKI_THEME = "auto";
var DEFAULT_LIGHT_SHIKI_THEME = "github-light";
var DEFAULT_DARK_SHIKI_THEME = "dark-plus";
var parseShikiThemePreference = (preference) => {
  const trimmed = preference.trim();
  if (!trimmed || trimmed === AUTO_SHIKI_THEME) {
    return {
      lightTheme: DEFAULT_LIGHT_SHIKI_THEME,
      darkTheme: DEFAULT_DARK_SHIKI_THEME,
      followsVariant: true
    };
  }
  const slash = trimmed.indexOf("/");
  if (slash > 0) {
    const lightTheme = trimmed.slice(0, slash).trim();
    const darkTheme = trimmed.slice(slash + 1).trim();
    if (lightTheme && darkTheme) {
      return { lightTheme, darkTheme, followsVariant: true };
    }
  }
  return { lightTheme: trimmed, darkTheme: trimmed, followsVariant: false };
};
var resolveShikiTheme = (preference, variant) => {
  const parsed = parseShikiThemePreference(preference);
  return variant === "light" ? parsed.lightTheme : parsed.darkTheme;
};
var TOOLS = ["bash", "read", "write", "edit", "grep", "find", "ls"];
var booleanEnv = (name, fallback) => {
  const value = process.env[name]?.toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "on") return true;
  if (value === "0" || value === "false" || value === "no" || value === "off") return false;
  return fallback;
};
var positiveEnv = (name, fallback) => {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};
var optionEnv = (name, options, fallback) => {
  const value = process.env[name];
  return value && options.includes(value) ? value : fallback;
};
var defaultCodePreviewSettings = () => ({
  shikiTheme: process.env.CODE_PREVIEW_THEME || AUTO_SHIKI_THEME,
  diffIntensity: optionEnv("CODE_PREVIEW_DIFF_INTENSITY", ["off", "subtle", "medium"], "subtle"),
  wordEmphasis: optionEnv("CODE_PREVIEW_WORD_EMPHASIS", ["all", "smart", "off"], "all"),
  toolCallBackground: optionEnv("CODE_PREVIEW_TOOL_CALL_BACKGROUND", ["on", "border", "off"], "on"),
  toolCallTiming: booleanEnv("CODE_PREVIEW_TOOL_CALL_TIMING", true),
  readCollapsedLines: positiveEnv("CODE_PREVIEW_READ_LINES", 10),
  readContentPreview: booleanEnv("CODE_PREVIEW_READ_CONTENT", true),
  writeContentPreview: booleanEnv("CODE_PREVIEW_WRITE_CONTENT", true),
  writeCollapsedLines: positiveEnv("CODE_PREVIEW_WRITE_LINES", 10),
  editDiffPreview: booleanEnv("CODE_PREVIEW_EDIT_DIFF", true),
  editCollapsedLines: process.env.CODE_PREVIEW_EDIT_LINES === "all" ? "all" : positiveEnv("CODE_PREVIEW_EDIT_LINES", 160),
  grepCollapsedLines: positiveEnv("CODE_PREVIEW_GREP_LINES", 15),
  grepResultPreview: booleanEnv("CODE_PREVIEW_GREP_RESULTS", true),
  findResultPreview: booleanEnv("CODE_PREVIEW_FIND_RESULTS", true),
  lsResultPreview: booleanEnv("CODE_PREVIEW_LS_RESULTS", true),
  pathListCollapsedLines: positiveEnv("CODE_PREVIEW_PATH_LIST_LINES", 20),
  readLineNumbers: booleanEnv("CODE_PREVIEW_READ_LINE_NUMBERS", true),
  bashResultPreview: booleanEnv("CODE_PREVIEW_BASH_RESULTS", true),
  bashWarnings: booleanEnv("CODE_PREVIEW_BASH_WARNINGS", true),
  syntaxHighlighting: booleanEnv("CODE_PREVIEW_SYNTAX", true),
  secretWarnings: booleanEnv("CODE_PREVIEW_SECRET_WARNINGS", true),
  pathIcons: optionEnv("CODE_PREVIEW_PATH_ICONS", ["unicode", "nerd", "off"], "unicode"),
  tools: [...TOOLS]
});
var normalizeCodePreviewSettings = (raw) => {
  const settings = defaultCodePreviewSettings();
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return settings;
  const source = raw;
  for (const [key, fallback] of Object.entries(settings)) {
    const value = source[key];
    if (typeof fallback === "boolean" && typeof value === "boolean") {
      settings[key] = value;
    } else if (typeof fallback === "number" && typeof value === "number" && Number.isFinite(value) && value > 0) {
      settings[key] = Math.floor(value);
    } else if (key === "editCollapsedLines" && value === "all") settings.editCollapsedLines = "all";
    else if (key === "tools" && Array.isArray(value)) settings.tools = value.filter((tool) => typeof tool === "string" && TOOLS.includes(tool));
    else if (key === "diffIntensity" && ["off", "subtle", "medium"].includes(String(value))) {
      settings.diffIntensity = value;
    } else if (key === "wordEmphasis" && ["all", "smart", "off"].includes(String(value))) {
      settings.wordEmphasis = value;
    } else if (key === "toolCallBackground" && ["on", "border", "off"].includes(String(value))) {
      settings.toolCallBackground = value;
    } else if (key === "pathIcons" && ["unicode", "nerd", "off"].includes(String(value))) {
      settings.pathIcons = value;
    } else if (key === "shikiTheme" && typeof value === "string" && value) {
      settings.shikiTheme = value;
    }
  }
  return { ...settings, tools: [...new Set(settings.tools)] };
};

// src/thinking.ts
var DEFAULT_FABRIC_THINKING = "medium";
var THINKING_LEVELS = [
  "off",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max"
];
var isFabricThinking = (value) => typeof value === "string" && THINKING_LEVELS.includes(value);
var LABELS = {
  off: "Off",
  minimal: "Minimal",
  low: "Low",
  medium: "Medium",
  high: "High",
  xhigh: "XHigh",
  max: "Max"
};
var thinkingLabel = (level) => LABELS[level];

export {
  resolveShikiTheme,
  defaultCodePreviewSettings,
  normalizeCodePreviewSettings,
  DEFAULT_FABRIC_THINKING,
  THINKING_LEVELS,
  isFabricThinking,
  thinkingLabel
};
//# sourceMappingURL=chunk-XCYTQGH2.js.map
