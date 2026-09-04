import {
  countContentLines,
  headlineArg,
  isFabricAgentToolPreview,
  selectPreviewTextLines,
  shouldSkipWriteDiffBytes,
  shouldSkipWriteDiffComplexity
} from "./chunk-MJNWCLRJ.js";
import {
  resolveShikiTheme
} from "./chunk-XCYTQGH2.js";
import {
  fabricStringLiterals
} from "./chunk-4IZKKHJM.js";

// src/util.ts
var countNewlines = (value) => {
  let count = 0;
  for (let index = 0; index < value.length; index++) {
    if (value.charCodeAt(index) === 10) count++;
  }
  return count;
};
var truncateMiddle = (value, maxChars) => {
  if (value.length <= maxChars) return value;
  const marker = `

... ${value.length - maxChars} characters omitted by Pi Fabric ...

`;
  const available = Math.max(0, maxChars - marker.length);
  const head = Math.ceil(available / 2);
  const tail = Math.floor(available / 2);
  return `${value.slice(0, head)}${marker}${value.slice(value.length - tail)}`;
};

// src/ui/highlight.ts
import { readFileSync, statSync } from "node:fs";
import { basename, extname } from "node:path";
import { bundledLanguages } from "shiki/langs";
import { bundledThemesInfo } from "shiki/themes";

// src/ui/shiki-theme.ts
var THEME_IMPORTS = {
  "andromeeda": () => import("@shikijs/themes/andromeeda"),
  "aurora-x": () => import("@shikijs/themes/aurora-x"),
  "ayu-dark": () => import("@shikijs/themes/ayu-dark"),
  "ayu-light": () => import("@shikijs/themes/ayu-light"),
  "ayu-mirage": () => import("@shikijs/themes/ayu-mirage"),
  "catppuccin-frappe": () => import("@shikijs/themes/catppuccin-frappe"),
  "catppuccin-latte": () => import("@shikijs/themes/catppuccin-latte"),
  "catppuccin-macchiato": () => import("@shikijs/themes/catppuccin-macchiato"),
  "catppuccin-mocha": () => import("@shikijs/themes/catppuccin-mocha"),
  "dark-plus": () => import("@shikijs/themes/dark-plus"),
  "dracula": () => import("@shikijs/themes/dracula"),
  "dracula-soft": () => import("@shikijs/themes/dracula-soft"),
  "everforest-dark": () => import("@shikijs/themes/everforest-dark"),
  "everforest-light": () => import("@shikijs/themes/everforest-light"),
  "github-dark": () => import("@shikijs/themes/github-dark"),
  "github-dark-default": () => import("@shikijs/themes/github-dark-default"),
  "github-dark-dimmed": () => import("@shikijs/themes/github-dark-dimmed"),
  "github-dark-high-contrast": () => import("@shikijs/themes/github-dark-high-contrast"),
  "github-light": () => import("@shikijs/themes/github-light"),
  "github-light-default": () => import("@shikijs/themes/github-light-default"),
  "github-light-high-contrast": () => import("@shikijs/themes/github-light-high-contrast"),
  "gruvbox-dark-hard": () => import("@shikijs/themes/gruvbox-dark-hard"),
  "gruvbox-dark-medium": () => import("@shikijs/themes/gruvbox-dark-medium"),
  "gruvbox-dark-soft": () => import("@shikijs/themes/gruvbox-dark-soft"),
  "gruvbox-light-hard": () => import("@shikijs/themes/gruvbox-light-hard"),
  "gruvbox-light-medium": () => import("@shikijs/themes/gruvbox-light-medium"),
  "gruvbox-light-soft": () => import("@shikijs/themes/gruvbox-light-soft"),
  "horizon": () => import("@shikijs/themes/horizon"),
  "horizon-bright": () => import("@shikijs/themes/horizon-bright"),
  "houston": () => import("@shikijs/themes/houston"),
  "kanagawa-dragon": () => import("@shikijs/themes/kanagawa-dragon"),
  "kanagawa-lotus": () => import("@shikijs/themes/kanagawa-lotus"),
  "kanagawa-wave": () => import("@shikijs/themes/kanagawa-wave"),
  "laserwave": () => import("@shikijs/themes/laserwave"),
  "light-plus": () => import("@shikijs/themes/light-plus"),
  "material-theme": () => import("@shikijs/themes/material-theme"),
  "material-theme-darker": () => import("@shikijs/themes/material-theme-darker"),
  "material-theme-lighter": () => import("@shikijs/themes/material-theme-lighter"),
  "material-theme-ocean": () => import("@shikijs/themes/material-theme-ocean"),
  "material-theme-palenight": () => import("@shikijs/themes/material-theme-palenight"),
  "min-dark": () => import("@shikijs/themes/min-dark"),
  "min-light": () => import("@shikijs/themes/min-light"),
  "monokai": () => import("@shikijs/themes/monokai"),
  "night-owl": () => import("@shikijs/themes/night-owl"),
  "night-owl-light": () => import("@shikijs/themes/night-owl-light"),
  "nord": () => import("@shikijs/themes/nord"),
  "one-dark-pro": () => import("@shikijs/themes/one-dark-pro"),
  "one-light": () => import("@shikijs/themes/one-light"),
  "plastic": () => import("@shikijs/themes/plastic"),
  "poimandres": () => import("@shikijs/themes/poimandres"),
  "red": () => import("@shikijs/themes/red"),
  "rose-pine": () => import("@shikijs/themes/rose-pine"),
  "rose-pine-dawn": () => import("@shikijs/themes/rose-pine-dawn"),
  "rose-pine-moon": () => import("@shikijs/themes/rose-pine-moon"),
  "slack-dark": () => import("@shikijs/themes/slack-dark"),
  "slack-ochin": () => import("@shikijs/themes/slack-ochin"),
  "snazzy-light": () => import("@shikijs/themes/snazzy-light"),
  "solarized-dark": () => import("@shikijs/themes/solarized-dark"),
  "solarized-light": () => import("@shikijs/themes/solarized-light"),
  "synthwave-84": () => import("@shikijs/themes/synthwave-84"),
  "tokyo-night": () => import("@shikijs/themes/tokyo-night"),
  "vesper": () => import("@shikijs/themes/vesper"),
  "vitesse-black": () => import("@shikijs/themes/vitesse-black"),
  "vitesse-dark": () => import("@shikijs/themes/vitesse-dark"),
  "vitesse-light": () => import("@shikijs/themes/vitesse-light")
};
async function resolveShikiThemeObject(themeId) {
  const loader = THEME_IMPORTS[themeId];
  if (!loader) return void 0;
  const mod = await loader();
  return mod.default;
}

// src/ui/highlight.ts
var configuredMaxHighlightChars = Number.parseInt(
  process.env.CODE_PREVIEW_MAX_HIGHLIGHT_CHARS ?? "",
  10
);
var MAX_HIGHLIGHT_CHARS = Number.isFinite(configuredMaxHighlightChars) && configuredMaxHighlightChars > 0 ? configuredMaxHighlightChars : 8e4;
var configuredFileHighlightMaxSourceChars = Number.parseInt(
  process.env.CODE_PREVIEW_FILE_HIGHLIGHT_MAX_CHARS ?? "",
  10
);
var FILE_HIGHLIGHT_MAX_SOURCE_CHARS = Number.isFinite(configuredFileHighlightMaxSourceChars) && configuredFileHighlightMaxSourceChars > 0 ? configuredFileHighlightMaxSourceChars : 2e5;
var FILE_HIGHLIGHT_TICK_LINE_BUDGET = 96;
var FILE_HIGHLIGHT_TICK_CHAR_BUDGET = 16e3;
var FILE_HIGHLIGHT_ENTRY_LIMIT = 24;
var FILE_HIGHLIGHT_CHAR_LIMIT = 4e6;
var CACHE_LIMIT = 192;
var CACHE_CHAR_LIMIT = 4e6;
var PRELOADED_LANGUAGES = [
  "bash",
  "typescript",
  "tsx",
  "javascript",
  "jsx",
  "json",
  "markdown",
  "yaml",
  "toml",
  "css"
];
var LANGUAGE_ALIASES = /* @__PURE__ */ new Map([
  ["sh", "bash"],
  ["shell", "bash"],
  ["zsh", "bash"],
  ["ts", "typescript"],
  ["js", "javascript"],
  ["md", "markdown"],
  ["yml", "yaml"],
  ["py", "python"],
  ["rs", "rust"],
  ["rb", "ruby"],
  ["cs", "csharp"],
  ["fs", "fsharp"],
  ["ps1", "powershell"]
]);
var EXACT_BASENAMES = /* @__PURE__ */ new Map([
  ["dockerfile", "dockerfile"],
  ["makefile", "makefile"],
  ["gnumakefile", "makefile"],
  ["justfile", "makefile"],
  ["procfile", "shellscript"],
  ["gemfile", "ruby"],
  ["rakefile", "ruby"],
  ["cargo.lock", "toml"],
  ["package-lock.json", "json"],
  ["composer.lock", "json"],
  ["pnpm-lock.yaml", "yaml"],
  ["pnpm-lock.yml", "yaml"],
  ["yarn.lock", "yaml"]
]);
var EXTENSION_ALIASES = /* @__PURE__ */ new Map([
  [".ts", "typescript"],
  [".tsx", "tsx"],
  [".js", "javascript"],
  [".jsx", "jsx"],
  [".mjs", "javascript"],
  [".cjs", "javascript"],
  [".json", "json"],
  [".md", "markdown"],
  [".markdown", "markdown"],
  [".yml", "yaml"],
  [".yaml", "yaml"],
  [".toml", "toml"],
  [".sh", "bash"],
  [".bash", "bash"],
  [".zsh", "bash"],
  [".css", "css"],
  [".html", "html"],
  [".htm", "html"],
  [".py", "python"],
  [".rs", "rust"],
  [".go", "go"],
  [".rb", "ruby"],
  [".php", "php"],
  [".sql", "sql"],
  [".xml", "xml"],
  [".svg", "xml"],
  [".vue", "vue"],
  [".svelte", "svelte"],
  [".c", "c"],
  [".h", "c"],
  [".cpp", "cpp"],
  [".cc", "cpp"],
  [".hpp", "cpp"],
  [".java", "java"],
  [".kt", "kotlin"],
  [".swift", "swift"],
  [".lua", "lua"],
  [".r", "r"],
  [".scala", "scala"],
  [".clj", "clojure"],
  [".ex", "elixir"],
  [".exs", "elixir"],
  [".erl", "erlang"],
  [".hs", "haskell"],
  [".ml", "ocaml"],
  [".fs", "fsharp"],
  [".fsx", "fsharp"],
  [".cs", "csharp"],
  [".ps1", "powershell"],
  [".graphql", "graphql"],
  [".prisma", "prisma"],
  [".dockerfile", "dockerfile"]
]);
var THEME_TYPE = new Map(bundledThemesInfo.map((theme) => [theme.id, theme.type]));
var LOW_CONTRAST_FALLBACK = "\x1B[38;2;139;148;158m";
var highlighter;
var readyTheme;
var initializingTheme;
var initVersion = 0;
var highlighterGeneration = 0;
var themePreference = "auto";
var observedVariant = "dark";
var currentTheme = resolveShikiTheme(themePreference, observedVariant);
var enabled = true;
var loadedLanguages = /* @__PURE__ */ new Set();
var pendingLanguages = /* @__PURE__ */ new Set();
var languageLoadCallbacks = /* @__PURE__ */ new Map();
var highlighterReadyCallbacks = /* @__PURE__ */ new Set();
var renderCache = /* @__PURE__ */ new Map();
var renderCacheChars = 0;
var hashString = (value) => {
  let hash = 5381;
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) + hash + value.charCodeAt(index) | 0;
  }
  return hash;
};
var escapeControlChars = (text) => text.replace(/\x1b/g, "\u241B").replace(/\r/g, "\u240D").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, "\uFFFD");
var normalizeLanguage = (language) => {
  const normalized = language.toLowerCase();
  return LANGUAGE_ALIASES.get(normalized) ?? normalized;
};
var ANSI_16_RGB = [
  { r: 0, g: 0, b: 0 },
  { r: 205, g: 49, b: 49 },
  { r: 13, g: 161, b: 13 },
  { r: 229, g: 165, b: 10 },
  { r: 36, g: 114, b: 200 },
  { r: 188, g: 63, b: 188 },
  { r: 17, g: 168, b: 205 },
  { r: 229, g: 229, b: 229 },
  { r: 102, g: 102, b: 102 },
  { r: 241, g: 76, b: 76 },
  { r: 35, g: 209, b: 139 },
  { r: 245, g: 245, b: 67 },
  { r: 59, g: 142, b: 234 },
  { r: 214, g: 112, b: 214 },
  { r: 41, g: 184, b: 219 },
  { r: 255, g: 255, b: 255 }
];
var ansi256ToRgb = (index) => {
  if (index < 16) return ANSI_16_RGB[Math.max(0, index)] ?? { r: 0, g: 0, b: 0 };
  if (index < 232) {
    const cube = index - 16;
    const channel = (value) => value === 0 ? 0 : 55 + 40 * value;
    return {
      r: channel(Math.floor(cube / 36)),
      g: channel(Math.floor(cube % 36 / 6)),
      b: channel(cube % 6)
    };
  }
  const gray = 8 + 10 * (Math.min(index, 255) - 232);
  return { r: gray, g: gray, b: gray };
};
var parseAnsiBgColor = (sequence) => {
  const truecolor = sequence.match(/\x1b\[4?8;2;(\d+);(\d+);(\d+)m/);
  if (truecolor) {
    return { r: Number(truecolor[1]), g: Number(truecolor[2]), b: Number(truecolor[3]) };
  }
  const indexed = sequence.match(/\x1b\[4?8;5;(\d+)m/);
  if (indexed) return ansi256ToRgb(Number(indexed[1]));
  return void 0;
};
var relativeLuminance = ({ r, g, b }) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
var classifyPiTheme = (theme, env = process.env) => {
  const name = theme?.name?.trim().toLowerCase();
  if (name === "light") return "light";
  if (name === "dark") return "dark";
  const background = theme?.getBgAnsi ? parseAnsiBgColor(theme.getBgAnsi("userMessageBg")) : void 0;
  if (background) return relativeLuminance(background) >= 0.5 ? "light" : "dark";
  const colorFgBg = env.COLORFGBG;
  if (colorFgBg) {
    const index = colorFgBg.split(";").map((part) => Number.parseInt(part, 10)).filter((part) => Number.isInteger(part) && part >= 0 && part <= 255).at(-1);
    if (index !== void 0) {
      return relativeLuminance(ansi256ToRgb(index)) >= 0.5 ? "light" : "dark";
    }
  }
  return void 0;
};
var syncEffectiveTheme = (preference, variant) => {
  themePreference = preference;
  observedVariant = variant;
  const effective = resolveShikiTheme(preference, variant);
  if (effective === currentTheme) return false;
  currentTheme = effective;
  renderCache.clear();
  renderCacheChars = 0;
  resetFileHighlighting();
  if (enabled && (highlighter || initializingTheme)) {
    void initHighlighting(effective, true);
  }
  return true;
};
function observePiTheme(theme) {
  const variant = classifyPiTheme(theme);
  if (variant) syncEffectiveTheme(themePreference, variant);
}
var effectiveShikiThemeIsLight = () => THEME_TYPE.get(currentTheme) === "light";
var observedThemeVariant = () => observedVariant;
function languageFromPath(filePath) {
  if (!filePath) return void 0;
  const name = basename(filePath).toLowerCase();
  if (name.startsWith(".env")) {
    const candidate = "dotenv";
    return candidate in bundledLanguages ? candidate : void 0;
  }
  if (name === "dockerfile" || name.startsWith("dockerfile.")) {
    return "dockerfile" in bundledLanguages ? "dockerfile" : void 0;
  }
  const exact = EXACT_BASENAMES.get(name);
  if (exact && exact in bundledLanguages) return exact;
  const byExt = EXTENSION_ALIASES.get(extname(name));
  return byExt && byExt in bundledLanguages ? byExt : void 0;
}
function configureHighlighting(themePreferenceValue, syntaxEnabled = true) {
  const preference = themePreferenceValue.trim() || "auto";
  const wasEnabled = enabled;
  enabled = syntaxEnabled;
  if (!enabled) {
    themePreference = preference;
    currentTheme = resolveShikiTheme(preference, observedVariant);
    initVersion++;
    initializingTheme = void 0;
    highlighter?.dispose();
    highlighter = void 0;
    readyTheme = void 0;
    highlighterGeneration++;
    loadedLanguages.clear();
    pendingLanguages.clear();
    languageLoadCallbacks.clear();
    highlighterReadyCallbacks.clear();
    renderCache.clear();
    renderCacheChars = 0;
    resetFileHighlighting();
    return;
  }
  const themeChanged = syncEffectiveTheme(preference, observedVariant);
  if (!themeChanged && !wasEnabled && !highlighter && !initializingTheme) {
    void initHighlighting(currentTheme, syntaxEnabled);
  }
}
async function initHighlighting(theme, syntaxEnabled = true) {
  currentTheme = theme;
  enabled = syntaxEnabled;
  if (!enabled) return;
  const version = ++initVersion;
  initializingTheme = theme;
  try {
    const { createHighlighter } = await import("shiki");
    const themeObject = await resolveShikiThemeObject(theme);
    if (!themeObject) {
      throw new Error(`Unknown shiki theme: ${theme}`);
    }
    const next = await createHighlighter({
      themes: [themeObject],
      langs: [...PRELOADED_LANGUAGES]
    });
    if (version !== initVersion) {
      next.dispose();
      return;
    }
    highlighter?.dispose();
    highlighter = next;
    resetFileHighlighting();
    readyTheme = theme;
    initializingTheme = void 0;
    highlighterGeneration++;
    loadedLanguages.clear();
    for (const lang of PRELOADED_LANGUAGES) loadedLanguages.add(lang);
    notifyReady();
  } catch (error) {
    if (version !== initVersion) return;
    initializingTheme = void 0;
    console.warn("[pi-fabric] Shiki failed to initialize; previews will be plain text.", error);
    highlighter?.dispose();
    highlighter = void 0;
    readyTheme = void 0;
    highlighterGeneration++;
    loadedLanguages.clear();
    highlighterReadyCallbacks.clear();
  }
}
var shouldSkipHighlight = (text) => text.length > MAX_HIGHLIGHT_CHARS;
var ansiFg = (hex) => {
  const clean = hex.replace(/^#/, "").slice(0, 6);
  const n = Number.parseInt(clean, 16);
  return Number.isFinite(n) ? `\x1B[38;2;${n >> 16 & 255};${n >> 8 & 255};${n & 255}m` : "";
};
var ansiFromToken = (token) => {
  let open = token.color ? ansiFg(token.color) : "";
  let close = token.color ? "\x1B[39m" : "";
  const fontStyle = token.fontStyle ?? 0;
  if (fontStyle & 2) {
    open += "\x1B[1m";
    close = "\x1B[22m" + close;
  }
  if (fontStyle & 1) {
    open += "\x1B[3m";
    close = "\x1B[23m" + close;
  }
  if (fontStyle & 4) {
    open += "\x1B[4m";
    close = "\x1B[24m" + close;
  }
  return open + escapeControlChars(token.content) + close;
};
var isLowContrastFg = (params) => {
  if (params === "30" || params === "90" || params === "38;5;0" || params === "38;5;8") return true;
  if (!params.startsWith("38;2;")) return false;
  const parts = params.split(";").map(Number);
  const r = parts[2];
  const g = parts[3];
  const b = parts[4];
  if (r === void 0 || g === void 0 || b === void 0) return false;
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return false;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 72;
};
var normalizeContrast = (ansi) => {
  if (THEME_TYPE.get(currentTheme) === "light") return ansi;
  return ansi.replace(
    /\x1b\[([0-9;]*)m/g,
    (seq, params) => isLowContrastFg(params) ? LOW_CONTRAST_FALLBACK : seq
  );
};
var cacheRendered = (key, value) => {
  const size = value.reduce((total, line) => total + line.length, 0);
  renderCache.set(key, { value, size });
  renderCacheChars += size;
  while (renderCache.size > CACHE_LIMIT || renderCacheChars > CACHE_CHAR_LIMIT) {
    const first = renderCache.keys().next().value;
    if (first === void 0) break;
    const cached = renderCache.get(first);
    if (cached) renderCacheChars -= cached.size;
    renderCache.delete(first);
  }
};
var requestInit = (invalidate) => {
  if (invalidate) highlighterReadyCallbacks.add(invalidate);
  if (initializingTheme === currentTheme) return;
  void initHighlighting(currentTheme, enabled);
};
var notifyReady = () => {
  const callbacks = [...highlighterReadyCallbacks];
  highlighterReadyCallbacks.clear();
  for (const callback of callbacks) {
    try {
      callback();
    } catch {
    }
  }
};
var requestLanguageLoad = (lang, invalidate) => {
  if (invalidate) {
    const callbacks = languageLoadCallbacks.get(lang) ?? /* @__PURE__ */ new Set();
    callbacks.add(invalidate);
    languageLoadCallbacks.set(lang, callbacks);
  }
  if (pendingLanguages.has(lang)) return;
  const instance = highlighter;
  if (!instance) return;
  pendingLanguages.add(lang);
  const generation = highlighterGeneration;
  void instance.loadLanguage(lang).then(() => {
    if (generation !== highlighterGeneration) return;
    loadedLanguages.add(lang);
    const callbacks = languageLoadCallbacks.get(lang);
    languageLoadCallbacks.delete(lang);
    for (const callback of callbacks ?? []) {
      try {
        callback();
      } catch {
      }
    }
  }).catch(() => {
    if (generation === highlighterGeneration) languageLoadCallbacks.delete(lang);
  }).finally(() => {
    if (generation === highlighterGeneration) pendingLanguages.delete(lang);
  });
};
function highlightCode(text, lang, invalidate) {
  if (!enabled || !lang || shouldSkipHighlight(text)) return null;
  if (!highlighter || readyTheme !== currentTheme) {
    requestInit(invalidate);
    return null;
  }
  const shikiLang = normalizeLanguage(lang);
  if (!(shikiLang in bundledLanguages)) return null;
  const cacheKey = `${currentTheme}\0${shikiLang}\0${text.length}\0${hashString(text)}`;
  const cached = renderCache.get(cacheKey);
  if (cached) {
    renderCache.delete(cacheKey);
    renderCache.set(cacheKey, cached);
    return cached.value;
  }
  if (!loadedLanguages.has(shikiLang)) {
    requestLanguageLoad(shikiLang, invalidate);
    return null;
  }
  try {
    const tokens = highlighter.codeToTokensBase(text, {
      lang: shikiLang,
      theme: currentTheme
    });
    const rendered = tokens.map(
      (line) => normalizeContrast(line.map(ansiFromToken).join(""))
    );
    cacheRendered(cacheKey, rendered);
    return rendered;
  } catch {
    return null;
  }
}
var fileHighlightCache = /* @__PURE__ */ new Map();
var fileHighlightChars = 0;
var fileHighlightQueue = [];
var fileHighlightQueueScheduled = false;
var expandFileLineTabs = (text) => text.replace(/\t/g, "    ");
var dropFileHighlightEntry = (key, entry) => {
  if (fileHighlightCache.get(key) !== entry) return;
  entry.stale = true;
  entry.waiters = [];
  fileHighlightCache.delete(key);
  fileHighlightChars -= entry.chars;
};
var evictFileHighlightCache = () => {
  while (fileHighlightCache.size > FILE_HIGHLIGHT_ENTRY_LIMIT || fileHighlightChars > FILE_HIGHLIGHT_CHAR_LIMIT) {
    const oldestKey = fileHighlightCache.keys().next().value;
    if (oldestKey === void 0) break;
    const oldest = fileHighlightCache.get(oldestKey);
    if (oldest) dropFileHighlightEntry(oldestKey, oldest);
    else fileHighlightCache.delete(oldestKey);
  }
};
var resetFileHighlighting = () => {
  for (const [, entry] of fileHighlightCache) {
    entry.stale = true;
    entry.waiters = [];
  }
  fileHighlightCache.clear();
  fileHighlightQueue.length = 0;
  fileHighlightChars = 0;
};
var fireSatisfiedWaiters = (entry) => {
  const covered = entry.lines.length;
  const ready = /* @__PURE__ */ new Set();
  const remaining = [];
  for (const waiter of entry.waiters) {
    if (waiter.to <= covered) ready.add(waiter.invalidate);
    else remaining.push(waiter);
  }
  entry.waiters = remaining;
  if (ready.size === 0) return;
  queueMicrotask(() => {
    for (const invalidate of ready) {
      try {
        invalidate();
      } catch {
      }
    }
  });
};
var advanceFileHighlight = (entry) => {
  const instance = highlighter;
  if (!instance || readyTheme !== currentTheme || instance !== entry.highlighter) {
    entry.stale = true;
    return;
  }
  const start = entry.lines.length;
  const hardEnd = Math.min(entry.target, entry.sourceLines.length);
  let end = start;
  let chars = 0;
  const maxEnd = Math.min(start + FILE_HIGHLIGHT_TICK_LINE_BUDGET, hardEnd);
  while (end < maxEnd && chars <= FILE_HIGHLIGHT_TICK_CHAR_BUDGET) {
    chars += (entry.sourceLines[end]?.length ?? 0) + 1;
    end++;
  }
  if (end <= start) return;
  try {
    const tokens = instance.codeToTokensBase(entry.sourceLines.slice(start, end).join("\n"), {
      lang: entry.lang,
      theme: currentTheme,
      ...entry.state ? { grammarState: entry.state } : {}
    });
    const rendered = tokens.map(
      (line) => normalizeContrast(line.map(ansiFromToken).join(""))
    );
    entry.state = instance.getLastGrammarState(tokens);
    entry.lines.push(...rendered);
    const delta = rendered.reduce((total, line) => total + line.length, 0);
    entry.chars += delta;
    fileHighlightChars += delta;
  } catch {
    entry.stale = true;
  }
};
var pumpFileHighlightQueue = () => {
  fileHighlightQueueScheduled = false;
  let entry = fileHighlightQueue.shift();
  while (entry !== void 0 && (entry.stale || entry.highlighter !== highlighter || entry.lines.length >= Math.min(entry.target, entry.sourceLines.length))) {
    if (entry.waiters.length > 0) fireSatisfiedWaiters(entry);
    entry = fileHighlightQueue.shift();
  }
  if (!entry) return;
  advanceFileHighlight(entry);
  if (!entry.stale) {
    fireSatisfiedWaiters(entry);
    if (entry.waiters.length > 0) fileHighlightQueue.push(entry);
  }
  if (fileHighlightQueue.length > 0) {
    fileHighlightQueueScheduled = true;
    setImmediate(pumpFileHighlightQueue);
  }
};
var scheduleFileHighlight = (entry) => {
  if (!fileHighlightQueue.includes(entry)) fileHighlightQueue.push(entry);
  if (fileHighlightQueueScheduled) return;
  fileHighlightQueueScheduled = true;
  setImmediate(pumpFileHighlightQueue);
};
function highlightFileLines(filePath, lang, from, to, invalidate) {
  if (!enabled || !lang || !filePath || to <= from || from < 0) return null;
  if (!highlighter || readyTheme !== currentTheme) {
    requestInit(invalidate);
    return null;
  }
  const shikiLang = normalizeLanguage(lang);
  if (!(shikiLang in bundledLanguages)) return null;
  if (!loadedLanguages.has(shikiLang)) {
    requestLanguageLoad(shikiLang, invalidate);
    return null;
  }
  let stat;
  try {
    stat = statSync(filePath);
  } catch {
    return null;
  }
  if (!stat.isFile() || stat.size > FILE_HIGHLIGHT_MAX_SOURCE_CHARS) return null;
  const key = `${currentTheme}\0${shikiLang}\0${filePath}`;
  let entry = fileHighlightCache.get(key);
  if (entry && (entry.mtimeMs !== stat.mtimeMs || entry.size !== stat.size)) {
    dropFileHighlightEntry(key, entry);
    entry = void 0;
  }
  if (!entry) {
    let text;
    try {
      text = readFileSync(filePath, "utf8");
    } catch {
      return null;
    }
    if (text.includes("\0")) return null;
    const sourceLines = text.replace(/\r\n?/g, "\n").split("\n").map(expandFileLineTabs);
    entry = {
      highlighter,
      lang: shikiLang,
      mtimeMs: stat.mtimeMs,
      size: stat.size,
      sourceLines,
      lines: [],
      state: void 0,
      target: 0,
      waiters: [],
      stale: false,
      chars: sourceLines.reduce((total, line) => total + line.length, 0)
    };
    fileHighlightCache.set(key, entry);
    fileHighlightChars += entry.chars;
    evictFileHighlightCache();
    if (entry.stale) {
      entry.waiters = [];
      return null;
    }
  } else {
    fileHighlightCache.delete(key);
    fileHighlightCache.set(key, entry);
  }
  return fileHighlightRange(entry, from, to, invalidate);
}
function highlightSourceLines(cacheKey, sourceLines, lang, from, to, invalidate) {
  if (!enabled || !lang || !cacheKey || to <= from || from < 0) return null;
  if (!highlighter || readyTheme !== currentTheme) {
    requestInit(invalidate);
    return null;
  }
  const shikiLang = normalizeLanguage(lang);
  if (!(shikiLang in bundledLanguages)) return null;
  if (!loadedLanguages.has(shikiLang)) {
    requestLanguageLoad(shikiLang, invalidate);
    return null;
  }
  let entry = fileHighlightCache.get(cacheKey);
  if (!entry) {
    entry = {
      highlighter,
      lang: shikiLang,
      sourceLines,
      lines: [],
      state: void 0,
      target: 0,
      waiters: [],
      stale: false,
      chars: sourceLines.reduce((total, line) => total + line.length, 0)
    };
    fileHighlightCache.set(cacheKey, entry);
    fileHighlightChars += entry.chars;
    evictFileHighlightCache();
    if (entry.stale) {
      entry.waiters = [];
      return null;
    }
  } else {
    fileHighlightCache.delete(cacheKey);
    fileHighlightCache.set(cacheKey, entry);
  }
  return fileHighlightRange(entry, from, to, invalidate);
}
var fileHighlightRange = (entry, from, to, invalidate) => {
  const total = entry.sourceLines.length;
  if (from >= total) return null;
  const clampedTo = Math.max(Math.min(to, total), Math.min(from, total));
  entry.target = Math.max(entry.target, clampedTo);
  if (invalidate && entry.lines.length < clampedTo) {
    entry.waiters = entry.waiters.filter((waiter) => waiter.invalidate !== invalidate);
    entry.waiters.push({ to: clampedTo, invalidate });
    scheduleFileHighlight(entry);
  }
  if (entry.lines.length < clampedTo) return null;
  const out = [];
  for (let index = from; index < Math.min(to, total); index++) {
    out.push({ raw: entry.sourceLines[index] ?? "", ansi: entry.lines[index] ?? "" });
  }
  return out;
};

// src/ui/structured.ts
import { stringify } from "yaml";
var normalizeJsonValue = (value) => {
  try {
    const serialized = JSON.stringify(value);
    return serialized === void 0 ? void 0 : JSON.parse(serialized);
  } catch {
    return void 0;
  }
};
var formatJsonAsYaml = (value) => {
  const normalized = normalizeJsonValue(value);
  if (normalized === void 0) return void 0;
  return stringify(normalized, { indent: 2, lineWidth: 0 }).trimEnd();
};
var isPlainObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var hoistMultilineStrings = (value, path, sections, seen) => {
  if (typeof value === "string") {
    if (!value.includes("\n")) return value;
    sections.push({ path, text: value });
    return `<multi-line string, see section: ${path}>`;
  }
  if (Array.isArray(value)) {
    if (seen.has(value)) return "[circular reference]";
    seen.add(value);
    const skeleton = value.map(
      (item, index) => hoistMultilineStrings(item, `${path}[${index}]`, sections, seen)
    );
    seen.delete(value);
    return skeleton;
  }
  if (isPlainObject(value)) {
    if (seen.has(value)) return "[circular reference]";
    seen.add(value);
    const skeleton = {};
    for (const [key, item] of Object.entries(value)) {
      skeleton[key] = hoistMultilineStrings(
        item,
        path ? `${path}.${key}` : key,
        sections,
        seen
      );
    }
    seen.delete(value);
    return skeleton;
  }
  return value;
};
var boundedSection = (value, maxChars) => {
  if (value.length <= maxChars) return value;
  if (maxChars <= 0) return "";
  let omitted = value.length - maxChars;
  let marker = `\u2026[${omitted} chars omitted]\u2026`;
  for (let pass = 0; pass < 2; pass++) {
    omitted = value.length - Math.max(0, maxChars - marker.length);
    marker = `\u2026[${omitted} chars omitted]\u2026`;
  }
  if (marker.length >= maxChars) return marker.slice(0, maxChars);
  const available = maxChars - marker.length;
  const head = Math.ceil(available / 2);
  const tail = Math.floor(available / 2);
  return `${value.slice(0, head)}${marker}${value.slice(value.length - tail)}`;
};
var fairSectionBudgets = (lengths, budget) => {
  const budgets = Array.from({ length: lengths.length }, () => 0);
  const pending = lengths.map((length, index) => ({ length, index })).sort((left, right) => left.length - right.length);
  let remaining = Math.max(0, budget);
  for (let position = 0; position < pending.length; position++) {
    const item = pending[position];
    const share = Math.floor(remaining / (pending.length - position));
    const allocated = Math.min(item.length, share);
    budgets[item.index] = allocated;
    remaining -= allocated;
  }
  return budgets;
};
var renderHoistedSections = (yaml, sections, maxChars) => {
  const headers = sections.map((section) => `--- ${section.path} (${section.text.length} chars) ---
`);
  const separators = sections.length * 2;
  const fixedChars = yaml.length + separators + headers.reduce((sum, header) => sum + header.length, 0);
  const fullChars = fixedChars + sections.reduce((sum, section) => sum + section.text.length, 0);
  const budgets = maxChars !== void 0 && fullChars > maxChars ? fairSectionBudgets(sections.map((section) => section.text.length), maxChars - fixedChars) : sections.map((section) => section.text.length);
  const raw = sections.map((section, index) => `${headers[index]}${boundedSection(section.text, budgets[index])}`).join("\n\n");
  return `${yaml}

${raw}`;
};
var formatFabricValue = (value, format, maxChars) => {
  if (value === void 0) return { text: "" };
  if (format === "text" && typeof value === "object" && value !== null && "text" in value) {
    const text = value.text;
    if (typeof text === "string") return { text };
  }
  if (typeof value === "string") return { text: value };
  if (format === "auto" || format === "yaml") {
    const sections = [];
    const skeleton = hoistMultilineStrings(value, "", sections, /* @__PURE__ */ new Set());
    const yaml = formatJsonAsYaml(skeleton);
    if (yaml !== void 0) {
      if (sections.length === 0) return { text: yaml, language: "yaml" };
      return {
        text: renderHoistedSections(yaml, sections, maxChars),
        language: "yaml",
        highlightedLineCount: countNewlines(yaml) + 1
      };
    }
  }
  try {
    return {
      text: JSON.stringify(value, null, format === "json" ? 2 : 0),
      ...format === "json" ? { language: "json" } : {}
    };
  } catch {
    return { text: String(value) };
  }
};

// src/ui/format.ts
import { truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
var safeText = (value) => String(value ?? "").replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "").replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, " ").replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();
var formatActorDataPreview = (data, maxChars = 200) => {
  if (data === void 0) return void 0;
  const clip = (value) => {
    const safe = safeText(value);
    return safe.length > maxChars ? `${safe.slice(0, Math.max(1, maxChars - 1))}\u2026` : safe;
  };
  if (typeof data === "string") return clip(data);
  if (typeof data === "object" && data !== null && !Array.isArray(data) && data.fabricTruncated === true) {
    const wrapper = data;
    const preview = clip(String(wrapper.preview ?? ""));
    const suffix = typeof wrapper.originalBytes === "number" ? `[truncated from ${wrapper.originalBytes} bytes]` : "[truncated]";
    return preview ? `${preview} ${suffix}` : suffix;
  }
  let serialized;
  try {
    serialized = JSON.stringify(data) ?? String(data);
  } catch {
    serialized = String(data);
  }
  return clip(serialized);
};
var formatDuration = (milliseconds) => {
  const seconds = Math.max(0, Math.floor(milliseconds / 1e3));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m${String(seconds % 60).padStart(2, "0")}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h${String(minutes % 60).padStart(2, "0")}m`;
};
var formatTokens = (tokens) => {
  if (tokens < 1e3) return String(Math.max(0, Math.round(tokens)));
  if (tokens < 1e5) return `${(tokens / 1e3).toFixed(tokens < 1e4 ? 1 : 0)}k`;
  return `${(tokens / 1e3).toFixed(0)}k`;
};
var formatCost = (usd) => usd <= 0 ? "$0" : usd < 0.01 ? `$${usd.toFixed(4)}` : usd < 1 ? `$${usd.toFixed(3)}` : `$${usd.toFixed(2)}`;
var formatClock = (timestamp) => new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
var padToWidth = (value, width) => {
  const clipped = truncateToWidth(value, Math.max(0, width), "");
  return clipped + " ".repeat(Math.max(0, width - visibleWidth(clipped)));
};
var wrapPlainText = (value, width, maxLines = 100) => {
  const safe = safeText(value);
  if (!safe || width <= 0 || maxLines <= 0) return [];
  const words = safe.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (visibleWidth(candidate) <= width) {
      current = candidate;
      continue;
    }
    if (current) lines.push(truncateToWidth(current, width));
    current = word;
    while (visibleWidth(current) > width && lines.length < maxLines) {
      let chunk = "";
      let consumed = 0;
      const segments = [
        ...new Intl.Segmenter(void 0, { granularity: "grapheme" }).segment(current)
      ];
      for (const { segment } of segments) {
        const candidate2 = chunk + segment;
        if (visibleWidth(candidate2) > width) {
          if (!chunk) {
            chunk = "\u2026";
            consumed += segment.length;
          }
          break;
        }
        chunk = candidate2;
        consumed += segment.length;
      }
      if (chunk) lines.push(chunk);
      current = current.slice(consumed);
    }
    if (lines.length >= maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(truncateToWidth(current, width));
  return lines;
};

// src/ui/types.ts
var activeStatuses = /* @__PURE__ */ new Set([
  "queued",
  "pending",
  "ready",
  "claimed",
  "running",
  "in_progress",
  "blocked",
  "loading",
  "active",
  "unloading"
]);
var isActiveStatus = (status) => activeStatuses.has(status);
var orderAgentsByCreation = (agents) => agents.map((agent, index) => ({ agent, index })).sort(
  (left, right) => (left.agent.startedAt ?? Number.MAX_SAFE_INTEGER) - (right.agent.startedAt ?? Number.MAX_SAFE_INTEGER) || left.index - right.index
).map(({ agent }) => agent);

// src/ui/arc-group.ts
var ANSI_ESCAPE = /\x1b\[[0-9;]*m/g;
var ARC_CLOSING = "\u2570\u2500 ";
var ARC_CONTINUATION = "\u251C\u2500 ";
var visibleText = (line) => line.replace(ANSI_ESCAPE, "");
var isArcLine = (line) => {
  const visible = visibleText(line);
  return visible.startsWith(ARC_CLOSING) || visible.startsWith(ARC_CONTINUATION);
};
var continueArc = (line) => visibleText(line).startsWith(ARC_CLOSING) ? line.replace(ARC_CLOSING, ARC_CONTINUATION) : line;
function continueArcGroup(lines) {
  let start = lines.length;
  while (start > 0 && isArcLine(lines[start - 1])) start--;
  if (start === lines.length) return lines;
  const next = [...lines];
  for (let index = start; index < next.length; index++) {
    next[index] = continueArc(next[index]);
  }
  return next;
}
function arcItem(theme, label) {
  return theme.fg("muted", `${ARC_CLOSING}${label}`);
}
function arcItemStyled(theme, label) {
  return theme.fg("muted", ARC_CLOSING) + label;
}
function pushArcItem(lines, item) {
  for (let index = lines.length - 1; index >= 0 && isArcLine(lines[index]); index--) {
    lines[index] = continueArc(lines[index]);
  }
  lines.push(item);
}

// src/ui/core-tool-render.ts
import { readFileSync as readFileSync2, statSync as statSync2 } from "node:fs";
import { homedir } from "node:os";
import { basename as basename2, extname as extname2, isAbsolute, relative, resolve } from "node:path";

// src/ui/tool-call-timing.ts
var formatToolCallDuration = (startedAt, endedAt) => {
  if (startedAt === void 0 || endedAt === void 0) return void 0;
  const durationMs = Math.max(0, endedAt - startedAt);
  return durationMs < 1e3 ? `${durationMs}ms` : `${(durationMs / 1e3).toFixed(1)}s`;
};

// src/ui/core-tool-render.ts
import { diffLines } from "diff";
import { bundledLanguages as bundledLanguages2 } from "shiki/langs";

// src/ui/diff-background.ts
import { truncateToWidth as truncateToWidth2, visibleWidth as visibleWidth2 } from "@earendil-works/pi-tui";
var DIFF_ADD_MARKER = "\0PI_DIFF_ADD\0";
var DIFF_REMOVE_MARKER = "\0PI_DIFF_REMOVE\0";
var markDiffLine = (kind, line) => (kind === "add" ? DIFF_ADD_MARKER : DIFF_REMOVE_MARKER) + line;
var parseMarkedDiffLine = (rawLine) => {
  const addIndex = rawLine.indexOf(DIFF_ADD_MARKER);
  if (addIndex >= 0) {
    return {
      kind: "add",
      line: rawLine.slice(0, addIndex) + rawLine.slice(addIndex + DIFF_ADD_MARKER.length)
    };
  }
  const removeIndex = rawLine.indexOf(DIFF_REMOVE_MARKER);
  if (removeIndex >= 0) {
    return {
      kind: "remove",
      line: rawLine.slice(0, removeIndex) + rawLine.slice(removeIndex + DIFF_REMOVE_MARKER.length)
    };
  }
  return { line: rawLine };
};
var createDiffBackgroundResolver = (theme, intensity) => {
  if (intensity === "off") return () => void 0;
  const cache = {};
  return (kind) => cache[kind] ??= deriveDiffBg(kind, theme, intensity === "medium" ? 0.24 : 0.14) ?? fallbackDiffBg(kind, intensity);
};
var applyDiffBackground = (line, background) => {
  if (!background) return line;
  const colored = line.replace(/\x1b\[0m/g, "\x1B[0m" + background).replace(/\x1b\[39m/g, "\x1B[39m" + background).replace(/\x1b\[49m/g, "\x1B[49m" + background);
  return background + colored;
};
var fallbackDiffBg = (kind, intensity) => {
  if (observedThemeVariant() === "light") {
    if (kind === "add") {
      return intensity === "medium" ? "\x1B[48;2;170;222;186m" : "\x1B[48;2;198;230;206m";
    }
    return intensity === "medium" ? "\x1B[48;2;236;178;184m" : "\x1B[48;2;242;206;210m";
  }
  if (kind === "add") {
    return intensity === "medium" ? "\x1B[48;2;22;68;40m" : "\x1B[48;2;10;42;26m";
  }
  return intensity === "medium" ? "\x1B[48;2;78;36;40m" : "\x1B[48;2;50;24;30m";
};
var deriveDiffBg = (kind, theme, intensity) => {
  const themed = theme;
  const fg = themed?.getFgAnsi?.(kind === "add" ? "toolDiffAdded" : "toolDiffRemoved");
  const fgRgb = parseAnsiRgb(fg ?? "");
  if (!fgRgb) return void 0;
  const base = parseAnsiRgb(themed?.getBgAnsi?.(kind === "add" ? "toolSuccessBg" : "toolErrorBg") ?? "") ?? parseAnsiRgb(themed?.getBgAnsi?.("toolSuccessBg") ?? "") ?? (observedThemeVariant() === "light" ? { r: 255, g: 255, b: 255 } : { r: 0, g: 0, b: 0 });
  return `\x1B[48;2;${Math.round(base.r + (fgRgb.r - base.r) * intensity)};${Math.round(base.g + (fgRgb.g - base.g) * intensity)};${Math.round(base.b + (fgRgb.b - base.b) * intensity)}m`;
};
var PRINTABLE_ASCII_RE = /^[\x20-\x7e]*$/;
var TRUNCATION_SAFE_RE = /^(?:[\x20-\x7e\t]|\x1b\[[0-9;]*m)*$/;
var segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
var wrapDiffAnsiToWidth = (text, width, maxRows = 3, continuationPrefix = "") => {
  if (width <= 0) return [""];
  const rows = [];
  let row = "";
  let rowWidth = 0;
  let index = 0;
  let state = "";
  const continuationWidth = visibleWidth2(continuationPrefix);
  const pushRow = () => {
    rows.push(truncateWrappedRow(row, rowWidth, width));
    if (rows.length >= maxRows) {
      truncateLastRow(rows, width);
      return false;
    }
    row = continuationPrefix ? state + continuationPrefix : state;
    rowWidth = continuationWidth;
    return true;
  };
  while (index < text.length) {
    const ansi = extractSgr(text, index);
    if (ansi) {
      row += ansi.sequence;
      state = updateAnsiState(state, ansi.sequence);
      index += ansi.sequence.length;
      continue;
    }
    const nextAnsi = text.indexOf("\x1B", index);
    const plainEnd = nextAnsi >= 0 ? nextAnsi : text.length;
    const plain = text.slice(index, plainEnd);
    const remainingWidth = width - rowWidth;
    if (plain.length <= remainingWidth && PRINTABLE_ASCII_RE.test(plain)) {
      row += plain;
      rowWidth += plain.length;
    } else {
      for (const { segment } of segmenter.segment(plain)) {
        const segmentWidth = visibleWidth2(segment);
        if (rowWidth > 0 && rowWidth + segmentWidth > width && !pushRow()) return rows;
        if (rowWidth > 0 && rowWidth + segmentWidth > width) {
          row = state;
          rowWidth = 0;
        }
        if (segmentWidth > width && rowWidth === 0) {
          const clipped = truncateToWidth2(segment, width, "");
          if (clipped) {
            row += clipped;
            rowWidth += visibleWidth2(clipped);
          }
          if (!pushRow()) return rows;
          continue;
        }
        row += segment;
        rowWidth += segmentWidth;
      }
    }
    index = plainEnd;
  }
  rows.push(truncateWrappedRow(row, rowWidth, width));
  if (rows.length > maxRows) return truncateLastRow(rows.slice(0, maxRows), width);
  return rows;
};
var truncateWrappedRow = (row, rowWidth, width) => {
  if (rowWidth <= width && TRUNCATION_SAFE_RE.test(row)) return row;
  return truncateToWidth2(row, width, "");
};
var truncateLastRow = (rows, width) => {
  const last = rows.at(-1) ?? "";
  if (visibleWidth2(last) >= width && width > 1) {
    rows[rows.length - 1] = truncateToWidth2(last, width - 1, "") + "\u203A";
  }
  return rows;
};
var extractSgr = (text, index) => {
  if (text[index] !== "\x1B" || text[index + 1] !== "[") return void 0;
  let end = index + 2;
  while (end < text.length && text[end] !== "m") end++;
  if (end >= text.length) return void 0;
  return { sequence: text.slice(index, end + 1) };
};
var updateAnsiState = (current, sequence) => {
  if (sequence === "\x1B[0m") return "";
  if (/^\x1b\[3(?:8;[^m]+|9)m$/.test(sequence)) {
    return replaceAnsi(current, /\x1b\[3(?:8;[^m]+|9)m/g, sequence === "\x1B[39m" ? "" : sequence);
  }
  if (/^\x1b\[4(?:8;[^m]+|9)m$/.test(sequence)) {
    return replaceAnsi(current, /\x1b\[4(?:8;[^m]+|9)m/g, sequence === "\x1B[49m" ? "" : sequence);
  }
  if (sequence === "\x1B[22m") return current.replace(/\x1b\[(?:1|2)m/g, "");
  if (sequence === "\x1B[1m") return replaceAnsi(current, /\x1b\[1m/g, sequence);
  if (sequence === "\x1B[2m") return replaceAnsi(current, /\x1b\[2m/g, sequence);
  if (sequence === "\x1B[3m" || sequence === "\x1B[23m") {
    return replaceAnsi(current, /\x1b\[(?:3|23)m/g, sequence === "\x1B[23m" ? "" : sequence);
  }
  if (sequence === "\x1B[4m" || sequence === "\x1B[24m") {
    return replaceAnsi(current, /\x1b\[(?:4|24)m/g, sequence === "\x1B[24m" ? "" : sequence);
  }
  return current + sequence;
};
var replaceAnsi = (current, pattern, replacement) => current.replace(pattern, "") + replacement;
var parseAnsiRgb = (ansi) => {
  const match = ansi.match(/\x1b\[(?:38|48);2;(\d+);(\d+);(\d+)m/);
  if (match) return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
  const indexed = ansi.match(/\x1b\[(?:38|48);5;(\d+)m/);
  if (indexed) return ansi256ToRgb(Number(indexed[1]));
  return void 0;
};

// src/ui/word-diff/normalize.ts
var expandPreviewTabs = (text) => text.replace(/\t/g, "    ");
var escapeControlChars2 = (text) => text.replace(/\x1b/g, "\u241B").replace(/\r/g, "\u240D").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, "\uFFFD");

// src/ui/word-diff/tokens.ts
var WORD_TOKEN_PATTERN = new RegExp("[$_\\p{L}][$_\\p{L}\\p{N}\\p{Mark}]*|\\p{N}+(?:\\.\\p{N}+)?|===|!==|=>|==|!=|<=|>=|&&|\\|\\||[^\\s]", "gu");
var IDENTIFIER_TOKEN_PATTERN = /^[$_\p{L}][$_\p{L}\p{N}\p{Mark}]*$/u;
var NUMBER_TOKEN_PATTERN = new RegExp("^\\p{N}+(?:\\.\\p{N}+)?$", "u");
var SYMBOL_TOKEN_PATTERN = new RegExp("^\\p{S}+$", "u");
var MEANINGFUL_OPERATOR_TOKEN_PATTERN = /^(?:===|!==|=>|==|!=|<=|>=|&&|\|\||[+\-*\/%<>=!?:~&|^]+)$/;
var DOMAIN_SEPARATOR_TOKEN_PATTERN = /^[-/:@#]$/;
var STRUCTURAL_PUNCTUATION_TOKEN_PATTERN = /^[{}()[\].,;]$/;
function wordEmphasisTokens(text) {
  const tokens = [];
  for (const match of text.matchAll(WORD_TOKEN_PATTERN)) {
    const value = match[0];
    const start = match.index;
    tokens.push({ value, start, end: start + value.length });
  }
  return tokens;
}
function wordTokenValues(text) {
  return Array.from(text.matchAll(WORD_TOKEN_PATTERN), (match) => match[0]);
}
function isIdentifierToken(value) {
  return IDENTIFIER_TOKEN_PATTERN.test(value);
}
function isNumberToken(value) {
  return NUMBER_TOKEN_PATTERN.test(value);
}
function isSymbolToken(value) {
  return SYMBOL_TOKEN_PATTERN.test(value);
}
function isMeaningfulOperatorToken(value) {
  return MEANINGFUL_OPERATOR_TOKEN_PATTERN.test(value);
}
function wordEmphasisTokenWeight(value) {
  if (isIdentifierToken(value)) return 2;
  if (isNumberToken(value)) return 1.5;
  if (DOMAIN_SEPARATOR_TOKEN_PATTERN.test(value)) return 0.25;
  if (isMeaningfulOperatorToken(value)) return 1;
  if (STRUCTURAL_PUNCTUATION_TOKEN_PATTERN.test(value)) return 0.05;
  return 1;
}
function splitIdentifierToken(value, start) {
  const parts = [];
  const partPattern = new RegExp("[$_]+|(?:\\p{Lu}\\p{Mark}*)+(?=(?:\\p{Lu}\\p{Mark}*)(?:\\p{Ll}\\p{Mark}*)|\\p{N}|$)|(?:\\p{Lu}\\p{Mark}*)?(?:\\p{Ll}\\p{Mark}*)+|\\p{N}+|(?:\\p{Lu}\\p{Mark}*)+|(?:\\p{L}\\p{Mark}*)+", "gu");
  for (const match of value.matchAll(partPattern)) {
    const part = match[0];
    const offset = match.index;
    parts.push({ value: part, start: start + offset, end: start + offset + part.length });
  }
  return parts.length > 0 ? parts : [{ value, start, end: start + value.length }];
}
function wordEmphasisSimilarityTokenValues(tokens) {
  const values = [];
  for (const token of tokens) {
    if (!isIdentifierToken(token.value)) {
      values.push(token.value);
      continue;
    }
    const parts = splitIdentifierToken(token.value, 0).map((part) => part.value).filter(isIdentifierSimilarityPart);
    if (parts.length === 0) values.push(token.value.toLowerCase());
    else values.push(...parts.map((part) => part.toLowerCase()));
  }
  return values;
}
function isIdentifierSimilarityPart(value) {
  return !/^[$_]+$/.test(value);
}

// src/ui/word-diff/changed-line.ts
function indexedChangedLine(index, line) {
  return { index, line };
}
function normalizedChangedContent(line) {
  return line.normalizedContent ??= normalizeDiffContent(line.line.content);
}
function changedLineTokens(line) {
  return line.tokens ??= wordEmphasisTokens(normalizedChangedContent(line));
}
function normalizeDiffContent(content) {
  return escapeControlChars2(expandPreviewTabs(content));
}

// src/ui/word-diff/alignment.ts
var ALIGNMENT_SCORE_EPSILON = 1e-9;
function sameAlignmentScore(a, b) {
  return Math.abs(a - b) < ALIGNMENT_SCORE_EPSILON;
}
function suffixAlignedPairs(beforeLength, afterLength, scoreAt) {
  const columns = afterLength + 1;
  const dp = new Float64Array((beforeLength + 1) * columns);
  for (let i2 = beforeLength - 1; i2 >= 0; i2--) {
    const rowOffset = i2 * columns;
    const nextRowOffset = rowOffset + columns;
    for (let j2 = afterLength - 1; j2 >= 0; j2--) {
      const pairScore = scoreAt(i2, j2);
      const align = Number.isFinite(pairScore) ? dp[nextRowOffset + j2 + 1] + pairScore : pairScore;
      dp[rowOffset + j2] = Math.max(align, dp[nextRowOffset + j2], dp[rowOffset + j2 + 1]);
    }
  }
  const pairs = [];
  let i = 0;
  let j = 0;
  while (i < beforeLength && j < afterLength) {
    const rowOffset = i * columns;
    const nextRowOffset = rowOffset + columns;
    const pairScore = scoreAt(i, j);
    const align = Number.isFinite(pairScore) ? dp[nextRowOffset + j + 1] + pairScore : pairScore;
    if (Number.isFinite(pairScore) && sameAlignmentScore(dp[rowOffset + j], align)) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (dp[nextRowOffset + j] >= dp[rowOffset + j + 1]) {
      i++;
    } else {
      j++;
    }
  }
  return pairs;
}
function prefixAlignedPairs(beforeLength, afterLength, scoreAt) {
  const columns = afterLength + 1;
  const dp = new Float64Array((beforeLength + 1) * columns);
  for (let i2 = 1; i2 <= beforeLength; i2++) {
    const rowOffset = i2 * columns;
    const previousRowOffset = rowOffset - columns;
    for (let j2 = 1; j2 <= afterLength; j2++) {
      const pairScore = scoreAt(i2 - 1, j2 - 1);
      const pair = Number.isFinite(pairScore) ? dp[previousRowOffset + j2 - 1] + pairScore : pairScore;
      dp[rowOffset + j2] = Math.max(dp[previousRowOffset + j2], dp[rowOffset + j2 - 1], pair);
    }
  }
  const pairs = [];
  let i = beforeLength;
  let j = afterLength;
  while (i > 0 && j > 0) {
    const rowOffset = i * columns;
    const previousRowOffset = rowOffset - columns;
    const pairScore = scoreAt(i - 1, j - 1);
    const pair = Number.isFinite(pairScore) ? dp[previousRowOffset + j - 1] + pairScore : pairScore;
    if (Number.isFinite(pairScore) && sameAlignmentScore(dp[rowOffset + j], pair)) {
      pairs.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[previousRowOffset + j] >= dp[rowOffset + j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  return pairs.reverse();
}
function suffixAlignmentScore(beforeLength, afterLength, scoreAt) {
  let next = new Float64Array(afterLength + 1);
  let current = new Float64Array(afterLength + 1);
  for (let i = beforeLength - 1; i >= 0; i--) {
    current[afterLength] = 0;
    for (let j = afterLength - 1; j >= 0; j--) {
      const pairScore = scoreAt(i, j);
      const match = Number.isFinite(pairScore) ? numericAt(next, j + 1) + pairScore : pairScore;
      current[j] = Math.max(match, numericAt(next, j), numericAt(current, j + 1));
    }
    [next, current] = [current, next];
  }
  return numericAt(next, 0);
}
function numericAt(values, index) {
  const value = values[index];
  if (value === void 0) throw new RangeError(`Missing alignment cell ${index}`);
  return value;
}

// src/ui/word-diff/line-similarity.ts
var SIMILARITY_BIGRAM_PREFIX = "\0PI_SIM_BIGRAM\0";
var MAX_LINE_TOKEN_SIMILARITY_CELLS = 16384;
function changedLineSimilarityTokenValues(line) {
  return line.similarityTokenValues ??= wordEmphasisSimilarityTokenValues(
    changedLineTokens(line)
  );
}
function changedLineSimilarityFeatureValues(line) {
  return line.similarityFeatureValues ??= similarityFeatures(
    changedLineSimilarityTokenValues(line)
  );
}
function changedLineSimilarityDocuments(removed, added) {
  const removedFeatures = removed.map(changedLineSimilarityFeatureValues);
  const addedFeatures = added.map(changedLineSimilarityFeatureValues);
  const documentCounts = /* @__PURE__ */ new Map();
  countSimilarityDocuments(removedFeatures, documentCounts);
  countSimilarityDocuments(addedFeatures, documentCounts);
  return { removedFeatures, addedFeatures, documentCounts };
}
function countSimilarityDocuments(featureLists, documentCounts) {
  for (const features of featureLists) {
    for (const feature of new Set(features))
      documentCounts.set(feature, (documentCounts.get(feature) ?? 0) + 1);
  }
}
function hasUniqueSharedSimilarityFeature(removed, added, documents) {
  const addedFeatures = new Set(changedLineSimilarityFeatureValues(added));
  for (const feature of new Set(changedLineSimilarityFeatureValues(removed))) {
    if (!addedFeatures.has(feature)) continue;
    if (documents.documentCounts.get(feature) === 2 && tokenWeight(feature) >= 1) return true;
  }
  return false;
}
function similarityFeatures(tokens) {
  const features = [...tokens];
  appendSimilarityShingles(
    features,
    tokens.filter(isSimilarityShingleToken),
    2,
    SIMILARITY_BIGRAM_PREFIX
  );
  return features;
}
function appendSimilarityShingles(features, tokens, size, prefix) {
  for (let index = 0; index + size <= tokens.length; index++)
    features.push(`${prefix}${tokens.slice(index, index + size).join("\0")}`);
}
function isSimilarityShingleToken(token) {
  return wordEmphasisTokenWeight(token) >= 1;
}
function similarityTokenWeight(documents) {
  const weights = /* @__PURE__ */ new Map();
  const lineCount = documents.removedFeatures.length + documents.addedFeatures.length;
  return (token) => {
    const cached = weights.get(token);
    if (cached !== void 0) return cached;
    const documentCount = documents.documentCounts.get(token) ?? lineCount;
    const rarity = Math.min(3, 1 + Math.log((lineCount + 1) / (documentCount + 1)));
    const weight = tokenWeight(token) * rarity;
    weights.set(token, weight);
    return weight;
  };
}
function fallbackLineSimilarity(removed, added, weight, removedWeight, addedWeight) {
  return unorderedTokenSimilarity(
    changedLineSimilarityFeatureValues(removed),
    changedLineSimilarityFeatureValues(added),
    weight,
    removedWeight,
    addedWeight
  );
}
function tokenSimilarity(beforeTokens, afterTokens, weight = tokenWeight, minimumRelevantSimilarity = 0, beforeWeight, afterWeight) {
  if (beforeTokens.length === 0 || afterTokens.length === 0)
    return beforeTokens.length === afterTokens.length ? 1 : 0;
  const bagSimilarity = unorderedTokenSimilarity(
    beforeTokens,
    afterTokens,
    weight,
    beforeWeight,
    afterWeight
  );
  if (bagSimilarity < minimumRelevantSimilarity) return bagSimilarity;
  const orderedSimilarity = orderedTokenSimilarity(
    beforeTokens,
    afterTokens,
    weight,
    beforeWeight ?? similarityTokenListWeight(beforeTokens, weight),
    afterWeight ?? similarityTokenListWeight(afterTokens, weight)
  );
  if (orderedSimilarity === void 0) return bagSimilarity;
  return Math.max(
    orderedSimilarity,
    bagSimilarity * 0.8,
    orderedSimilarity * 0.75 + bagSimilarity * 0.25
  );
}
function unorderedTokenSimilarity(beforeTokens, afterTokens, weight, beforeWeight = similarityTokenListWeight(beforeTokens, weight), afterWeight = similarityTokenListWeight(afterTokens, weight)) {
  const remaining = /* @__PURE__ */ new Map();
  for (const token of beforeTokens) remaining.set(token, (remaining.get(token) ?? 0) + 1);
  let sharedWeight = 0;
  for (const token of afterTokens) {
    const count = remaining.get(token) ?? 0;
    if (count === 0) continue;
    sharedWeight += weight(token);
    if (count === 1) remaining.delete(token);
    else remaining.set(token, count - 1);
  }
  return 2 * sharedWeight / (beforeWeight + afterWeight);
}
function orderedTokenSimilarity(beforeTokens, afterTokens, weight, beforeWeight, afterWeight) {
  if (beforeTokens.length * afterTokens.length > MAX_LINE_TOKEN_SIMILARITY_CELLS) return void 0;
  const score = suffixAlignmentScore(
    beforeTokens.length,
    afterTokens.length,
    (beforeIndex, afterIndex) => {
      const beforeToken = stringAt(beforeTokens, beforeIndex);
      return beforeToken === stringAt(afterTokens, afterIndex) ? weight(beforeToken) : Number.NEGATIVE_INFINITY;
    }
  );
  return 2 * score / (beforeWeight + afterWeight);
}
function similarityTokenListWeight(tokens, weight) {
  return tokens.reduce((total, token) => total + weight(token), 0);
}
function tokenWeight(token) {
  if (token.startsWith(SIMILARITY_BIGRAM_PREFIX)) return 1.15;
  return wordEmphasisTokenWeight(token);
}
function stringAt(values, index) {
  const value = values[index];
  if (value === void 0) throw new RangeError(`Missing similarity token ${index}`);
  return value;
}

// src/ui/word-diff/sparse-line-matching.ts
var MAX_POSITIONAL_FALLBACK_AMBIGUITY_CELLS = 1e4;
var MAX_SPARSE_FEATURE_DOCUMENTS = 6;
var MAX_SPARSE_FEATURE_DOCUMENTS_PER_SIDE = 3;
var MAX_SPARSE_CANDIDATES_PER_LINE = 8;
var MIN_SPARSE_RARE_FEATURE_COUNT = 2;
var MIN_SPARSE_EVIDENCE_MARGIN = 1;
var MIN_SPARSE_EVIDENCE_RATIO = 0.9;
function matchChangedLinesSparse(removed, added, policy) {
  const similarityDocuments = changedLineSimilarityDocuments(removed, added);
  const tokenWeight2 = similarityTokenWeight(similarityDocuments);
  const removedWeights = [];
  const addedWeights = [];
  const canCheckAmbiguity = removed.length * added.length <= MAX_POSITIONAL_FALLBACK_AMBIGUITY_CELLS;
  const scoreCache = canCheckAmbiguity ? /* @__PURE__ */ new Map() : void 0;
  const scoreAt = (removedPosition, addedPosition) => {
    const key = removedPosition * added.length + addedPosition;
    const cached = scoreCache?.get(key);
    if (cached !== void 0) return cached;
    const removedFeatures = similarityDocuments.removedFeatures[removedPosition];
    const addedFeatures = similarityDocuments.addedFeatures[addedPosition];
    if (removedFeatures === void 0 || addedFeatures === void 0)
      throw new RangeError(`Missing similarity features ${removedPosition}:${addedPosition}`);
    const removedWeight = removedWeights[removedPosition] ??= similarityTokenListWeight(
      removedFeatures,
      tokenWeight2
    );
    const addedWeight = addedWeights[addedPosition] ??= similarityTokenListWeight(
      addedFeatures,
      tokenWeight2
    );
    const score = fallbackLineSimilarity(
      changedLineAt(removed, removedPosition),
      changedLineAt(added, addedPosition),
      tokenWeight2,
      removedWeight,
      addedWeight
    );
    scoreCache?.set(key, score);
    return score;
  };
  const sparseCandidates = sparseChangedLinePairCandidates(similarityDocuments, tokenWeight2);
  const pairs = sparseChangedLineAnchors(removed, added, sparseCandidates, scoreAt, policy);
  const positions = changedLinePositions(removed, added);
  const usedRemoved = /* @__PURE__ */ new Set();
  const usedAdded = /* @__PURE__ */ new Set();
  for (const pair of pairs) {
    const removedPosition = positions.removed.get(pair.removedIndex);
    const addedPosition = positions.added.get(pair.addedIndex);
    if (removedPosition !== void 0) usedRemoved.add(removedPosition);
    if (addedPosition !== void 0) usedAdded.add(addedPosition);
  }
  for (let index = 0; index < Math.min(removed.length, added.length); index++) {
    if (usedRemoved.has(index) || usedAdded.has(index)) continue;
    const score = scoreAt(index, index);
    if (score < policy.minPositionalFallbackPairScore) continue;
    const removedLine = changedLineAt(removed, index);
    const addedLine = changedLineAt(added, index);
    if (hasUniqueSharedSimilarityFeature(removedLine, addedLine, similarityDocuments)) {
      pairs.push({
        removedIndex: removedLine.index,
        addedIndex: addedLine.index,
        confidence: policy.linePairConfidence(score, 0)
      });
      usedRemoved.add(index);
      usedAdded.add(index);
      continue;
    }
    if (!canCheckAmbiguity) continue;
    const competingScore = policy.competingChangedLineScoreAt(
      removed.length,
      added.length,
      index,
      index,
      scoreAt
    );
    if (policy.isAmbiguousChangedLinePairScore(score, competingScore)) continue;
    pairs.push({
      removedIndex: removedLine.index,
      addedIndex: addedLine.index,
      confidence: policy.linePairConfidence(score, competingScore)
    });
    usedRemoved.add(index);
    usedAdded.add(index);
  }
  return pairs.sort(
    (a, b) => (positions.removed.get(a.removedIndex) ?? 0) - (positions.removed.get(b.removedIndex) ?? 0)
  );
}
function sparseChangedLinePairCandidates(documents, tokenWeight2) {
  const removedPositions = similarityFeaturePositions(documents.removedFeatures);
  const addedPositions = similarityFeaturePositions(documents.addedFeatures);
  const candidates = /* @__PURE__ */ new Map();
  const addedLength = documents.addedFeatures.length;
  for (const [feature, featureRemovedPositions] of removedPositions) {
    const featureAddedPositions = addedPositions.get(feature);
    if (!featureAddedPositions) continue;
    const documentCount = documents.documentCounts.get(feature) ?? Number.POSITIVE_INFINITY;
    if (documentCount > MAX_SPARSE_FEATURE_DOCUMENTS || featureRemovedPositions.length > MAX_SPARSE_FEATURE_DOCUMENTS_PER_SIDE || featureAddedPositions.length > MAX_SPARSE_FEATURE_DOCUMENTS_PER_SIDE)
      continue;
    const weight = tokenWeight2(feature);
    if (weight < 1) continue;
    const uniqueFeature = documentCount === 2 && featureRemovedPositions.length === 1 && featureAddedPositions.length === 1;
    for (const removedPosition of featureRemovedPositions) {
      for (const addedPosition of featureAddedPositions) {
        const key = removedPosition * addedLength + addedPosition;
        const candidate = candidates.get(key);
        if (candidate) {
          candidate.evidence += weight;
          candidate.sharedFeatureCount++;
          candidate.hasUniqueFeature ||= uniqueFeature;
        } else {
          candidates.set(key, {
            removedPosition,
            addedPosition,
            evidence: weight,
            sharedFeatureCount: 1,
            hasUniqueFeature: uniqueFeature,
            competingEvidence: 0
          });
        }
      }
    }
  }
  const candidateList = [...candidates.values()];
  addCompetingSparseEvidence(candidateList);
  return boundedSparseChangedLinePairCandidates(candidateList);
}
function similarityFeaturePositions(featureLists) {
  const positions = /* @__PURE__ */ new Map();
  for (let position = 0; position < featureLists.length; position++) {
    const features = featureLists[position];
    if (!features) continue;
    for (const feature of new Set(features)) {
      const featurePositions = positions.get(feature);
      if (featurePositions) featurePositions.push(position);
      else positions.set(feature, [position]);
    }
  }
  return positions;
}
function addCompetingSparseEvidence(candidates) {
  const removedEvidence = topTwoCandidateValues(
    candidates,
    (candidate) => candidate.removedPosition,
    (candidate) => candidate.evidence
  );
  const addedEvidence = topTwoCandidateValues(
    candidates,
    (candidate) => candidate.addedPosition,
    (candidate) => candidate.evidence
  );
  for (const candidate of candidates) {
    candidate.competingEvidence = Math.max(
      competingCandidateValue(removedEvidence.get(candidate.removedPosition), candidate.evidence),
      competingCandidateValue(addedEvidence.get(candidate.addedPosition), candidate.evidence)
    );
  }
}
function topTwoCandidateValues(candidates, position, value) {
  const values = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    const current = values.get(position(candidate)) ?? { best: 0, second: 0 };
    const candidateValue = value(candidate);
    if (candidateValue >= current.best) {
      current.second = current.best;
      current.best = candidateValue;
    } else if (candidateValue > current.second) current.second = candidateValue;
    values.set(position(candidate), current);
  }
  return values;
}
function competingCandidateValue(values, candidateValue) {
  if (!values) return 0;
  return candidateValue === values.best ? values.second : values.best;
}
function boundedSparseChangedLinePairCandidates(candidates) {
  const byRemoved = /* @__PURE__ */ new Map();
  const byAdded = /* @__PURE__ */ new Map();
  for (const candidate of candidates) {
    appendSparseCandidate(byRemoved, candidate.removedPosition, candidate);
    appendSparseCandidate(byAdded, candidate.addedPosition, candidate);
  }
  const selectedByRemoved = topSparseCandidates(byRemoved);
  const selectedByAdded = topSparseCandidates(byAdded);
  return candidates.filter(
    (candidate) => selectedByRemoved.has(candidate) && selectedByAdded.has(candidate)
  );
}
function appendSparseCandidate(candidates, position, candidate) {
  const atPosition = candidates.get(position);
  if (atPosition) atPosition.push(candidate);
  else candidates.set(position, [candidate]);
}
function topSparseCandidates(candidates) {
  const selected = /* @__PURE__ */ new Set();
  for (const atPosition of candidates.values()) {
    atPosition.sort(compareSparseCandidates);
    for (const candidate of atPosition.slice(0, MAX_SPARSE_CANDIDATES_PER_LINE))
      selected.add(candidate);
  }
  return selected;
}
function compareSparseCandidates(a, b) {
  return Number(b.hasUniqueFeature) - Number(a.hasUniqueFeature) || b.evidence - a.evidence || b.sharedFeatureCount - a.sharedFeatureCount || Math.abs(a.removedPosition - a.addedPosition) - Math.abs(b.removedPosition - b.addedPosition) || a.removedPosition - b.removedPosition || a.addedPosition - b.addedPosition;
}
function sparseChangedLineAnchors(removed, added, sparseCandidates, scoreAt, policy) {
  const scoredCandidates = sparseCandidates.map((candidate) => ({
    ...candidate,
    score: scoreAt(candidate.removedPosition, candidate.addedPosition)
  })).sort((a, b) => b.score - a.score || compareSparseCandidates(a, b));
  const removedScores = topTwoCandidateValues(
    scoredCandidates,
    (candidate) => candidate.removedPosition,
    (candidate) => candidate.score
  );
  const addedScores = topTwoCandidateValues(
    scoredCandidates,
    (candidate) => candidate.addedPosition,
    (candidate) => candidate.score
  );
  const usedRemoved = /* @__PURE__ */ new Set();
  const usedAdded = /* @__PURE__ */ new Set();
  const pairs = [];
  for (const candidate of scoredCandidates) {
    if (candidate.score < policy.minChangedLinePairScore) continue;
    if (usedRemoved.has(candidate.removedPosition) || usedAdded.has(candidate.addedPosition))
      continue;
    if (!hasStrongSparseEvidence(candidate)) continue;
    const competingScore = Math.max(
      competingCandidateValue(removedScores.get(candidate.removedPosition), candidate.score),
      competingCandidateValue(addedScores.get(candidate.addedPosition), candidate.score),
      sparsePositionalCompetingScore(candidate, removed.length, added.length, scoreAt)
    );
    if (!policy.isReciprocalBestChangedLinePair(candidate.score, competingScore)) continue;
    usedRemoved.add(candidate.removedPosition);
    usedAdded.add(candidate.addedPosition);
    pairs.push({
      removedIndex: changedLineAt(removed, candidate.removedPosition).index,
      addedIndex: changedLineAt(added, candidate.addedPosition).index,
      confidence: policy.linePairConfidence(candidate.score, competingScore)
    });
  }
  return pairs;
}
function sparsePositionalCompetingScore(candidate, removedLength, addedLength, scoreAt) {
  let competingScore = 0;
  if (candidate.removedPosition < addedLength && candidate.addedPosition !== candidate.removedPosition)
    competingScore = scoreAt(candidate.removedPosition, candidate.removedPosition);
  if (candidate.addedPosition < removedLength && candidate.removedPosition !== candidate.addedPosition)
    competingScore = Math.max(
      competingScore,
      scoreAt(candidate.addedPosition, candidate.addedPosition)
    );
  return competingScore;
}
function hasStrongSparseEvidence(candidate) {
  if (!candidate.hasUniqueFeature && candidate.sharedFeatureCount < MIN_SPARSE_RARE_FEATURE_COUNT)
    return false;
  return candidate.evidence - candidate.competingEvidence > MIN_SPARSE_EVIDENCE_MARGIN && candidate.competingEvidence < candidate.evidence * MIN_SPARSE_EVIDENCE_RATIO;
}
function changedLinePositions(removed, added) {
  return {
    removed: new Map(removed.map((line, index) => [line.index, index])),
    added: new Map(added.map((line, index) => [line.index, index]))
  };
}
function changedLineAt(lines, index) {
  const line = lines[index];
  if (line === void 0) throw new RangeError(`Missing changed line ${index}`);
  return line;
}

// src/ui/word-diff/line-matching.ts
function matchChangedLines(removed, added) {
  if (removed.length === 0 || added.length === 0) return [];
  if (removed.length * added.length > MAX_CHANGED_LINE_PAIR_CELLS)
    return matchChangedLinesSparse(removed, added, SPARSE_LINE_MATCHING_POLICY);
  const similarityDocuments = changedLineSimilarityDocuments(removed, added);
  const tokenWeight2 = similarityTokenWeight(similarityDocuments);
  const { removedFeatures, addedFeatures } = similarityDocuments;
  const removedWeights = removedFeatures.map(
    (tokens) => similarityTokenListWeight(tokens, tokenWeight2)
  );
  const addedWeights = addedFeatures.map(
    (tokens) => similarityTokenListWeight(tokens, tokenWeight2)
  );
  const scores = removedFeatures.map(
    (beforeTokens, removedPosition) => addedFeatures.map(
      (afterTokens, addedPosition) => tokenSimilarity(
        beforeTokens,
        afterTokens,
        tokenWeight2,
        MIN_POSITIONAL_FALLBACK_PAIR_SCORE,
        removedWeights[removedPosition],
        addedWeights[addedPosition]
      )
    )
  );
  const similarPairs = prefixAlignedPairs(
    removed.length,
    added.length,
    (removedPosition, addedPosition) => {
      const score = scores[removedPosition]?.[addedPosition] ?? 0;
      return score >= MIN_CHANGED_LINE_PAIR_SCORE ? score + 0.01 : Number.NEGATIVE_INFINITY;
    }
  );
  if (similarPairs.length === 0 && removed.length === 1 && added.length === 1)
    return [
      {
        removedIndex: changedLineAt2(removed, 0).index,
        addedIndex: changedLineAt2(added, 0).index,
        confidence: "medium"
      }
    ];
  const positions = changedLinePositions2(removed, added);
  const confidentPairs = confidentChangedLinePairs(
    positions,
    scores,
    addPositionalFallbackPairs(removed, added, scores, similarPairs)
  );
  return addCrossingPairs(removed, added, scores, positions, confidentPairs);
}
var MIN_CHANGED_LINE_PAIR_SCORE = 0.45;
var MIN_POSITIONAL_FALLBACK_PAIR_SCORE = 0.28;
var CHANGED_LINE_PAIR_AMBIGUITY_MARGIN = 0.06;
var CHANGED_LINE_PAIR_AMBIGUITY_RATIO = 0.92;
var MIN_HIGH_CONFIDENCE_CROSSING_PAIR_SCORE = 0.72;
var HIGH_CONFIDENCE_CROSSING_PAIR_MARGIN = 0.12;
var HIGH_CONFIDENCE_CROSSING_PAIR_RATIO = 0.85;
var MAX_CHANGED_LINE_PAIR_CELLS = 1024;
var SPARSE_LINE_MATCHING_POLICY = {
  minPositionalFallbackPairScore: MIN_POSITIONAL_FALLBACK_PAIR_SCORE,
  minChangedLinePairScore: MIN_CHANGED_LINE_PAIR_SCORE,
  competingChangedLineScoreAt,
  isAmbiguousChangedLinePairScore,
  isReciprocalBestChangedLinePair,
  linePairConfidence
};
function changedLinePositions2(removed, added) {
  return {
    removed: new Map(removed.map((line, index) => [line.index, index])),
    added: new Map(added.map((line, index) => [line.index, index]))
  };
}
function confidentChangedLinePairs(positions, scores, pairs) {
  const confidentPairs = [];
  for (const [removedIndex, addedIndex] of pairs) {
    const removedPosition = positions.removed.get(removedIndex);
    const addedPosition = positions.added.get(addedIndex);
    if (removedPosition === void 0 || addedPosition === void 0) continue;
    const score = scores[removedPosition]?.[addedPosition] ?? 0;
    const competingScore = competingChangedLineScore(scores, removedPosition, addedPosition);
    if (isAmbiguousChangedLinePairScore(score, competingScore)) continue;
    confidentPairs.push({
      removedIndex,
      addedIndex,
      confidence: linePairConfidence(score, competingScore)
    });
  }
  return confidentPairs;
}
function competingChangedLineScore(scores, removedPosition, addedPosition, usedRemoved, usedAdded) {
  return competingChangedLineScoreAt(
    scores.length,
    scores[removedPosition]?.length ?? 0,
    removedPosition,
    addedPosition,
    (candidateRemovedPosition, candidateAddedPosition) => scores[candidateRemovedPosition]?.[candidateAddedPosition] ?? 0,
    usedRemoved,
    usedAdded
  );
}
function competingChangedLineScoreAt(removedLength, addedLength, removedPosition, addedPosition, scoreAt, usedRemoved, usedAdded) {
  let competingScore = 0;
  for (let candidateAddedPosition = 0; candidateAddedPosition < addedLength; candidateAddedPosition++) {
    if (candidateAddedPosition === addedPosition || usedAdded?.has(candidateAddedPosition))
      continue;
    competingScore = Math.max(competingScore, scoreAt(removedPosition, candidateAddedPosition));
  }
  for (let candidateRemovedPosition = 0; candidateRemovedPosition < removedLength; candidateRemovedPosition++) {
    if (candidateRemovedPosition === removedPosition || usedRemoved?.has(candidateRemovedPosition))
      continue;
    competingScore = Math.max(competingScore, scoreAt(candidateRemovedPosition, addedPosition));
  }
  return competingScore;
}
function isAmbiguousChangedLinePairScore(score, competingScore) {
  return competingScore >= MIN_POSITIONAL_FALLBACK_PAIR_SCORE && (score - competingScore <= CHANGED_LINE_PAIR_AMBIGUITY_MARGIN || competingScore >= score * CHANGED_LINE_PAIR_AMBIGUITY_RATIO);
}
function isReciprocalBestChangedLinePair(score, competingScore) {
  return score > competingScore && !isAmbiguousChangedLinePairScore(score, competingScore);
}
function linePairConfidence(score, competingScore) {
  if (score >= MIN_HIGH_CONFIDENCE_CROSSING_PAIR_SCORE && score - competingScore >= HIGH_CONFIDENCE_CROSSING_PAIR_MARGIN && competingScore <= score * HIGH_CONFIDENCE_CROSSING_PAIR_RATIO)
    return "high";
  return "medium";
}
function addCrossingPairs(removed, added, scores, positions, pairs) {
  const usedRemoved = /* @__PURE__ */ new Set();
  const usedAdded = /* @__PURE__ */ new Set();
  for (const pair of pairs) {
    const removedPosition = positions.removed.get(pair.removedIndex);
    const addedPosition = positions.added.get(pair.addedIndex);
    if (removedPosition !== void 0) usedRemoved.add(removedPosition);
    if (addedPosition !== void 0) usedAdded.add(addedPosition);
  }
  const candidates = [];
  for (let removedPosition = 0; removedPosition < removed.length; removedPosition++) {
    if (usedRemoved.has(removedPosition)) continue;
    for (let addedPosition = 0; addedPosition < added.length; addedPosition++) {
      if (usedAdded.has(addedPosition)) continue;
      const score = scores[removedPosition]?.[addedPosition] ?? 0;
      if (score >= MIN_CHANGED_LINE_PAIR_SCORE)
        candidates.push({ removedPosition, addedPosition, score });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const competingScores = changedLineCompetingScores(scores);
  const out = [...pairs];
  for (const candidate of candidates) {
    if (usedRemoved.has(candidate.removedPosition) || usedAdded.has(candidate.addedPosition))
      continue;
    let confidence;
    if (candidate.score >= MIN_HIGH_CONFIDENCE_CROSSING_PAIR_SCORE) {
      const availableCompetingScore = competingChangedLineScore(
        scores,
        candidate.removedPosition,
        candidate.addedPosition,
        usedRemoved,
        usedAdded
      );
      if (linePairConfidence(candidate.score, availableCompetingScore) === "high")
        confidence = "high";
    }
    confidence ??= reciprocalCrossingPairConfidence(competingScores, candidate);
    if (!confidence) continue;
    usedRemoved.add(candidate.removedPosition);
    usedAdded.add(candidate.addedPosition);
    out.push({
      removedIndex: changedLineAt2(removed, candidate.removedPosition).index,
      addedIndex: changedLineAt2(added, candidate.addedPosition).index,
      confidence
    });
  }
  return out.sort(
    (a, b) => (positions.removed.get(a.removedIndex) ?? 0) - (positions.removed.get(b.removedIndex) ?? 0)
  );
}
function changedLineCompetingScores(scores) {
  const removed = [];
  const added = [];
  for (let removedPosition = 0; removedPosition < scores.length; removedPosition++) {
    const removedScores = scores[removedPosition] ?? [];
    for (let addedPosition = 0; addedPosition < removedScores.length; addedPosition++) {
      const score = removedScores[addedPosition] ?? 0;
      addCandidateValue(removed, removedPosition, score);
      addCandidateValue(added, addedPosition, score);
    }
  }
  return { removed, added };
}
function addCandidateValue(values, position, value) {
  const current = values[position] ?? { best: 0, second: 0 };
  if (value >= current.best) {
    current.second = current.best;
    current.best = value;
  } else if (value > current.second) current.second = value;
  values[position] = current;
}
function reciprocalCrossingPairConfidence(competingScores, candidate) {
  const competingScore = Math.max(
    competingCandidateValue(competingScores.removed[candidate.removedPosition], candidate.score),
    competingCandidateValue(competingScores.added[candidate.addedPosition], candidate.score)
  );
  if (!isReciprocalBestChangedLinePair(candidate.score, competingScore)) return void 0;
  return linePairConfidence(candidate.score, competingScore);
}
function addPositionalFallbackPairs(removed, added, scores, similarPairs) {
  const pairs = [];
  let removedCursor = 0;
  let addedCursor = 0;
  for (const [removedPosition, addedPosition] of similarPairs) {
    pairs.push(
      ...positionPairs(
        removed,
        added,
        scores,
        removedCursor,
        removedPosition,
        addedCursor,
        addedPosition
      )
    );
    pairs.push([
      changedLineAt2(removed, removedPosition).index,
      changedLineAt2(added, addedPosition).index
    ]);
    removedCursor = removedPosition + 1;
    addedCursor = addedPosition + 1;
  }
  pairs.push(
    ...positionPairs(
      removed,
      added,
      scores,
      removedCursor,
      removed.length,
      addedCursor,
      added.length
    )
  );
  return pairs;
}
function positionPairs(removed, added, scores, removedStart, removedEnd, addedStart, addedEnd) {
  const pairs = [];
  const count = Math.min(removedEnd - removedStart, addedEnd - addedStart);
  for (let offset = 0; offset < count; offset++) {
    const removedPosition = removedStart + offset;
    const addedPosition = addedStart + offset;
    const score = scores[removedPosition]?.[addedPosition] ?? 0;
    if (score < MIN_POSITIONAL_FALLBACK_PAIR_SCORE) continue;
    pairs.push([
      changedLineAt2(removed, removedPosition).index,
      changedLineAt2(added, addedPosition).index
    ]);
  }
  return pairs;
}
function changedLineAt2(lines, index) {
  const line = lines[index];
  if (line === void 0) throw new RangeError(`Missing changed line ${index}`);
  return line;
}

// src/ui/word-diff/parse.ts
function diffLineNumberWidth(lines) {
  return lines.reduce((width, line) => Math.max(width, normalizedDiffLineNumber(line).length), 0);
}
function formatDiffLineNumber(lineNumber, width) {
  return lineNumber.trim().padStart(width, " ");
}
function normalizedDiffLineNumber(line) {
  return line?.lineNumber.trim() ?? "";
}
function parseDiffLine(line) {
  const numbered = line.match(/^([+\- ])(\s*\d+)\s(.*)$/);
  if (numbered) {
    const [, kind, lineNumber, content] = numbered;
    if (kind !== "+" && kind !== "-" && kind !== " " || lineNumber === void 0 || content === void 0)
      return null;
    return { kind, lineNumber, content };
  }
  if (line.startsWith("+++") || line.startsWith("---")) return null;
  const prefix = line[0];
  if (prefix !== "+" && prefix !== "-" && prefix !== " ") return null;
  return { kind: prefix, lineNumber: "", content: line.slice(1) };
}
function isAddedDiffLine(line) {
  return line?.kind === "+";
}
function isRemovedDiffLine(line) {
  return line?.kind === "-";
}

// src/ui/word-diff/ranges.ts
function rangesForTokenGroup(tokens, group) {
  const ranges = [];
  for (let index = group.start; index < group.end; index++) {
    const token = tokens[index];
    if (token) appendTokenRange(ranges, token);
  }
  return ranges;
}
function pushTokenRange(ranges, token) {
  ranges.push([token.start, token.end]);
}
function mergeRangesByStart(ranges) {
  return mergeRanges([...ranges].sort((a, b) => a[0] - b[0]));
}
function mergeRanges(ranges) {
  const merged = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range[0] - previous[1] <= 1) previous[1] = range[1];
    else merged.push([...range]);
  }
  return merged;
}
function appendTokenRange(ranges, token) {
  const previous = ranges.at(-1);
  if (previous && token.start - previous[1] <= 1) previous[1] = token.end;
  else ranges.push([token.start, token.end]);
}

// src/ui/word-diff/text-boundaries.ts
var NON_ASCII_TEXT_PATTERN = /[^\x00-\x7F]/;
var graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function commonPrefixLength(before, after) {
  const prefix = commonPrefixCodeUnitLength(before, after);
  if (!needsBoundarySafeOffsets(before) && !needsBoundarySafeOffsets(after)) return prefix;
  return commonGraphemePrefixLength(before, after, prefix);
}
function commonSuffixLength(before, after, prefixLength) {
  const suffix = commonSuffixCodeUnitLength(before, after, prefixLength);
  if (!needsBoundarySafeOffsets(before) && !needsBoundarySafeOffsets(after)) return suffix;
  return commonGraphemeSuffixLength(before, after, suffix);
}
function needsBoundarySafeOffsets(text) {
  return NON_ASCII_TEXT_PATTERN.test(text) || text.includes("\r\n");
}
function textBoundarySegments(text) {
  if (!needsBoundarySafeOffsets(text)) {
    return Array.from({ length: text.length }, (_, index) => ({
      value: text[index] ?? "",
      start: index,
      end: index + 1
    }));
  }
  return Array.from(graphemeSegmenter.segment(text), (segment) => ({
    value: segment.segment,
    start: segment.index,
    end: segment.index + segment.segment.length
  }));
}
function rangesAtGraphemeBoundaries(text, ranges) {
  if (ranges.length === 0 || !needsBoundarySafeOffsets(text)) return ranges;
  const segmentedText = graphemeSegmenter.segment(text);
  return ranges.map(([start, end]) => [
    graphemeStartAtOrBefore(segmentedText, start, text.length),
    graphemeEndAtOrAfter(segmentedText, end, text.length)
  ]);
}
function commonPrefixCodeUnitLength(before, after) {
  const end = Math.min(before.length, after.length);
  let index = 0;
  while (index < end && before[index] === after[index]) index++;
  return index;
}
function commonSuffixCodeUnitLength(before, after, prefixLength) {
  const maxLength = Math.min(before.length, after.length) - prefixLength;
  let length = 0;
  while (length < maxLength && before[before.length - 1 - length] === after[after.length - 1 - length])
    length++;
  return length;
}
function commonGraphemePrefixLength(before, after, prefix) {
  const beforeSegments = graphemeSegmenter.segment(before);
  const afterSegments = graphemeSegmenter.segment(after);
  let safePrefix = prefix;
  while (safePrefix > 0) {
    const beforeBoundary = graphemeBoundaryAtOrBefore(beforeSegments, safePrefix);
    const afterBoundary = graphemeBoundaryAtOrBefore(afterSegments, safePrefix);
    const nextPrefix = Math.min(beforeBoundary, afterBoundary);
    if (nextPrefix === safePrefix) break;
    safePrefix = nextPrefix;
  }
  return safePrefix;
}
function commonGraphemeSuffixLength(before, after, suffix) {
  const beforeSegments = graphemeSegmenter.segment(before);
  const afterSegments = graphemeSegmenter.segment(after);
  let safeSuffix = suffix;
  while (safeSuffix > 0) {
    const beforeStart = before.length - safeSuffix;
    const afterStart = after.length - safeSuffix;
    const beforeTrim = graphemeBoundaryAtOrAfter(beforeSegments, beforeStart, before.length) - beforeStart;
    const afterTrim = graphemeBoundaryAtOrAfter(afterSegments, afterStart, after.length) - afterStart;
    const trim = Math.max(beforeTrim, afterTrim);
    if (trim === 0) break;
    safeSuffix = Math.max(0, safeSuffix - trim);
  }
  return safeSuffix;
}
function graphemeBoundaryAtOrBefore(segments, offset) {
  if (offset <= 0) return 0;
  const segment = segments.containing(offset - 1);
  if (!segment) return offset;
  const segmentEnd = segment.index + segment.segment.length;
  return segmentEnd === offset ? offset : segment.index;
}
function graphemeBoundaryAtOrAfter(segments, offset, textLength) {
  if (offset <= 0) return 0;
  if (offset >= textLength) return textLength;
  const segment = segments.containing(offset);
  if (!segment || segment.index === offset) return offset;
  return segment.index + segment.segment.length;
}
function graphemeStartAtOrBefore(segments, offset, textLength) {
  if (offset <= 0) return 0;
  if (offset >= textLength) return textLength;
  return segments.containing(offset)?.index ?? offset;
}
function graphemeEndAtOrAfter(segments, offset, textLength) {
  if (offset <= 0) return 0;
  if (offset >= textLength) return textLength;
  const segment = segments.containing(offset - 1);
  return segment ? segment.index + segment.segment.length : offset;
}

// src/ui/word-diff/token-alignment.ts
var WORD_EMPHASIS_EXACT_LCS_MAX_CELLS = 262144;
function collectChangedTokenGaps(before, beforeStart, beforeEnd, after, afterStart, afterEnd, gaps) {
  while (beforeStart < beforeEnd && afterStart < afterEnd && tokenAt(before, beforeStart).value === tokenAt(after, afterStart).value) {
    beforeStart++;
    afterStart++;
  }
  while (beforeStart < beforeEnd && afterStart < afterEnd && tokenAt(before, beforeEnd - 1).value === tokenAt(after, afterEnd - 1).value) {
    beforeEnd--;
    afterEnd--;
  }
  if (beforeStart === beforeEnd || afterStart === afterEnd) {
    appendChangedTokenGap(gaps, beforeStart, beforeEnd, afterStart, afterEnd);
    return "high";
  }
  const beforeLength = beforeEnd - beforeStart;
  const afterLength = afterEnd - afterStart;
  if (beforeLength * afterLength <= WORD_EMPHASIS_EXACT_LCS_MAX_CELLS) {
    collectChangedTokenGapsByLcs(before, beforeStart, beforeEnd, after, afterStart, afterEnd, gaps);
    return "high";
  }
  const anchors = uniqueOrderedAnchors(before, beforeStart, beforeEnd, after, afterStart, afterEnd);
  if (anchors.length === 0) {
    appendChangedTokenGap(gaps, beforeStart, beforeEnd, afterStart, afterEnd);
    return "low";
  }
  let confidence = "high";
  let previousBefore = beforeStart;
  let previousAfter = afterStart;
  for (const anchor of anchors) {
    confidence = lowerWordChangeConfidence(
      confidence,
      collectChangedTokenGaps(
        before,
        previousBefore,
        anchor.beforeIndex,
        after,
        previousAfter,
        anchor.afterIndex,
        gaps
      )
    );
    previousBefore = anchor.beforeIndex + 1;
    previousAfter = anchor.afterIndex + 1;
  }
  confidence = lowerWordChangeConfidence(
    confidence,
    collectChangedTokenGaps(
      before,
      previousBefore,
      beforeEnd,
      after,
      previousAfter,
      afterEnd,
      gaps
    )
  );
  return lowerWordChangeConfidence(confidence, "medium");
}
function lowerWordChangeConfidence(a, b) {
  return WORD_CHANGE_CONFIDENCE_RANK[a] <= WORD_CHANGE_CONFIDENCE_RANK[b] ? a : b;
}
var WORD_CHANGE_CONFIDENCE_RANK = {
  low: 0,
  medium: 1,
  high: 2
};
function collectChangedTokenGapsByLcs(before, beforeStart, beforeEnd, after, afterStart, afterEnd, gaps) {
  const beforeLength = beforeEnd - beforeStart;
  const afterLength = afterEnd - afterStart;
  const pairs = suffixAlignedPairs(beforeLength, afterLength, (beforeIndex2, afterIndex2) => {
    const beforeToken = tokenAt(before, beforeStart + beforeIndex2);
    const afterToken = tokenAt(after, afterStart + afterIndex2);
    return beforeToken.value === afterToken.value ? wordEmphasisTokenWeight(beforeToken.value) : Number.NEGATIVE_INFINITY;
  });
  let beforeIndex = 0;
  let afterIndex = 0;
  for (const [nextBeforeIndex, nextAfterIndex] of pairs) {
    appendChangedTokenGap(
      gaps,
      beforeStart + beforeIndex,
      beforeStart + nextBeforeIndex,
      afterStart + afterIndex,
      afterStart + nextAfterIndex
    );
    beforeIndex = nextBeforeIndex + 1;
    afterIndex = nextAfterIndex + 1;
  }
  appendChangedTokenGap(
    gaps,
    beforeStart + beforeIndex,
    beforeEnd,
    afterStart + afterIndex,
    afterEnd
  );
}
function uniqueOrderedAnchors(before, beforeStart, beforeEnd, after, afterStart, afterEnd) {
  const beforeCounts = tokenCounts(before, beforeStart, beforeEnd);
  const afterCounts = tokenCounts(after, afterStart, afterEnd);
  const afterUniqueIndexes = /* @__PURE__ */ new Map();
  for (let index = afterStart; index < afterEnd; index++) {
    const value = tokenAt(after, index).value;
    if (beforeCounts.get(value) === 1 && afterCounts.get(value) === 1)
      afterUniqueIndexes.set(value, index);
  }
  const candidates = [];
  for (let index = beforeStart; index < beforeEnd; index++) {
    const value = tokenAt(before, index).value;
    if (beforeCounts.get(value) !== 1 || afterCounts.get(value) !== 1) continue;
    const afterIndex = afterUniqueIndexes.get(value);
    if (afterIndex !== void 0) candidates.push({ beforeIndex: index, afterIndex });
  }
  return longestIncreasingAfterIndexes(candidates);
}
function longestIncreasingAfterIndexes(candidates) {
  if (candidates.length <= 1) return candidates;
  const tails = [];
  const previous = Array.from({ length: candidates.length }, () => -1);
  const tailCandidateIndexes = [];
  for (let index2 = 0; index2 < candidates.length; index2++) {
    const afterIndex = candidateAt(candidates, index2).afterIndex;
    let low = 0;
    let high = tails.length;
    while (low < high) {
      const middle = low + high >> 1;
      if (numberAt(tails, middle) < afterIndex) low = middle + 1;
      else high = middle;
    }
    if (low > 0) previous[index2] = numberAt(tailCandidateIndexes, low - 1);
    tails[low] = afterIndex;
    tailCandidateIndexes[low] = index2;
  }
  const ordered = [];
  let index = tailCandidateIndexes[tails.length - 1] ?? -1;
  while (index >= 0) {
    ordered.push(candidateAt(candidates, index));
    index = previous[index] ?? -1;
  }
  return ordered.reverse();
}
function tokenCounts(tokens, start, end) {
  const counts = /* @__PURE__ */ new Map();
  for (let index = start; index < end; index++) {
    const value = tokenAt(tokens, index).value;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}
function appendChangedTokenGap(gaps, beforeStart, beforeEnd, afterStart, afterEnd) {
  if (beforeStart === beforeEnd && afterStart === afterEnd) return;
  gaps.push({
    removed: { start: beforeStart, end: beforeEnd },
    added: { start: afterStart, end: afterEnd }
  });
}
function tokenAt(tokens, index) {
  const token = tokens[index];
  if (token === void 0) throw new RangeError(`Missing word-emphasis token ${index}`);
  return token;
}
function candidateAt(candidates, index) {
  const candidate = candidates[index];
  if (candidate === void 0) throw new RangeError(`Missing anchor candidate ${index}`);
  return candidate;
}
function numberAt(values, index) {
  const value = values[index];
  if (value === void 0) throw new RangeError(`Missing numeric value ${index}`);
  return value;
}

// src/ui/word-diff/token-text-refinement.ts
var MAX_REFINED_TEXT_ALIGNMENT_CELLS = 1024;
var MAX_REFINED_TEXT_GRAPHEMES = 48;
var MAX_REFINED_TEXT_INTERNAL_RUNS = 4;
var MIN_REFINED_TEXT_INTERNAL_RUN_GRAPHEMES = 3;
function refinedTokenTextRanges(beforeToken, afterToken) {
  if (beforeToken.value === afterToken.value) return void 0;
  const prefix = commonPrefixLength(beforeToken.value, afterToken.value);
  const suffix = commonSuffixLength(beforeToken.value, afterToken.value, prefix);
  if (!shouldRefineTokenText(beforeToken.value, afterToken.value, prefix, suffix)) return void 0;
  const aligned = refinedTokenTextRangesByAlignment(beforeToken, afterToken, prefix, suffix);
  if (aligned) return aligned;
  return tokenTextGapRanges(
    beforeToken,
    afterToken,
    prefix,
    beforeToken.value.length - suffix,
    prefix,
    afterToken.value.length - suffix
  );
}
function refinedTokenTextRangesByAlignment(beforeToken, afterToken, prefix, suffix) {
  const beforeValue = beforeToken.value;
  const afterValue = afterToken.value;
  if (!isIdentifierToken(beforeValue) || !isIdentifierToken(afterValue)) return void 0;
  if (beforeValue.length * afterValue.length > MAX_REFINED_TEXT_ALIGNMENT_CELLS) return void 0;
  if (!hasPotentialInternalCommonText(beforeValue, afterValue, prefix, suffix)) return void 0;
  const beforeSegments = textBoundarySegments(beforeValue);
  const afterSegments = textBoundarySegments(afterValue);
  if (beforeSegments.length > MAX_REFINED_TEXT_GRAPHEMES || afterSegments.length > MAX_REFINED_TEXT_GRAPHEMES || beforeSegments.length * afterSegments.length > MAX_REFINED_TEXT_ALIGNMENT_CELLS)
    return void 0;
  const pairs = suffixAlignedPairs(
    beforeSegments.length,
    afterSegments.length,
    (before, after) => segmentAt(beforeSegments, before).value === segmentAt(afterSegments, after).value ? 1 : Number.NEGATIVE_INFINITY
  );
  const runs = commonTextRuns(pairs);
  const keptRuns = runs.filter(
    (run) => isEdgeTextRun(run, beforeSegments.length, afterSegments.length) || run.beforeEnd - run.beforeStart >= MIN_REFINED_TEXT_INTERNAL_RUN_GRAPHEMES
  );
  const internalRunCount = keptRuns.filter(
    (run) => !isEdgeTextRun(run, beforeSegments.length, afterSegments.length)
  ).length;
  if (internalRunCount === 0 || internalRunCount > MAX_REFINED_TEXT_INTERNAL_RUNS) return void 0;
  const removed = [];
  const added = [];
  let beforeIndex = 0;
  let afterIndex = 0;
  for (const run of keptRuns) {
    pushTextSegmentRange(removed, beforeToken, beforeSegments, beforeIndex, run.beforeStart);
    pushTextSegmentRange(added, afterToken, afterSegments, afterIndex, run.afterStart);
    beforeIndex = run.beforeEnd;
    afterIndex = run.afterEnd;
  }
  pushTextSegmentRange(removed, beforeToken, beforeSegments, beforeIndex, beforeSegments.length);
  pushTextSegmentRange(added, afterToken, afterSegments, afterIndex, afterSegments.length);
  return removed.length > 0 || added.length > 0 ? { removed, added } : void 0;
}
function tokenTextGapRanges(beforeToken, afterToken, beforeStart, beforeEnd, afterStart, afterEnd) {
  const removed = beforeStart < beforeEnd ? [[beforeToken.start + beforeStart, beforeToken.start + beforeEnd]] : [];
  const added = afterStart < afterEnd ? [[afterToken.start + afterStart, afterToken.start + afterEnd]] : [];
  return removed.length > 0 || added.length > 0 ? { removed, added } : void 0;
}
function hasPotentialInternalCommonText(before, after, prefix, suffix) {
  const beforeMiddle = before.slice(prefix, before.length - suffix);
  const afterMiddle = after.slice(prefix, after.length - suffix);
  const [shorter, longer] = beforeMiddle.length <= afterMiddle.length ? [beforeMiddle, afterMiddle] : [afterMiddle, beforeMiddle];
  if (shorter.length < MIN_REFINED_TEXT_INTERNAL_RUN_GRAPHEMES) return false;
  for (let index = 0; index <= shorter.length - MIN_REFINED_TEXT_INTERNAL_RUN_GRAPHEMES; index++) {
    const candidate = shorter.slice(index, index + MIN_REFINED_TEXT_INTERNAL_RUN_GRAPHEMES);
    if (longer.includes(candidate)) return true;
  }
  return false;
}
function commonTextRuns(pairs) {
  const runs = [];
  for (const [beforeIndex, afterIndex] of pairs) {
    const previous = runs.at(-1);
    if (previous?.beforeEnd === beforeIndex && previous.afterEnd === afterIndex) {
      previous.beforeEnd++;
      previous.afterEnd++;
    } else {
      runs.push({
        beforeStart: beforeIndex,
        beforeEnd: beforeIndex + 1,
        afterStart: afterIndex,
        afterEnd: afterIndex + 1
      });
    }
  }
  return runs;
}
function isEdgeTextRun(run, beforeLength, afterLength) {
  return run.beforeStart === 0 && run.afterStart === 0 || run.beforeEnd === beforeLength && run.afterEnd === afterLength;
}
function pushTextSegmentRange(ranges, token, segments, start, end) {
  if (start >= end) return;
  ranges.push([
    token.start + textSegmentOffset(segments, start, token.value.length),
    token.start + textSegmentOffset(segments, end, token.value.length)
  ]);
}
function textSegmentOffset(segments, index, textLength) {
  return index === segments.length ? textLength : segmentAt(segments, index).start;
}
function segmentAt(segments, index) {
  const segment = segments[index];
  if (segment === void 0) throw new RangeError(`Missing text segment ${index}`);
  return segment;
}
function shouldRefineTokenText(before, after, prefix, suffix) {
  const sharedEdgeLength = prefix + suffix;
  if (sharedEdgeLength === 0) return false;
  if (isIdentifierToken(before) && isIdentifierToken(after)) {
    if (sharedEdgeLength < 2 && !needsBoundarySafeOffsets(before) && !needsBoundarySafeOffsets(after))
      return false;
    if (prefix === 0 && suffix > 0) {
      const beforeChangedLength = before.length - suffix;
      const afterChangedLength = after.length - suffix;
      if (beforeChangedLength !== afterChangedLength && Math.min(beforeChangedLength, afterChangedLength) < 2)
        return false;
    }
    return true;
  }
  if (isNumberToken(before) && isNumberToken(after)) return true;
  if (isMeaningfulOperatorToken(before) && isMeaningfulOperatorToken(after)) return true;
  return false;
}

// src/ui/word-diff/range-refinement.ts
var MAX_SOFT_TOKEN_ALIGNMENT_CELLS = 4096;
var MIN_SOFT_TOKEN_SUBSTITUTION_SIMILARITY = 0.45;
function refinedRangesForChangedTokens(beforeText, beforeTokens, afterText, afterTokens, gaps) {
  const ranges = refinedRangesForTokenGaps(beforeTokens, afterTokens, gaps);
  return {
    removed: mergeRanges(rangesAtGraphemeBoundaries(beforeText, ranges.removed)),
    added: mergeRanges(rangesAtGraphemeBoundaries(afterText, ranges.added))
  };
}
function refinedRangesForTokenGaps(beforeTokens, afterTokens, gaps) {
  const removed = [];
  const added = [];
  for (const gap of gaps) {
    const removedGroup = nonEmptyTokenGroup(gap.removed);
    const addedGroup = nonEmptyTokenGroup(gap.added);
    const refined = removedGroup && addedGroup ? refinedChangedTokenGroupRanges(beforeTokens, removedGroup, afterTokens, addedGroup) : void 0;
    if (refined) {
      removed.push(...refined.removed);
      added.push(...refined.added);
      continue;
    }
    if (removedGroup) removed.push(...rangesForTokenGroup(beforeTokens, removedGroup));
    if (addedGroup) added.push(...rangesForTokenGroup(afterTokens, addedGroup));
  }
  return { removed: mergeRanges(removed), added: mergeRanges(added) };
}
function nonEmptyTokenGroup(group) {
  return group.start < group.end ? group : void 0;
}
function refinedChangedTokenGroupRanges(beforeTokens, beforeGroup, afterTokens, afterGroup) {
  return refinedSingleTokenRanges(beforeTokens, beforeGroup, afterTokens, afterGroup) ?? refinedSoftTokenGroupRanges(beforeTokens, beforeGroup, afterTokens, afterGroup);
}
function refinedSingleTokenRanges(beforeTokens, beforeGroup, afterTokens, afterGroup) {
  if (beforeGroup.end - beforeGroup.start !== 1 || afterGroup.end - afterGroup.start !== 1)
    return void 0;
  return refinedTokenPairRanges(
    tokenAt2(beforeTokens, beforeGroup.start),
    tokenAt2(afterTokens, afterGroup.start)
  );
}
function refinedTokenPairRanges(beforeToken, afterToken) {
  const identifierRanges = refinedIdentifierTokenRanges(beforeToken, afterToken);
  const textRanges = refinedTokenTextRanges(beforeToken, afterToken);
  if (identifierRanges && isNarrowerThanWholeTokens(identifierRanges, beforeToken, afterToken)) {
    if (shouldSuppressUnbalancedIdentifierPartRefinement(beforeToken, afterToken, textRanges))
      return textRanges;
    if (textRanges && (textRanges.removed.length === 0 || textRanges.added.length === 0) && highlightedRangeWidth(textRanges) < highlightedRangeWidth(identifierRanges))
      return textRanges;
    return identifierRanges;
  }
  return textRanges ?? identifierRanges;
}
function highlightedRangeWidth(ranges) {
  let width = 0;
  for (const [start, end] of ranges.removed) width += end - start;
  for (const [start, end] of ranges.added) width += end - start;
  return width;
}
function shouldSuppressUnbalancedIdentifierPartRefinement(beforeToken, afterToken, textRanges) {
  if (textRanges) return false;
  if (!isIdentifierToken(beforeToken.value) || !isIdentifierToken(afterToken.value)) return false;
  const beforePartCount = splitIdentifierToken(beforeToken.value, 0).filter(
    (part) => isIdentifierSimilarityPart(part.value)
  ).length;
  const afterPartCount = splitIdentifierToken(afterToken.value, 0).filter(
    (part) => isIdentifierSimilarityPart(part.value)
  ).length;
  return Math.min(beforePartCount, afterPartCount) === 1 && beforePartCount !== afterPartCount;
}
function refinedSoftTokenGroupRanges(beforeTokens, beforeGroup, afterTokens, afterGroup) {
  const before = beforeTokens.slice(beforeGroup.start, beforeGroup.end);
  const after = afterTokens.slice(afterGroup.start, afterGroup.end);
  if (before.length * after.length > MAX_SOFT_TOKEN_ALIGNMENT_CELLS) return void 0;
  const pairs = softAlignedTokenPairs(before, after);
  if (pairs.length === 0) return void 0;
  const pairedBefore = /* @__PURE__ */ new Set();
  const pairedAfter = /* @__PURE__ */ new Set();
  const removed = [];
  const added = [];
  for (const [beforeIndex, afterIndex] of pairs) {
    pairedBefore.add(beforeIndex);
    pairedAfter.add(afterIndex);
    const beforeToken = tokenAt2(before, beforeIndex);
    const afterToken = tokenAt2(after, afterIndex);
    if (beforeToken.value === afterToken.value) continue;
    const refined = refinedTokenPairRanges(beforeToken, afterToken);
    if (refined) {
      removed.push(...refined.removed);
      added.push(...refined.added);
    } else {
      pushTokenRange(removed, beforeToken);
      pushTokenRange(added, afterToken);
    }
  }
  for (let index = 0; index < before.length; index++) {
    if (!pairedBefore.has(index)) pushTokenRange(removed, tokenAt2(before, index));
  }
  for (let index = 0; index < after.length; index++) {
    if (!pairedAfter.has(index)) pushTokenRange(added, tokenAt2(after, index));
  }
  const result = { removed: mergeRangesByStart(removed), added: mergeRangesByStart(added) };
  return result.removed.length > 0 || result.added.length > 0 ? result : void 0;
}
function softAlignedTokenPairs(before, after) {
  return suffixAlignedPairs(before.length, after.length, (beforeIndex, afterIndex) => {
    const substitution = softTokenSubstitutionWeight(
      tokenAt2(before, beforeIndex),
      tokenAt2(after, afterIndex)
    );
    return substitution > 0 ? substitution : Number.NEGATIVE_INFINITY;
  });
}
function softTokenSubstitutionWeight(beforeToken, afterToken) {
  if (beforeToken.value === afterToken.value) return wordEmphasisTokenWeight(beforeToken.value);
  const similarity = softTokenSimilarity(beforeToken.value, afterToken.value);
  return similarity >= MIN_SOFT_TOKEN_SUBSTITUTION_SIMILARITY ? Math.min(
    wordEmphasisTokenWeight(beforeToken.value),
    wordEmphasisTokenWeight(afterToken.value)
  ) * similarity : 0;
}
function softTokenSimilarity(before, after) {
  if (isIdentifierToken(before) && isIdentifierToken(after))
    return identifierTokenSimilarity(before, after);
  if (isNumberToken(before) && isNumberToken(after)) return edgeTextSimilarity(before, after);
  if (isMeaningfulOperatorToken(before) && isMeaningfulOperatorToken(after))
    return edgeTextSimilarity(before, after);
  return 0;
}
function identifierTokenSimilarity(before, after) {
  const beforeParts = splitIdentifierToken(before, 0).map((part) => part.value.toLowerCase()).filter(isIdentifierSimilarityPart);
  const afterParts = splitIdentifierToken(after, 0).map((part) => part.value.toLowerCase()).filter(isIdentifierSimilarityPart);
  const partSimilarity = tokenDiceSimilarity(beforeParts, afterParts);
  return Math.max(partSimilarity, edgeTextSimilarity(before, after));
}
function tokenDiceSimilarity(before, after) {
  if (before.length === 0 || after.length === 0) return 0;
  const remaining = /* @__PURE__ */ new Map();
  for (const token of before) remaining.set(token, (remaining.get(token) ?? 0) + 1);
  let shared = 0;
  for (const token of after) {
    const count = remaining.get(token) ?? 0;
    if (count === 0) continue;
    shared++;
    if (count === 1) remaining.delete(token);
    else remaining.set(token, count - 1);
  }
  return 2 * shared / (before.length + after.length);
}
function edgeTextSimilarity(before, after) {
  const prefix = commonPrefixLength(before, after);
  const suffix = commonSuffixLength(before, after, prefix);
  return 2 * (prefix + suffix) / (before.length + after.length);
}
function refinedIdentifierTokenRanges(beforeToken, afterToken) {
  if (!isIdentifierToken(beforeToken.value) || !isIdentifierToken(afterToken.value))
    return void 0;
  const beforeParts = splitIdentifierToken(beforeToken.value, beforeToken.start);
  const afterParts = splitIdentifierToken(afterToken.value, afterToken.start);
  if (beforeParts.length <= 1 && afterParts.length <= 1) return void 0;
  const gaps = [];
  collectChangedTokenGaps(
    beforeParts,
    0,
    beforeParts.length,
    afterParts,
    0,
    afterParts.length,
    gaps
  );
  const ranges = refinedRangesForTokenGaps(beforeParts, afterParts, gaps);
  return hasWordChangeRanges(ranges) ? ranges : void 0;
}
function isNarrowerThanWholeTokens(ranges, beforeToken, afterToken) {
  return ranges.removed.some((range) => range[0] > beforeToken.start || range[1] < beforeToken.end) || ranges.added.some((range) => range[0] > afterToken.start || range[1] < afterToken.end) || ranges.removed.length === 0 || ranges.added.length === 0;
}
function hasWordChangeRanges(ranges) {
  return ranges.removed.length > 0 || ranges.added.length > 0;
}
function tokenAt2(tokens, index) {
  const token = tokens[index];
  if (token === void 0) throw new RangeError(`Missing word-emphasis token ${index}`);
  return token;
}

// src/ui/word-diff/smart-filter.ts
function filterLowSignalWordEmphasis(before, after, ranges) {
  const hasRemovedSignal = ranges.removed.some((range) => hasSmartRangeSignal(before, range));
  const hasAddedSignal = ranges.added.some((range) => hasSmartRangeSignal(after, range));
  return {
    removed: ranges.removed.filter(
      (range) => shouldKeepSmartRange(before.slice(range[0], range[1]), hasAddedSignal)
    ),
    added: ranges.added.filter(
      (range) => shouldKeepSmartRange(after.slice(range[0], range[1]), hasRemovedSignal)
    )
  };
}
function hasSmartRangeSignal(content, range) {
  const tokens = wordTokenValues(content.slice(range[0], range[1]));
  return tokens.some(isSmartSignalToken);
}
function shouldKeepSmartRange(text, oppositeSideHasSignal) {
  const tokens = wordTokenValues(text);
  const signalTokens = tokens.filter(isSmartSignalToken);
  if (signalTokens.length === 0) return false;
  const wordTokens = signalTokens.filter(
    (token) => isIdentifierToken(token) || isNumberToken(token)
  );
  const hasIntrinsicSignal = signalTokens.some(
    (token) => isMeaningfulOperatorToken(token) || isSymbolToken(token)
  );
  if (!oppositeSideHasSignal && !hasIntrinsicSignal && wordTokens.every((token) => LOW_SIGNAL_SYNTAX_TOKENS.has(token)))
    return false;
  if (!oppositeSideHasSignal && !hasIntrinsicSignal && isWrapperCallNoise(text, wordTokens))
    return false;
  return true;
}
function isSmartSignalToken(token) {
  return isIdentifierToken(token) || isNumberToken(token) || isMeaningfulOperatorToken(token) || isSymbolToken(token);
}
var LOW_SIGNAL_SYNTAX_TOKENS = /* @__PURE__ */ new Set([
  "as",
  "const",
  "else",
  "export",
  "from",
  "function",
  "if",
  "import",
  "let",
  "var"
]);
var WRAPPER_CALL_TOKENS = /* @__PURE__ */ new Set(["filter", "flatMap", "forEach", "map", "reduce"]);
function isWrapperCallNoise(text, tokens) {
  return tokens.length === 1 && tokens[0] !== void 0 && WRAPPER_CALL_TOKENS.has(tokens[0]) && /^[\s.()[\]{};,]*[$_\p{L}][$_\p{L}\p{N}\p{Mark}]*[\s.()[\]{};,]*$/u.test(text);
}

// src/ui/word-diff/emphasis.ts
function shouldEmphasizeChangedPair(ranges, lineConfidence) {
  if (ranges.removed.length === 0 && ranges.added.length === 0) return false;
  if (lineConfidence === "low") return false;
  if (ranges.confidence === "low" && lineConfidence !== "high") return false;
  return true;
}
function changedRangesForTokensWithConfidence(before, after, beforeTokens, afterTokens, wordEmphasis) {
  if (wordEmphasis === "off") return emptyWordChangeRanges();
  const gaps = [];
  const alignmentConfidence = collectChangedTokenGaps(
    beforeTokens,
    0,
    beforeTokens.length,
    afterTokens,
    0,
    afterTokens.length,
    gaps
  );
  const ranges = refinedRangesForChangedTokens(before, beforeTokens, after, afterTokens, gaps);
  const confidence = hasWordChangeRanges2(ranges) ? alignmentConfidence : "low";
  if (wordEmphasis !== "smart") return { ...ranges, confidence };
  const filtered = filterLowSignalWordEmphasis(before, after, ranges);
  return { ...filtered, confidence: hasWordChangeRanges2(filtered) ? confidence : "low" };
}
function hasWordChangeRanges2(ranges) {
  return ranges.removed.length > 0 || ranges.added.length > 0;
}
function emptyWordChangeRanges() {
  return { removed: [], added: [], confidence: "low" };
}

// src/ui/word-diff/change-block.ts
function analyzeChangedLineBlock(block, wordEmphasis) {
  const removed = [];
  const added = [];
  for (let index = 0; index < block.length; index++) {
    const line = block[index];
    if (line === void 0) continue;
    if (isRemovedDiffLine(line)) removed.push(indexedChangedLine(index, line));
    else if (isAddedDiffLine(line)) added.push(indexedChangedLine(index, line));
  }
  const removedByIndex = new Map(removed.map((line) => [line.index, line]));
  const addedByIndex = new Map(added.map((line) => [line.index, line]));
  const pairs = matchChangedLines(removed, added);
  const ranges = [];
  for (const pair of pairs) {
    const removedLine = removedByIndex.get(pair.removedIndex);
    const addedLine = addedByIndex.get(pair.addedIndex);
    if (!removedLine || !addedLine) continue;
    ranges.push({
      pair,
      ranges: changedRangesForTokensWithConfidence(
        normalizedChangedContent(removedLine),
        normalizedChangedContent(addedLine),
        changedLineTokens(removedLine),
        changedLineTokens(addedLine),
        wordEmphasis
      )
    });
  }
  return { removed, added, pairs, ranges };
}

// src/ui/word-diff/line-emphasis.ts
var changedLineEmphasis = (block, wordEmphasis) => {
  const emphasis = /* @__PURE__ */ new Map();
  if (wordEmphasis === "off") return emphasis;
  for (const { pair, ranges } of analyzeChangedLineBlock(block, wordEmphasis).ranges) {
    if (!shouldEmphasizeChangedPair(ranges, pair.confidence)) continue;
    emphasis.set(pair.removedIndex, { ranges: ranges.removed, kind: "remove" });
    emphasis.set(pair.addedIndex, { ranges: ranges.added, kind: "add" });
  }
  return emphasis;
};

// src/ui/core-tool-render.ts
var CORE_TOOLS = /* @__PURE__ */ new Set(["bash", "read", "write", "edit", "grep", "find", "ls"]);
var isCoreToolAudit = (audit) => audit.tool !== void 0 && CORE_TOOLS.has(audit.tool) && (audit.provider === "pi" || audit.ref === `pi.${audit.tool}`);
var positiveEnvInteger = (name, fallback) => {
  const parsed = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
var SECRET_SCAN_CHARS = positiveEnvInteger("CODE_PREVIEW_SECRET_SCAN_CHARS", 2e5);
var MAX_HIGHLIGHT_CHARS2 = positiveEnvInteger("CODE_PREVIEW_MAX_HIGHLIGHT_CHARS", 8e4);
var CONTENT_LANGUAGE_DETECTION_CHARS = positiveEnvInteger(
  "CODE_PREVIEW_CONTENT_LANGUAGE_DETECTION_CHARS",
  5e4
);
var recordOf = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
var stringOf = (value) => typeof value === "string" ? value : void 0;
var numberOf = (value) => typeof value === "number" && Number.isFinite(value) ? value : void 0;
var argString = (audit, key) => stringOf(audit.args?.[key]);
var escapeControlChars3 = (text) => text.replace(/\x1b/g, "\u241B").replace(/\r/g, "\u240D").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, "\uFFFD");
var expandTabs = (text) => text.replace(/\t/g, "    ");
var formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10 * 1024 ? 1 : 0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
var countLabel = (count, singular) => `${count} ${count === 1 ? singular : `${singular}s`}`;
var metadata = (theme, values) => {
  const present = values.filter((value) => Boolean(value));
  return present.length > 0 ? theme.fg("dim", ` \xB7 ${present.join(" \xB7 ")}`) : "";
};
var formatDisplayPath = (filePath, cwd) => {
  if (!filePath) return "";
  if (isAbsolute(filePath)) {
    const fromCwd = relative(cwd, filePath);
    if (fromCwd && fromCwd !== ".." && !fromCwd.startsWith("../") && !isAbsolute(fromCwd)) {
      return fromCwd;
    }
    if (!fromCwd) return ".";
    const fromHome = relative(homedir(), filePath);
    if (fromHome && fromHome !== ".." && !fromHome.startsWith("../") && !isAbsolute(fromHome)) {
      return `~/${fromHome}`;
    }
    if (!fromHome) return "~";
  }
  return filePath;
};
var renderPath = (filePath, cwd, theme, fallback = "...") => theme.fg("accent", escapeControlChars3(formatDisplayPath(filePath, cwd) || fallback));
var normalizedResult = (audit) => {
  const preview = recordOf(audit.preview);
  return preview && "result" in preview ? preview.result : audit.result;
};
var contentOutput = (value) => {
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return void 0;
  const text = value.flatMap((part) => {
    const record = recordOf(part);
    return record?.type === "text" && typeof record.text === "string" ? [record.text] : [];
  }).join("\n");
  return text || void 0;
};
var resultOutput = (audit) => {
  const result = normalizedResult(audit);
  if (typeof result === "string") return result;
  const record = recordOf(result);
  return stringOf(record?.output) ?? stringOf(record?.text) ?? contentOutput(record?.content);
};
var resultDetails = (audit) => {
  const preview = recordOf(audit.preview);
  const previewDetails = recordOf(preview?.details);
  if (previewDetails) return previewDetails;
  return recordOf(recordOf(normalizedResult(audit))?.details);
};
var nativeTruncated = (audit) => {
  const truncation = recordOf(resultDetails(audit)?.truncation);
  return truncation?.truncated === true || audit.resultTruncated === true;
};
var READ_CONTINUATION_NOTICE = /^\[(?:Showing lines \d+-\d+ of \d+(?: \([^)]+\))?|\d+ more lines in file)\. Use offset=\d+ to continue\.\]$/;
var splitReadContinuationNotice = (text) => {
  const match = /^(.*?)(?:\r?\n){2}(\[[^\r\n]+\])$/s.exec(text);
  const notice = match?.[2];
  if (!match || !notice || !READ_CONTINUATION_NOTICE.test(notice)) return { content: text };
  return { content: match[1] ?? "", notice: notice.slice(1, -1) };
};
var toolLimit = (audit, options) => {
  if (options.expanded) return options.maxLines;
  const configured = (() => {
    switch (audit.tool) {
      case "read":
        return options.settings.readCollapsedLines;
      case "write":
        return options.settings.writeCollapsedLines;
      case "edit":
        return options.settings.editCollapsedLines === "all" ? options.maxLines : options.settings.editCollapsedLines;
      case "grep":
        return options.settings.grepCollapsedLines;
      case "find":
      case "ls":
        return options.settings.pathListCollapsedLines;
      case "bash":
        return 8;
      default:
        return options.maxLines;
    }
  })();
  return Math.max(1, Math.min(configured, options.maxLines));
};
var previewEntries = (lines, limit) => {
  if (limit <= 0 || lines.length <= limit) {
    return { entries: lines.map((line, index) => ({ kind: "line", line, index })), hidden: 0 };
  }
  if (limit < 8) {
    return {
      entries: lines.slice(0, limit).map((line, index) => ({ kind: "line", line, index })),
      hidden: lines.length - limit
    };
  }
  const head = Math.ceil(limit * 0.65);
  const tail = Math.max(1, limit - head - 1);
  const hidden = lines.length - head - tail;
  return {
    entries: [
      ...lines.slice(0, head).map((line, index) => ({ kind: "line", line, index })),
      { kind: "hidden", hidden },
      ...lines.slice(-tail).map((line, offset) => ({
        kind: "line",
        line,
        index: lines.length - tail + offset
      }))
    ],
    hidden
  };
};
var secretWarnings = (source) => {
  if (!source) return [];
  const sample = source.length <= SECRET_SCAN_CHARS ? source : `${source.slice(0, SECRET_SCAN_CHARS / 2)}
${source.slice(-SECRET_SCAN_CHARS / 2)}`;
  const warnings = [
    ["private key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
    ["AWS secret key", /\bAWS_SECRET_ACCESS_KEY\s*=\s*["']?[^\s'"]{12,}/i],
    [
      "API key",
      /\b(?:OPENAI|ANTHROPIC|GOOGLE|GEMINI|MISTRAL|GROQ|TOGETHER|PERPLEXITY|XAI)_API_KEY\s*=\s*["']?[^\s'"]{12,}/i
    ],
    ["GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/],
    ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/]
  ];
  return warnings.filter(([, pattern]) => pattern.test(sample)).map(([label]) => label);
};
var warningLine = (source, options, theme) => {
  if (!options.settings.secretWarnings) return void 0;
  const warnings = secretWarnings(source);
  return warnings.length > 0 ? theme.fg("warning", `\u26A0 Preview ${countLabel(warnings.length, "warning")}: possible ${warnings.join(", ")}`) : void 0;
};
var resolveLanguage = (filePath, content) => {
  const fromPath = languageFromPath(filePath);
  if (fromPath) return fromPath;
  const firstLine = content?.split("\n", 1)[0]?.trim();
  if (firstLine?.startsWith("#!")) {
    const parts = firstLine.replace(/^#!\s*/, "").split(/\s+/).filter(Boolean);
    const envIndex = parts.findIndex((part) => part.split("/").at(-1) === "env");
    const command = envIndex >= 0 ? parts.slice(envIndex + 1).find((part) => !part.startsWith("-")) : parts[0];
    const executable = command?.split("/").at(-1)?.toLowerCase().replace(/\d+(?:\.\d+)?$/, "");
    const shebang = {
      bash: "bash",
      sh: "bash",
      zsh: "bash",
      python: "python",
      node: "javascript",
      deno: "typescript",
      ruby: "ruby",
      php: "php"
    };
    const language = executable ? shebang[executable] : void 0;
    if (language && language in bundledLanguages2) return language;
  }
  if (!content || content.length > CONTENT_LANGUAGE_DETECTION_CHARS) return void 0;
  const trimmed = content.trim();
  if (!trimmed) return void 0;
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      JSON.parse(trimmed);
      return "json";
    } catch {
    }
  }
  if (/^<(!doctype\s+html|html)(\s|>)/i.test(trimmed)) return "html";
  if (/^<\?xml\s/i.test(trimmed)) return "xml";
  return void 0;
};
var BASH_TRUNCATION_NOTICE = /^\[Showing (?:last [^\r\n]+ of line \d+ \(line is [^)]+\)|lines \d+-\d+ of \d+(?: \([^)]+ limit\))?)\. Full output: [^\r\n]+\]$/;
var isBashTruncationNotice = (line) => BASH_TRUNCATION_NOTICE.test(line);
var renderContent = (content, filePath, theme, options, config) => {
  const limit = toolLimit({ ref: "", tool: config.lineNumbers ? "read" : "write" }, options);
  const selected = selectPreviewTextLines(content, limit);
  if (selected.total === 0) {
    return { lines: [theme.fg("muted", config.emptyLabel)], hidden: 0 };
  }
  const skipHighlight = options.settings.syntaxHighlighting && content.length > MAX_HIGHLIGHT_CHARS2;
  const language = options.settings.syntaxHighlighting && !skipHighlight ? resolveLanguage(filePath, content) : void 0;
  const rendered = [];
  const warning = warningLine(content, options, theme);
  if (warning) rendered.push(warning);
  const absoluteFilePath = language && filePath ? resolve(options.cwd, filePath) : void 0;
  let chunk = [];
  const flush = () => {
    if (chunk.length === 0) return;
    const normalized = chunk.map((entry) => expandTabs(escapeControlChars3(entry.line)));
    const first = chunk[0];
    const from = (config.firstLine ?? 1) - 1 + first.index;
    const fileLines = absoluteFilePath && language && first.index + chunk.length <= selected.total ? highlightFileLines(
      absoluteFilePath,
      language,
      from,
      from + chunk.length,
      options.invalidate
    ) : null;
    const fileVerified = fileLines !== null && fileLines.every((line, index) => line.raw === normalized[index]);
    const highlighted = fileVerified ? fileLines.map((line) => line.ansi) : language ? highlightCode(normalized.join("\n"), language, options.invalidate) : null;
    const width = String((config.firstLine ?? 1) + selected.total - 1).length;
    for (let index = 0; index < chunk.length; index++) {
      const entry = chunk[index];
      const text = highlighted?.[index] ?? theme.fg("toolOutput", normalized[index] || " ");
      if (config.lineNumbers) {
        const lineNumber = String((config.firstLine ?? 1) + entry.index).padStart(width, " ");
        rendered.push(`${theme.fg("dim", `${lineNumber} \u2502 `)}${text}`);
      } else {
        rendered.push(text);
      }
    }
    chunk = [];
  };
  for (const entry of selected.entries) {
    if (entry.kind === "hidden") {
      flush();
      rendered.push(theme.fg("muted", `      --- ${entry.hidden} lines hidden ---`));
    } else if (isBashTruncationNotice(entry.line)) {
      flush();
      const notice = theme.fg("muted", escapeControlChars3(entry.line));
      if (config.lineNumbers) {
        const width = String((config.firstLine ?? 1) + selected.total - 1).length;
        const lineNumber = String((config.firstLine ?? 1) + entry.index).padStart(width, " ");
        rendered.push(`${theme.fg("dim", `${lineNumber} \u2502 `)}${notice}`);
      } else {
        rendered.push(notice);
      }
    } else {
      chunk.push({ line: entry.line, index: entry.index });
    }
  }
  flush();
  if (skipHighlight) pushArcItem(rendered, arcItem(theme, config.skipLabel));
  return { lines: rendered, hidden: selected.hidden };
};
var firstShellCommandName = (command) => {
  const words = [];
  let index = 0;
  while (index < command.length && words.length < 8) {
    while (index < command.length && /\s/.test(command[index] ?? "")) index++;
    if (index >= command.length || "|&;()<>{}".includes(command[index] ?? "")) break;
    let word = "";
    while (index < command.length) {
      const character = command[index] ?? "";
      if (/\s/.test(character) || "|&;()<>{}".includes(character)) break;
      if (character === "'" || character === '"') {
        const quote = character;
        index++;
        while (index < command.length && command[index] !== quote) {
          if (quote === '"' && command[index] === "\\") index++;
          word += command[index] ?? "";
          index++;
        }
        if (index < command.length) index++;
        continue;
      }
      if (character === "\\") {
        index++;
        word += command[index] ?? "";
        index++;
        continue;
      }
      word += character;
      index++;
    }
    if (word) words.push(word);
  }
  const commandWord = words.find((word) => !/^[A-Za-z_][A-Za-z0-9_]*=.*/.test(word));
  return commandWord?.split("/").at(-1);
};
var bashWarnings = (command) => {
  const compact = command.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim();
  const warnings = [
    [
      "recursive delete",
      /\brm\b(?=[^;&|]*(?:-[\w-]*r[\w-]*|--recursive)\b)(?=[^;&|]*(?:-[\w-]*f[\w-]*|--force)\b)/i
    ],
    ["elevated privileges", /(^|[;&|]\s*)sudo\b/],
    ["recursive permission change", /\bchmod\s+(?:-[\w-]*R|--recursive)\b/],
    ["recursive ownership change", /\bchown\s+(?:-[\w-]*R|--recursive)\b/],
    ["searches entire filesystem", /\bfind\b(?:\s+-[\w-]+)*\s+\/+(?=\s|$)/],
    ["searches entire home directory", /\bfind\b(?:\s+-[\w-]+)*\s+~\/?(?=\s|$)/],
    ["discards git changes", /\bgit\s+reset\s+--hard\b/],
    ["removes untracked files", /\bgit\s+clean\s+-[\w-]*[fd][\w-]*\b/],
    ["removes Docker data", /\bdocker\s+system\s+prune\b/],
    ["writes to a system path", />{1,2}\s*\/?(?:etc|bin|sbin|usr|var|System|Library)\b/]
  ];
  return warnings.filter(([, pattern]) => pattern.test(compact)).map(([label]) => label);
};
var injectVisibleRanges = (ansi, ranges, open, close) => {
  const sorted = ranges.filter(([start, end]) => end > start).sort((a, b) => a[0] - b[0]);
  let out = "";
  let visible = 0;
  let active = false;
  let rangeIndex = 0;
  for (let index = 0; index < ansi.length; index++) {
    if (ansi[index] === "\x1B" && ansi[index + 1] === "[") {
      const end = ansi.indexOf("m", index + 2);
      if (end >= 0) {
        const sequence = ansi.slice(index, end + 1);
        out += sequence;
        if (active && (sequence === "\x1B[39m" || sequence === "\x1B[22m")) out += open;
        index = end;
        continue;
      }
    }
    while (rangeIndex < sorted.length && visible >= sorted[rangeIndex][1]) {
      if (active) out += close;
      active = false;
      rangeIndex++;
    }
    const range = sorted[rangeIndex];
    if (!active && range && visible >= range[0] && visible < range[1]) {
      out += open;
      active = true;
    }
    out += ansi[index];
    visible++;
  }
  if (active) out += close;
  return out;
};
var wordEmphasisFor = (parsed, mode) => {
  const emphasis = /* @__PURE__ */ new Map();
  let start = 0;
  while (start < parsed.length) {
    if (!parsed[start] || parsed[start].kind === " ") {
      start++;
      continue;
    }
    let end = start;
    while (end < parsed.length && parsed[end] && parsed[end].kind !== " ") end++;
    const block = parsed.slice(start, end);
    for (const [index, value] of changedLineEmphasis(block, mode)) {
      emphasis.set(start + index, value);
    }
    start = end;
  }
  return emphasis;
};
var summarizeDiff = (diff) => {
  let additions = 0;
  let removals = 0;
  let replacements = 0;
  let insertions = 0;
  let deletions = 0;
  let hunks = 0;
  let groupAdditions = 0;
  let groupRemovals = 0;
  const flush = () => {
    if (groupAdditions === 0 && groupRemovals === 0) return;
    hunks++;
    if (groupAdditions > 0 && groupRemovals > 0) {
      replacements++;
      insertions += Math.max(0, groupAdditions - groupRemovals);
      deletions += Math.max(0, groupRemovals - groupAdditions);
    } else if (groupAdditions > 0) insertions += groupAdditions;
    else deletions += groupRemovals;
    groupAdditions = 0;
    groupRemovals = 0;
  };
  const lines = diff.split("\n");
  for (const line of lines) {
    if (line.startsWith("+") && !line.startsWith("+++")) {
      additions++;
      groupAdditions++;
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      removals++;
      groupRemovals++;
    } else {
      flush();
    }
  }
  flush();
  return { additions, removals, replacements, insertions, deletions, totalLines: lines.length, hunks };
};
var describeDiffShape = (summary) => {
  const parts = [];
  if (summary.replacements > 0) parts.push(countLabel(summary.replacements, "replacement"));
  if (summary.insertions > 0) parts.push(countLabel(summary.insertions, "insertion"));
  if (summary.deletions > 0) parts.push(countLabel(summary.deletions, "deletion"));
  return parts.length > 0 ? parts.join(", ") : "changes";
};
var createSimpleDiff = (before, after) => {
  const changes = diffLines(before, after);
  const hasChangeAfter = changes.map(() => false);
  let futureChange = false;
  for (let index = changes.length - 1; index >= 0; index--) {
    hasChangeAfter[index] = futureChange;
    const change = changes[index];
    if (change.added || change.removed) futureChange = true;
  }
  const out = [];
  let oldLine = 1;
  let newLine = 1;
  let changed = false;
  let firstChangedLine = 1;
  const context = 3;
  const contextLines = (lines, oldStart) => lines.map((line, offset) => ` ${oldStart + offset} ${line}`);
  for (let index = 0; index < changes.length; index++) {
    const change = changes[index];
    const lines = change.value.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
    if (lines.at(-1) === "") lines.pop();
    if (!change.added && !change.removed) {
      const later = hasChangeAfter[index] ?? false;
      if (!changed && later) {
        const start = Math.max(0, lines.length - context);
        out.push(...contextLines(lines.slice(start), oldLine + start));
      } else if (changed) {
        if (later && lines.length > context * 2) {
          out.push(...contextLines(lines.slice(0, context), oldLine));
          out.push("...");
          out.push(...contextLines(lines.slice(-context), oldLine + lines.length - context));
        } else {
          out.push(...contextLines(lines.slice(0, later ? lines.length : context), oldLine));
        }
      }
      oldLine += lines.length;
      newLine += lines.length;
      continue;
    }
    if (!changed) firstChangedLine = newLine;
    changed = true;
    for (const line of lines) {
      if (change.removed) out.push(`-${oldLine++} ${line}`);
      else out.push(`+${newLine++} ${line}`);
    }
  }
  return out.length > 0 ? [`@@ ${firstChangedLine} @@`, ...out].join("\n") : "";
};
var hashSourceText = (value) => {
  let hash = 5381;
  for (let index = 0; index < value.length; index++) {
    hash = (hash << 5) + hash + value.charCodeAt(index) | 0;
  }
  return hash;
};
var DIFF_REMOVED_CONTEXT_LINES = 512;
var postEditFileRows = (parsed) => {
  const rows = [];
  let lineDelta = 0;
  for (let index = 0; index < parsed.length; index++) {
    const line = parsed[index];
    if (!line) continue;
    const lineNumber = Number.parseInt(line.lineNumber.trim(), 10);
    if (line.kind === "+") {
      if (Number.isFinite(lineNumber) && lineNumber > 0) rows.push({ index, lineNumber });
      lineDelta++;
    } else if (line.kind === "-") {
      lineDelta--;
    } else if (Number.isFinite(lineNumber)) {
      const translated = lineNumber + lineDelta;
      if (translated > 0) rows.push({ index, lineNumber: translated });
    }
  }
  return rows;
};
var highlightRemovedDiffLines = (parsed, filePath, language, cwd, invalidate) => {
  let start = 0;
  while (start < parsed.length && !parsed[start]) start++;
  let end = start;
  while (end < parsed.length && parsed[end]) end++;
  const block = parsed.slice(start, end);
  const removed = [];
  const contextBefore = [];
  for (let offset = 0; offset < block.length; offset++) {
    const line = block[offset];
    const n = Number.parseInt(line.lineNumber.trim(), 10);
    if (!Number.isFinite(n) || n <= 0) continue;
    if (line.kind === "-") removed.push({ row: start + offset, n, content: expandTabs(line.content) });
    else if (line.kind === " " && removed.length === 0) contextBefore.push({ n, content: expandTabs(line.content) });
  }
  if (removed.length === 0) return null;
  for (let index = 1; index < removed.length; index++) {
    if (removed[index].n !== removed[index - 1].n + 1) return null;
  }
  const firstRemoved = removed[0].n;
  for (let index = 1; index < contextBefore.length; index++) {
    if (contextBefore[index].n !== contextBefore[index - 1].n + 1) return null;
  }
  if (contextBefore.length > 0 && contextBefore[contextBefore.length - 1].n !== firstRemoved - 1) {
    return null;
  }
  const anchor = contextBefore.length > 0 ? contextBefore[0].n : firstRemoved;
  const absolute = resolve(cwd, filePath);
  let stat;
  try {
    stat = statSync2(absolute);
  } catch {
    return null;
  }
  if (!stat.isFile() || stat.size > MAX_HIGHLIGHT_CHARS2) return null;
  let text;
  try {
    text = readFileSync2(absolute, "utf8");
  } catch {
    return null;
  }
  if (text.includes("\0")) return null;
  const fileLines = text.replace(/\r\n?/g, "\n").split("\n").map(expandTabs);
  for (const line of block) {
    if (line.kind !== " ") continue;
    const n = Number.parseInt(line.lineNumber.trim(), 10);
    if (!Number.isFinite(n)) continue;
    if (fileLines[n - 1] !== expandTabs(line.content)) return null;
  }
  const prefixCount = Math.max(0, Math.min(anchor - 1, DIFF_REMOVED_CONTEXT_LINES));
  const prefix = fileLines.slice(anchor - 1 - prefixCount, anchor - 1);
  const removedContents = removed.map((row) => row.content);
  const contextContents = contextBefore.map((context) => context.content);
  const virtual = [...prefix, ...contextContents, ...removedContents];
  const cacheKey = `removed\0${language}\0${absolute}\0${hashSourceText(virtual.join("\n"))}`;
  const covered = highlightSourceLines(
    cacheKey,
    virtual,
    language,
    prefixCount,
    virtual.length,
    invalidate
  );
  if (!covered) return null;
  const out = /* @__PURE__ */ new Map();
  for (let index = 0; index < removed.length; index++) {
    const entry = covered[contextContents.length + index];
    if (entry && entry.raw === removed[index].content) out.set(removed[index].row, entry.ansi);
  }
  return out;
};
var renderDiff = (diff, filePath, theme, options, limitOverride) => {
  if (!diff) return { lines: [], hidden: 0 };
  const sourceLines = diff.split("\n");
  const limit = Math.max(1, Math.min(limitOverride ?? toolLimit({ ref: "", tool: "edit" }, options), options.maxLines));
  const shown = sourceLines.slice(0, limit);
  const hidden = sourceLines.length - shown.length;
  const parsed = shown.map(parseDiffLine);
  const width = diffLineNumberWidth(parsed);
  const skipHighlight = options.settings.syntaxHighlighting && diff.length > MAX_HIGHLIGHT_CHARS2;
  const language = options.settings.syntaxHighlighting && !skipHighlight ? resolveLanguage(filePath) : void 0;
  const highlighted = Array.from({ length: shown.length }, () => void 0);
  if (language) {
    if (filePath) {
      const numbered = postEditFileRows(parsed);
      if (numbered.length > 0) {
        let from = numbered[0].lineNumber;
        let to = from;
        for (let index = 1; index < numbered.length; index++) {
          const lineNumber = numbered[index].lineNumber;
          from = Math.min(from, lineNumber);
          to = Math.max(to, lineNumber);
        }
        from--;
        to++;
        const slice = highlightFileLines(
          resolve(options.cwd, filePath),
          language,
          from,
          to,
          options.invalidate
        );
        if (slice) {
          for (const row of numbered) {
            const entry = slice[row.lineNumber - 1 - from];
            if (entry && entry.raw === expandTabs(parsed[row.index].content)) {
              highlighted[row.index] = entry.ansi;
            }
          }
        }
      }
      const removedHighlighted = highlightRemovedDiffLines(
        parsed,
        filePath,
        language,
        options.cwd,
        options.invalidate
      );
      if (removedHighlighted) {
        for (const [row, ansi] of removedHighlighted) {
          if (highlighted[row] === void 0) highlighted[row] = ansi;
        }
      }
    }
    let start = 0;
    while (start < parsed.length) {
      if (!parsed[start] || highlighted[start] !== void 0) {
        start++;
        continue;
      }
      let end = start;
      while (end < parsed.length && parsed[end] && highlighted[end] === void 0) end++;
      const oldOffsets = [];
      const newOffsets = [];
      const oldContent = [];
      const newContent = [];
      for (let offset = start; offset < end; offset++) {
        const line = parsed[offset];
        const content = expandTabs(line.content);
        if (line.kind !== "+") {
          oldOffsets.push(offset);
          oldContent.push(content);
        }
        if (line.kind !== "-") {
          newOffsets.push(offset);
          newContent.push(content);
        }
      }
      const oldRendered = oldContent.length ? highlightCode(oldContent.join("\n"), language, options.invalidate) : null;
      if (oldRendered) {
        for (let index = 0; index < oldOffsets.length; index++) {
          highlighted[oldOffsets[index]] = oldRendered[index];
        }
      }
      const newRendered = newContent.length ? highlightCode(newContent.join("\n"), language, options.invalidate) : null;
      if (newRendered) {
        for (let index = 0; index < newOffsets.length; index++) {
          highlighted[newOffsets[index]] = newRendered[index];
        }
      }
      start = end;
    }
  }
  const emphasis = wordEmphasisFor(parsed, options.settings.wordEmphasis);
  const emphasisColors = effectiveShikiThemeIsLight() ? { add: "\x1B[48;2;194;209;194m", remove: "\x1B[48;2;216;182;182m" } : { add: "\x1B[48;2;64;132;82m", remove: "\x1B[48;2;148;62;70m" };
  const lines = shown.map((raw, index) => {
    const line = parsed[index];
    if (!line) {
      const safe = escapeControlChars3(raw);
      const trimmed = safe.trim();
      if (trimmed === "...") return theme.fg("muted", "      --- unchanged lines hidden ---");
      if (trimmed.startsWith("@@")) return theme.fg("accent", theme.bold(safe));
      if (trimmed.startsWith("---") || trimmed.startsWith("+++") || trimmed.startsWith("diff ") || trimmed.startsWith("index ")) {
        return theme.fg("muted", safe);
      }
      return theme.fg("toolDiffContext", safe);
    }
    const truncationNotice = isBashTruncationNotice(line.content);
    let content = truncationNotice ? theme.fg("muted", escapeControlChars3(line.content)) : highlighted[index] ?? theme.fg("toolOutput", escapeControlChars3(expandTabs(line.content)) || " ");
    const match = truncationNotice ? void 0 : emphasis.get(index);
    if (match && match.ranges.length > 0) {
      content = injectVisibleRanges(
        content,
        match.ranges,
        match.kind === "add" ? emphasisColors.add : emphasisColors.remove,
        "\x1B[49m"
      );
    }
    const lineNumber = formatDiffLineNumber(line.lineNumber, width);
    if (line.kind === "+") {
      return markDiffLine("add", `${theme.fg("toolDiffAdded", `+${lineNumber} \u2502 `)}${content}`);
    }
    if (line.kind === "-") {
      return markDiffLine("remove", `${theme.fg("toolDiffRemoved", `-${lineNumber} \u2502 `)}${content}`);
    }
    return `\x1B[2m${theme.fg("toolDiffContext", ` ${lineNumber} \u2502 `)}${content}\x1B[22m`;
  });
  if (skipHighlight) {
    pushArcItem(lines, arcItem(theme, "Syntax highlighting skipped for large diff"));
  }
  return { lines, hidden };
};
var renderRead = (audit, theme, options) => {
  if (!options.expanded && !options.settings.readContentPreview) return null;
  const output = resultOutput(audit);
  if (output === void 0) return null;
  const filePath = argString(audit, "path") ?? "";
  if (/^Read image file/i.test(output)) {
    return { lines: [theme.fg("dim", escapeControlChars3(output))], hidden: 0 };
  }
  const truncated = nativeTruncated(audit);
  const { content, notice } = truncated || typeof audit.args?.limit === "number" ? splitReadContinuationNotice(output) : { content: output };
  const rendered = renderContent(content, filePath, theme, options, {
    lineNumbers: options.settings.readLineNumbers,
    firstLine: Math.max(1, Math.floor(numberOf(audit.args?.offset) ?? 1)),
    emptyLabel: "Empty file",
    skipLabel: "Syntax highlighting skipped for large file"
  });
  if (notice) pushArcItem(rendered.lines, arcItem(theme, notice));
  else if (truncated) pushArcItem(rendered.lines, arcItem(theme, "Output truncated by read"));
  return rendered;
};
var getWriteBefore = (audit) => {
  const details = resultDetails(audit);
  return details?.codePreviewBeforeWrite ?? recordOf(audit.preview)?.codePreviewBeforeWrite;
};
var bashCommand = (audit) => stringOf(recordOf(audit.preview)?.bashCommand) ?? argString(audit, "command") ?? "";
var writeContent = (audit) => stringOf(recordOf(audit.preview)?.writeContent) ?? argString(audit, "content");
var renderWrite = (audit, theme, options) => {
  if (!options.expanded && !options.settings.writeContentPreview) return null;
  const content = writeContent(audit);
  if (content === void 0) return null;
  const filePath = argString(audit, "path") ?? "";
  const before = getWriteBefore(audit);
  const beforeRecord = recordOf(before);
  if (audit.success === true && beforeRecord?.kind === "content") {
    const beforeContent = stringOf(beforeRecord.content);
    if (beforeContent === void 0) {
      return {
        lines: [
          theme.fg("success", "\u2713 Write applied") + theme.fg("muted", " \xB7 previous content unavailable")
        ],
        hidden: 0
      };
    }
    if (beforeContent === content) {
      return { lines: [theme.fg("muted", "\u2713 Write applied \xB7 no changes")], hidden: 0 };
    }
    if (shouldSkipWriteDiffBytes(beforeContent, content)) {
      return {
        lines: [
          theme.fg("success", "\u2713 Write applied") + theme.fg("muted", " \xB7 diff skipped for large content")
        ],
        hidden: 0
      };
    }
    if (shouldSkipWriteDiffComplexity(beforeContent, content)) {
      return {
        lines: [
          theme.fg("success", "\u2713 Write applied") + theme.fg("muted", " \xB7 diff skipped for complex rewrite")
        ],
        hidden: 0
      };
    }
    const diff = createSimpleDiff(beforeContent, content);
    const summary = summarizeDiff(diff);
    const header = `${theme.fg("success", "\u2713 Write applied")} ${theme.fg("muted", describeDiffShape(summary))}` + theme.fg("muted", " \xB7 ") + theme.fg("success", `+${summary.additions}`) + " " + theme.fg("error", `-${summary.removals}`);
    const rendered = renderDiff(diff, filePath, theme, options);
    return { lines: [header, ...rendered.lines], hidden: rendered.hidden };
  }
  if (audit.success === true && beforeRecord?.kind === "skipped") {
    let reason = stringOf(beforeRecord.reason) ?? "preview unavailable";
    const byteLength = numberOf(beforeRecord.byteLength);
    const maxBytes = numberOf(beforeRecord.maxBytes);
    if (byteLength !== void 0) {
      reason += beforeRecord.sizeExceeded === true && maxBytes !== void 0 ? ` (${formatBytes(byteLength)} > ${formatBytes(maxBytes)})` : ` (${formatBytes(byteLength)})`;
    }
    return {
      lines: [
        theme.fg("success", "\u2713 Write applied") + theme.fg("muted", ` \xB7 diff skipped: ${reason}`)
      ],
      hidden: 0
    };
  }
  if (audit.success === true && recordOf(audit.preview)?.writeBeforeCaptured === true && before === void 0) {
    const rendered = renderContent(content, filePath, theme, options, {
      emptyLabel: "Empty content",
      skipLabel: "Syntax highlighting skipped for large content"
    });
    return {
      lines: [
        theme.fg("success", `\u2713 New file (${countLabel(countContentLines(content), "line")})`),
        ...rendered.lines
      ],
      hidden: rendered.hidden
    };
  }
  return renderContent(content, filePath, theme, options, {
    emptyLabel: "Empty content",
    skipLabel: "Syntax highlighting skipped for large content"
  });
};
var editOperations = (audit) => {
  const edits = Array.isArray(audit.args?.edits) ? audit.args.edits : [];
  return edits.flatMap((edit) => {
    const record = recordOf(edit);
    const oldText = stringOf(record?.oldText) ?? stringOf(record?.old_text);
    const newText = stringOf(record?.newText) ?? stringOf(record?.new_text);
    return oldText !== void 0 && newText !== void 0 && oldText !== newText ? [{ oldText, newText }] : [];
  });
};
var renderEdit = (audit, theme, options) => {
  if (!options.expanded && !options.settings.editDiffPreview) return null;
  const filePath = argString(audit, "path") ?? "";
  const actual = stringOf(resultDetails(audit)?.diff);
  if (actual) {
    const summary = summarizeDiff(actual);
    const header2 = theme.fg("muted", countLabel(summary.hunks, "hunk")) + theme.fg("muted", " \xB7 ") + theme.fg("success", `+${summary.additions}`) + " " + theme.fg("error", `-${summary.removals}`);
    const rendered = renderDiff(actual, filePath, theme, options);
    return { lines: [header2, ...rendered.lines], hidden: rendered.hidden };
  }
  const operations = editOperations(audit);
  if (operations.length === 0) {
    if (audit.fromTrace) {
      return { lines: [theme.fg("dim", "diff not retained across reload")], hidden: 0 };
    }
    return null;
  }
  const maxOperations = Math.min(operations.length, 3);
  const sections = [];
  let additions = 0;
  let removals = 0;
  let hidden = 0;
  const perOperation = Math.max(8, Math.floor(toolLimit(audit, options) / maxOperations));
  for (let index = 0; index < maxOperations; index++) {
    const operation = operations[index];
    const diff = createSimpleDiff(operation.oldText, operation.newText);
    const summary = summarizeDiff(diff);
    additions += summary.additions;
    removals += summary.removals;
    if (operations.length > 1) sections.push(theme.fg("muted", `Proposed edit ${index + 1}/${operations.length}`));
    const rendered = renderDiff(diff, filePath, theme, options, perOperation);
    sections.push(...rendered.lines);
    hidden += rendered.hidden;
  }
  const header = `${theme.fg("muted", "proposed edit")} ${theme.fg("success", `+${additions}`)} ${theme.fg("error", `-${removals}`)}${operations.length > 1 ? theme.fg("muted", ` \xB7 ${operations.length} edit blocks`) : ""}`;
  if (operations.length > maxOperations) {
    pushArcItem(sections, arcItem(theme, `Showing ${maxOperations} of ${operations.length} edit blocks`));
  }
  return { lines: [header, ...sections], hidden };
};
var grepMatchRanges = (code, pattern, literal, ignoreCase) => {
  if (!literal || !pattern) return [];
  const haystack = ignoreCase ? code.toLowerCase() : code;
  const needle = ignoreCase ? pattern.toLowerCase() : pattern;
  const ranges = [];
  let index = haystack.indexOf(needle);
  while (index >= 0) {
    ranges.push([index, index + needle.length]);
    index = haystack.indexOf(needle, index + needle.length);
  }
  return ranges;
};
var parseGrepRow = (raw) => {
  const match = raw.match(/^(.+):(\d+):\s(.*)$/);
  const context = raw.match(/^(.+)-(\d+)-\s(.*)$/);
  const parsed = match ?? context;
  if (!parsed) return null;
  const lineNumberLabel = parsed[2] ?? "";
  const lineNumber = Number.parseInt(lineNumberLabel, 10);
  return {
    filePath: parsed[1] ?? "",
    lineNumber: Number.isFinite(lineNumber) ? lineNumber : 0,
    lineNumberLabel,
    code: expandTabs(parsed[3] ?? ""),
    isMatch: Boolean(match)
  };
};
var highlightGrepRun = (run, language, options) => {
  if (!language) return run.map(() => void 0);
  const first = run[0];
  const last = run[run.length - 1];
  const slice = highlightFileLines(
    resolve(options.cwd, first.filePath),
    language,
    first.lineNumber - 1,
    last.lineNumber,
    options.invalidate
  );
  if (slice && slice.every((line, index) => line.raw === run[index].code)) {
    return slice.map((line) => line.ansi);
  }
  const rendered = highlightCode(
    run.map((row) => row.code).join("\n"),
    language,
    options.invalidate
  );
  return run.map((_, index) => rendered?.[index]);
};
var renderGrepRowLine = (row, highlighted, audit, theme) => {
  let content = highlighted;
  if (row.isMatch) {
    const ranges = grepMatchRanges(
      row.code,
      argString(audit, "pattern") ?? "",
      audit.args?.literal === true,
      audit.args?.ignoreCase === true
    );
    if (ranges.length > 0) {
      content = injectVisibleRanges(
        content,
        ranges,
        effectiveShikiThemeIsLight() ? "\x1B[48;2;234;225;171m" : "\x1B[48;2;90;74;28m",
        "\x1B[49m"
      );
    }
  }
  const number = row.isMatch ? theme.fg("accent", row.lineNumberLabel.padStart(4, " ")) : theme.fg("dim", row.lineNumberLabel.padStart(4, " "));
  const marker = row.isMatch ? theme.fg("warning", "\u2502") : theme.fg("dim", "\u2506");
  return `${theme.fg("dim", "  ")}${number} ${marker} ${content}`;
};
var renderGrep = (audit, theme, options) => {
  if (!options.expanded && !options.settings.grepResultPreview) return null;
  const output = resultOutput(audit)?.replace(/\r?\n$/, "");
  if (!output || output === "No matches found") {
    return { lines: [theme.fg("muted", output || "No matches found")], hidden: 0 };
  }
  const raw = output.split("\n");
  const skipHighlight = options.settings.syntaxHighlighting && output.length > MAX_HIGHLIGHT_CHARS2;
  const syntaxOn = options.settings.syntaxHighlighting && !skipHighlight;
  const selected = previewEntries(raw, toolLimit(audit, options));
  const lines = [];
  let currentPath = "";
  let currentLanguage;
  let run = [];
  const flushRun = () => {
    if (run.length === 0) return;
    const highlighted = syntaxOn ? highlightGrepRun(run, currentLanguage, options) : [];
    for (let index = 0; index < run.length; index++) {
      const row = run[index];
      const content = highlighted[index] ?? theme.fg("toolOutput", escapeControlChars3(row.code));
      lines.push(renderGrepRowLine(row, content, audit, theme));
    }
    run = [];
  };
  for (const entry of selected.entries) {
    if (entry.kind === "hidden") {
      flushRun();
      lines.push(theme.fg("muted", `      --- ${entry.hidden} lines hidden ---`));
      currentPath = "";
      currentLanguage = void 0;
      continue;
    }
    const row = parseGrepRow(entry.line);
    if (!row) {
      flushRun();
      lines.push(
        entry.line.startsWith("[") && entry.line.endsWith("]") ? theme.fg("warning", escapeControlChars3(entry.line)) : theme.fg("toolOutput", escapeControlChars3(entry.line) || " ")
      );
      continue;
    }
    if (row.filePath !== currentPath) {
      flushRun();
      currentPath = row.filePath;
      currentLanguage = syntaxOn ? languageFromPath(row.filePath) : void 0;
      lines.push(theme.fg("accent", escapeControlChars3(row.filePath)));
      run.push(row);
      continue;
    }
    const previous = run[run.length - 1];
    if (!previous || row.lineNumber !== previous.lineNumber + 1) {
      flushRun();
    }
    run.push(row);
  }
  flushRun();
  if (skipHighlight) {
    pushArcItem(lines, arcItem(theme, "Syntax highlighting skipped for large grep output"));
  }
  return { lines, hidden: selected.hidden };
};
var NERD_BY_NAME = {
  "package.json": "\uE718",
  "package-lock.json": "\uE718",
  "tsconfig.json": "\uE628",
  "readme.md": "\uE73E",
  license: "\uE60A",
  dockerfile: "\uE7B0",
  makefile: "\uE615",
  ".gitignore": "\uE702",
  ".env": "\uE615",
  ".envrc": "\uE795"
};
var NERD_BY_EXTENSION = {
  ts: "\uE628",
  tsx: "\uE7BA",
  js: "\uE74E",
  jsx: "\uE7BA",
  json: "\uE60B",
  md: "\uE73E",
  py: "\uE73C",
  rs: "\uE7A8",
  go: "\uE627",
  java: "\uE738",
  rb: "\uE739",
  php: "\uE73D",
  html: "\uE736",
  css: "\uE749",
  scss: "\uE749",
  yaml: "\uE615",
  yml: "\uE615",
  toml: "\uE6B2",
  sh: "\uE795",
  bash: "\uE795",
  zsh: "\uE795",
  sql: "\uE706",
  xml: "\uE619",
  png: "\uF1C5",
  jpg: "\uF1C5",
  jpeg: "\uF1C5",
  gif: "\uF1C5",
  svg: "\uF1C5"
};
var pathIcon = (filePath, directory, mode) => {
  if (mode === "off") return "";
  if (mode === "unicode") return directory ? "\u25B8" : "\u2022";
  if (directory) return "\uE5FF";
  const name = basename2(filePath).toLowerCase();
  return NERD_BY_NAME[name] ?? NERD_BY_EXTENSION[extname2(name).slice(1)] ?? "\uF15B";
};
var renderPathList = (audit, theme, options) => {
  const enabled2 = audit.tool === "find" ? options.settings.findResultPreview : options.settings.lsResultPreview;
  if (!options.expanded && !enabled2) return null;
  const output = resultOutput(audit)?.replace(/\r?\n$/, "") ?? "";
  const emptyMarker = audit.tool === "find" ? "No files found matching pattern" : "(empty directory)";
  if (!output || output === emptyMarker) {
    return {
      lines: [theme.fg("muted", audit.tool === "find" ? output || "No files found" : "Empty directory")],
      hidden: 0
    };
  }
  const raw = output.split("\n");
  if (options.expanded && !enabled2) {
    return {
      lines: raw.map((line) => theme.fg("toolOutput", escapeControlChars3(line) || " ")),
      hidden: 0
    };
  }
  const selected = previewEntries(raw, toolLimit(audit, options));
  const lines = [];
  let chunk = [];
  const flush = () => {
    if (chunk.length === 0) return;
    const shouldTree = chunk.filter((line) => line && !(line.startsWith("[") && line.endsWith("]"))).some((line) => line.includes("/"));
    const seenDirectories = /* @__PURE__ */ new Set();
    for (const rawPath of chunk) {
      if (rawPath.startsWith("[") && rawPath.endsWith("]")) {
        lines.push(theme.fg("warning", escapeControlChars3(rawPath)));
        continue;
      }
      if (!rawPath) {
        lines.push("");
        continue;
      }
      if (!shouldTree) {
        const leading = rawPath.match(/^\s*/)?.[0] ?? "";
        const body = rawPath.slice(leading.length);
        const directory2 = body.endsWith("/");
        const icon = pathIcon(body, directory2, options.settings.pathIcons);
        const iconText = icon ? leading + icon : leading;
        lines.push(
          `${theme.fg("dim", iconText)}${icon ? " " : ""}${renderPath(body, options.cwd, theme, body)}`
        );
        continue;
      }
      const clean = rawPath.replace(/^\.\//, "");
      const directory = clean.endsWith("/");
      const parts = clean.replace(/\/$/, "").split("/").filter(Boolean);
      let prefix = "";
      for (let index = 0; index < parts.length; index++) {
        const part = parts[index];
        const leaf = index === parts.length - 1;
        const key = prefix ? `${prefix}/${part}` : part;
        const isDirectory = !leaf || directory;
        if (!isDirectory || !seenDirectories.has(key)) {
          if (isDirectory) seenDirectories.add(key);
          const icon = pathIcon(part, isDirectory, options.settings.pathIcons);
          const indent = "  ".repeat(index);
          const label = isDirectory ? theme.fg("accent", `${escapeControlChars3(part)}/`) : theme.fg("toolOutput", escapeControlChars3(part));
          lines.push(`${theme.fg("dim", indent + icon)}${icon ? " " : ""}${label}`);
        }
        prefix = key;
      }
    }
    chunk = [];
  };
  for (const entry of selected.entries) {
    if (entry.kind === "hidden") {
      flush();
      lines.push(theme.fg("muted", `      --- ${entry.hidden} lines hidden ---`));
    } else {
      chunk.push(entry.line);
    }
  }
  flush();
  return { lines, hidden: selected.hidden };
};
var renderBash = (audit, theme, options) => {
  const commandName = firstShellCommandName(bashCommand(audit));
  const resultEnabled = options.settings.bashResultPreview && (commandName === "grep" || commandName === "egrep" || commandName === "fgrep" ? options.settings.grepResultPreview : commandName === "find" ? options.settings.findResultPreview : commandName === "ls" ? options.settings.lsResultPreview : true);
  if (!options.expanded && !resultEnabled) return null;
  const command = bashCommand(audit);
  const displayCommand = escapeControlChars3(command.replace(/\r\n/g, "\n"));
  const commandLines = displayCommand.split("\n");
  const highlightedCommand = command ? highlightCode(displayCommand, "bash", options.invalidate) : null;
  const lines = commandLines.slice(1).map(
    (line, index) => `${theme.fg("dim", "  ")}${highlightedCommand?.[index + 1] ?? theme.fg("accent", line)}`
  );
  const output = resultOutput(audit)?.replace(/\r?\n$/, "") ?? "";
  if (!output || output === "(no output)") {
    if (!output && audit.fromTrace) {
      return { lines: [...lines, theme.fg("dim", "output not retained across reload")], hidden: 0 };
    }
    return {
      lines: [...lines, theme.fg("muted", output || "No output")],
      hidden: 0
    };
  }
  const raw = output.split("\n");
  const selected = previewEntries(raw, toolLimit(audit, options));
  const warning = warningLine(output, options, theme);
  if (warning) lines.push(warning);
  for (const entry of selected.entries) {
    if (entry.kind === "hidden") {
      lines.push(theme.fg("muted", `      --- ${entry.hidden} lines hidden ---`));
      continue;
    }
    const text = theme.fg(audit.success === false ? "error" : "muted", escapeControlChars3(entry.line) || " ");
    lines.push(text);
  }
  if (nativeTruncated(audit)) pushArcItem(lines, arcItem(theme, "Output truncated by bash"));
  const fullOutputPath = stringOf(resultDetails(audit)?.fullOutputPath);
  if (fullOutputPath) pushArcItem(lines, arcItem(theme, `Full output: ${escapeControlChars3(fullOutputPath)}`));
  return { lines, hidden: selected.hidden };
};
var coreToolRendererEnabled = (audit, settings) => isCoreToolAudit(audit) && audit.tool !== void 0 && settings.tools.includes(audit.tool);
var coreToolPreviewEnabled = (audit, settings) => {
  if (!coreToolRendererEnabled(audit, settings)) return true;
  switch (audit.tool) {
    case "read":
      return settings.readContentPreview;
    case "write":
      return settings.writeContentPreview;
    case "edit":
      return settings.editDiffPreview;
    case "grep":
      return settings.grepResultPreview;
    case "find":
      return settings.findResultPreview;
    case "ls":
      return settings.lsResultPreview;
    case "bash": {
      if (!settings.bashResultPreview) return false;
      const command = firstShellCommandName(bashCommand(audit));
      if (command === "grep" || command === "egrep" || command === "fgrep") {
        return settings.grepResultPreview;
      }
      if (command === "find") return settings.findResultPreview;
      if (command === "ls") return settings.lsResultPreview;
      return true;
    }
    default:
      return true;
  }
};
var renderCoreToolBody = (audit, theme, options) => {
  observePiTheme(theme);
  if (!coreToolRendererEnabled(audit, options.settings) || !audit.tool) return null;
  switch (audit.tool) {
    case "read":
      return renderRead(audit, theme, options);
    case "write":
      return renderWrite(audit, theme, options);
    case "edit":
      return renderEdit(audit, theme, options);
    case "grep":
      return renderGrep(audit, theme, options);
    case "find":
    case "ls":
      return renderPathList(audit, theme, options);
    case "bash":
      return renderBash(audit, theme, options);
    default:
      return null;
  }
};
var coreToolTitle = (audit, theme, options) => {
  observePiTheme(theme);
  if (!coreToolRendererEnabled(audit, options.settings) || !audit.tool) return null;
  const title = theme.fg("toolTitle", theme.bold(audit.tool));
  const timing = options.settings.toolCallTiming ? formatToolCallDuration(audit.startedAt, audit.endedAt) : void 0;
  const filePath = argString(audit, "path") ?? "";
  if (audit.tool === "bash") {
    const command = bashCommand(audit);
    const firstLine = command.split("\n")[0] ?? "";
    const highlighted = firstLine ? highlightCode(firstLine, "bash", options.invalidate)?.[0] : void 0;
    const timeout = numberOf(audit.args?.timeout);
    const warnings = options.settings.bashWarnings ? bashWarnings(command) : [];
    return `${title} ${theme.fg("dim", "$")} ${highlighted ?? theme.fg("accent", escapeControlChars3(firstLine))}${metadata(theme, [
      timeout !== void 0 ? `timeout ${timeout}s` : void 0,
      warnings.length > 0 ? `\u26A0 ${warnings.join(", ")}` : void 0,
      timing
    ])}`;
  }
  if (audit.tool === "grep") {
    const pattern = argString(audit, "pattern") ?? "";
    const glob = argString(audit, "glob");
    const limit = numberOf(audit.args?.limit);
    return `${title} ${theme.fg("accent", `/${escapeControlChars3(pattern)}/`)} ${theme.fg("muted", "in")} ${renderPath(filePath || ".", options.cwd, theme)}${metadata(theme, [
      glob ? escapeControlChars3(glob) : void 0,
      limit !== void 0 ? `limit ${limit}` : void 0,
      timing
    ])}`;
  }
  if (audit.tool === "find") {
    const pattern = argString(audit, "pattern") || "*";
    return `${title} ${theme.fg("accent", escapeControlChars3(pattern))} ${theme.fg("muted", "in")} ${renderPath(filePath || ".", options.cwd, theme)}${metadata(theme, [timing])}`;
  }
  if (audit.tool === "ls") {
    return `${title} ${renderPath(filePath || ".", options.cwd, theme)}${metadata(theme, [timing])}`;
  }
  if (audit.tool === "read") {
    const offset = numberOf(audit.args?.offset);
    const limit = numberOf(audit.args?.limit);
    const range = offset !== void 0 || limit !== void 0 ? theme.fg("warning", `:${offset ?? 1}${limit !== void 0 ? `-${(offset ?? 1) + limit - 1}` : ""}`) : "";
    return `${title} ${renderPath(filePath, options.cwd, theme)}${range}${metadata(theme, [
      languageFromPath(filePath),
      timing
    ])}`;
  }
  if (audit.tool === "write") {
    const content = writeContent(audit);
    const rendererPreview = recordOf(audit.preview);
    const byteLength = numberOf(rendererPreview?.writeByteLength) ?? (content !== void 0 ? Buffer.byteLength(content, "utf8") : void 0);
    const lineCount = numberOf(rendererPreview?.writeLineCount) ?? (content !== void 0 ? countContentLines(content) : void 0);
    return `${title} ${renderPath(filePath, options.cwd, theme)}${metadata(theme, [
      byteLength !== void 0 ? formatBytes(byteLength) : void 0,
      lineCount !== void 0 ? countLabel(lineCount, "line") : void 0,
      languageFromPath(filePath),
      timing
    ])}`;
  }
  return `${title} ${renderPath(filePath, options.cwd, theme)}${metadata(theme, [timing])}`;
};

// src/ui/fabric-render.ts
import { createHash } from "node:crypto";
import {
  getKeybindings,
  truncateToWidth as truncateToWidth3,
  visibleWidth as visibleWidth3,
  wrapTextWithAnsi
} from "@earendil-works/pi-tui";
var configuredDiffWrapRows = Number.parseInt(
  process.env.CODE_PREVIEW_DIFF_WRAP_ROWS ?? "",
  10
);
var DIFF_WRAP_ROWS = Number.isFinite(configuredDiffWrapRows) && configuredDiffWrapRows > 0 ? configuredDiffWrapRows : 3;
var EXPAND_KEYBINDING = "app.tools.expand";
var COLLAPSED_MULTICALL_LIMIT = 8;
var EXPANDED_MULTICALL_LIMIT = 30;
var AGENT_RESPONSE_LINE_CODE_POINTS = 240;
var EXPANDED_AGENT_TOOL_BODY_COUNT = 2;
var EXPANDED_AGENT_TOOL_BODY_LINES = 12;
var FULL_SGR_RESET = "\x1B[0m";
var TEXT_SGR_RESET = "\x1B[22;23;24;27;29;39m";
var INHERITED_TEXT_RESET_PARAMETERS = [
  "22",
  "23",
  "24",
  "25",
  "27",
  "28",
  "29",
  "39",
  "54",
  "55"
];
var SGR_SEQUENCE = /\x1b\[([0-9:;]*)m/g;
var inheritEnclosingBackground = (text) => text.replace(SGR_SEQUENCE, (_sequence, rawParameters) => {
  const parameters = rawParameters === "" ? ["0"] : rawParameters.split(";");
  const kept = [];
  for (let index = 0; index < parameters.length; index++) {
    const parameter = parameters[index];
    const code = Number.parseInt(parameter, 10);
    if (parameter === "0") {
      kept.push(...INHERITED_TEXT_RESET_PARAMETERS);
    } else if (parameter.startsWith("48:")) {
      continue;
    } else if (code === 38 || code === 58) {
      const mode = parameters[index + 1];
      const end = index + (mode === "2" ? 4 : mode === "5" ? 2 : 0);
      kept.push(...parameters.slice(index, end + 1));
      index = end;
    } else if (code === 48) {
      const mode = parameters[index + 1];
      index += mode === "2" ? 4 : mode === "5" ? 2 : 0;
    } else if (code === 49 || code === 7 || code >= 40 && code <= 47 || code >= 100 && code <= 107) {
      continue;
    } else {
      kept.push(parameter);
    }
  }
  return kept.length > 0 ? `\x1B[${kept.join(";")}m` : "";
});
var safeTerminalText = (value) => value.replace(/[\u0000-\u0008\u000b-\u001f\u007f-\u009f]/g, (character) => {
  const code = character.codePointAt(0)?.toString(16).padStart(2, "0") ?? "00";
  return `\\x${code}`;
});
var truncateBoundedLine = (line, width) => {
  const truncated = truncateToWidth3(line, width, "");
  if (!truncated.endsWith(FULL_SGR_RESET)) return truncated;
  return truncated.slice(0, -FULL_SGR_RESET.length) + TEXT_SGR_RESET;
};
var BoundedLineList = class _BoundedLineList {
  constructor(lines, theme, diffIntensity = "off", wrapLineIndexes, inheritBackground = false) {
    this.lines = lines;
    this.theme = theme;
    this.diffIntensity = diffIntensity;
    this.wrapLineIndexes = wrapLineIndexes;
    this.inheritBackground = inheritBackground;
  }
  #cachedWidth;
  #cachedRows;
  render(width) {
    if (this.#cachedWidth === width && this.#cachedRows) return this.#cachedRows;
    if (width <= 0) return this.#cache(width, []);
    const diffBackground = createDiffBackgroundResolver(this.theme, this.diffIntensity);
    const rows = [];
    for (let lineIndex = 0; lineIndex < this.lines.length; lineIndex++) {
      const rawLine = this.lines[lineIndex];
      const { kind, line } = parseMarkedDiffLine(rawLine);
      if (!kind) {
        let renderedRows;
        if (this.wrapLineIndexes?.has(lineIndex)) {
          const continuationIndent = width > 2 ? "  " : "";
          const wrapped = wrapTextWithAnsi(
            line,
            Math.max(1, width - visibleWidth3(continuationIndent))
          );
          renderedRows = wrapped.map(
            (row, index) => truncateBoundedLine(
              index === 0 ? row : continuationIndent + row,
              width
            )
          );
        } else renderedRows = [truncateBoundedLine(line, width)];
        rows.push(...this.inheritBackground ? renderedRows.map(inheritEnclosingBackground) : renderedRows);
        continue;
      }
      const pipe = line.indexOf("\u2502 ");
      const continuationPrefix = pipe < 0 ? "" : " ".repeat(visibleWidth3(line.slice(0, pipe + 2)));
      const wrappedRows = wrapDiffAnsiToWidth(
        line,
        width,
        DIFF_WRAP_ROWS,
        visibleWidth3(continuationPrefix) < width ? continuationPrefix : ""
      );
      for (const row of wrappedRows) {
        const padding = " ".repeat(Math.max(0, width - visibleWidth3(row)));
        rows.push(applyDiffBackground(row + padding, diffBackground(kind)));
      }
    }
    return this.#cache(width, rows);
  }
  invalidate() {
    this.#cachedWidth = void 0;
    this.#cachedRows = void 0;
  }
  withInheritedBackground() {
    if (this.inheritBackground) return this;
    return new _BoundedLineList(
      this.lines,
      this.theme,
      this.diffIntensity,
      this.wrapLineIndexes,
      true
    );
  }
  #cache(width, rows) {
    this.#cachedWidth = width;
    this.#cachedRows = rows;
    return rows;
  }
};
var InheritedBackgroundComponent = class {
  constructor(child) {
    this.child = child;
  }
  render(width) {
    return this.child.render(width).map(inheritEnclosingBackground);
  }
  invalidate() {
    this.child.invalidate?.();
  }
};
var inheritComponentBackground = (component) => component instanceof BoundedLineList ? component.withInheritedBackground() : new InheritedBackgroundComponent(component);
var renderBoundedLines = (lines, theme, diffIntensity = "off", wrapLineIndexes) => new BoundedLineList(lines, theme, diffIntensity, wrapLineIndexes);
var fabricMulticallCallLimit = (expanded) => expanded ? EXPANDED_MULTICALL_LIMIT : COLLAPSED_MULTICALL_LIMIT;
var visibleMulticallAudits = (audits, expanded) => {
  const limit = fabricMulticallCallLimit(expanded);
  if (expanded || audits.length <= limit) {
    return audits.slice(0, limit).map((audit, auditIndex) => ({ audit, auditIndex }));
  }
  const active = audits.map((audit, auditIndex) => ({ audit, auditIndex })).filter(({ audit }) => audit.success === void 0);
  const selected = new Set(
    active.slice(-limit).map(({ auditIndex }) => auditIndex)
  );
  for (let auditIndex = 0; auditIndex < audits.length && selected.size < limit; auditIndex++) {
    if (!selected.has(auditIndex)) selected.add(auditIndex);
  }
  return [...selected].sort((left, right) => left - right).map((auditIndex) => ({ audit: audits[auditIndex], auditIndex }));
};
function expandHint(theme) {
  let keys = [];
  try {
    keys = getKeybindings().getKeys(EXPAND_KEYBINDING);
  } catch {
    keys = [];
  }
  const keyText = keys.length > 0 ? keys.join("/") : "ctrl-o";
  return theme.fg("dim", `${keyText} to expand`);
}
var truncateOneLine = (value, max) => {
  const single = value.replace(/\s+/g, " ").trim();
  return single.length <= max ? single : `${single.slice(0, max - 1)}\u2026`;
};
var argString2 = (args, key) => typeof args[key] === "string" ? args[key] : void 0;
var LEGACY_COMMAND_DIGEST = /^sha256:[a-f0-9]{64}$/;
var legacyCommandCache = /* @__PURE__ */ new WeakMap();
var digestCommand = (command) => `sha256:${createHash("sha256").update(command).digest("hex")}`;
var recordOf2 = (value) => typeof value === "object" && value !== null && !Array.isArray(value) ? value : void 0;
var legacyCommandsFrom = (fabricArgs) => {
  const args = recordOf2(fabricArgs);
  if (!args) return /* @__PURE__ */ new Map();
  const cached = legacyCommandCache.get(args);
  if (cached) return cached;
  const commands = /* @__PURE__ */ new Map();
  const remember = (candidate) => {
    if (typeof candidate === "string") commands.set(digestCommand(candidate), candidate);
  };
  const namedStrings = recordOf2(args.strings);
  if (namedStrings) {
    for (const value of Object.values(namedStrings)) remember(value);
  }
  const rawCode = args.code;
  const code = typeof rawCode === "string" ? rawCode : Array.isArray(rawCode) && rawCode.every((value) => typeof value === "string") ? rawCode.join("\n") : void 0;
  if (code) {
    for (const literal of fabricStringLiterals(code)) remember(literal);
  }
  legacyCommandCache.set(args, commands);
  return commands;
};
var restoreLegacyBashCommands = (audits, fabricArgs) => {
  const hasLegacyCommand = audits.some((audit) => {
    const digest = audit.ref === "pi.bash" ? argString2(audit.args ?? {}, "commandDigest") : void 0;
    return Boolean(digest && LEGACY_COMMAND_DIGEST.test(digest));
  });
  if (!hasLegacyCommand) return audits;
  const commands = legacyCommandsFrom(fabricArgs);
  return audits.map((audit) => {
    if (audit.ref !== "pi.bash" || !audit.args) return audit;
    const digest = argString2(audit.args, "commandDigest");
    if (!digest || !LEGACY_COMMAND_DIGEST.test(digest)) return audit;
    const { commandDigest: _commandDigest, ...argsWithoutDigest } = audit.args;
    const command = commands.get(digest);
    return {
      ...audit,
      args: command ? { ...argsWithoutDigest, command } : argsWithoutDigest
    };
  });
};
var renderWriteArgumentBody = (path, content, expanded, theme, invalidate, parity) => {
  if (parity) {
    const rendered = renderCoreToolBody(
      { ref: "pi.write", provider: "pi", tool: "write", args: { path, content } },
      theme,
      {
        cwd: parity.cwd,
        settings: parity.settings,
        expanded,
        maxLines: 200,
        ...invalidate ? { invalidate } : {}
      }
    );
    if (rendered) return rendered;
  }
  const allLines = safeTerminalText(content).split("\n");
  while (allLines.length > 0 && allLines[allLines.length - 1] === "") allLines.pop();
  const limit = expanded ? Math.min(allLines.length, 200) : 10;
  const shown = allLines.slice(0, limit);
  const lang = languageFromPath(path);
  const highlighted = lang && shown.length > 0 ? highlightCode(shown.join("\n"), lang, invalidate) : null;
  return {
    lines: shown.map(
      (line, index) => highlighted?.[index] ?? theme.fg("toolOutput", line || " ")
    ),
    hidden: allLines.length - shown.length
  };
};
var renderFabricWriteArgumentPreview = (input, theme, invalidate) => {
  const available = input.bindings.map(
    (binding) => input.strings?.[binding.stringKey]
  );
  let activeIndex = -1;
  for (let index = 0; index < available.length; index++) {
    if (typeof available[index] === "string") activeIndex = index;
  }
  if (activeIndex < 0) return null;
  if (input.bindings.length === 1) {
    const binding = input.bindings[0];
    const rows2 = [
      nestedCallTitle(
        {
          ref: "pi.write",
          provider: "pi",
          tool: "write",
          args: { path: binding.path, content: available[0] ?? "" }
        },
        theme,
        invalidate,
        input.cwd && input.settings ? { cwd: input.cwd, settings: input.settings } : void 0
      )
    ];
    const body = renderWriteArgumentBody(
      binding.path,
      available[0] ?? "",
      input.expanded,
      theme,
      invalidate,
      input.cwd && input.settings ? { cwd: input.cwd, settings: input.settings } : void 0
    );
    rows2.push(...body.lines);
    if (body.hidden > 0) {
      rows2.push(
        theme.fg("dim", `\u2026 ${body.hidden} more ${body.hidden === 1 ? "line" : "lines"}`) + (input.expanded ? "" : theme.fg("dim", " \xB7 ") + expandHint(theme))
      );
    }
    return renderBoundedLines(rows2);
  }
  const completed = Math.max(
    0,
    available.filter((value) => typeof value === "string").length - 1
  );
  const rows = [
    theme.fg(
      "warning",
      `\u25C6 Fabric composing \xB7 ${completed}/${input.bindings.length} writes`
    )
  ];
  const callLimit = fabricMulticallCallLimit(input.expanded);
  const shownBindings = input.bindings.slice(0, callLimit);
  for (let index = 0; index < shownBindings.length; index++) {
    const binding = shownBindings[index];
    const glyph = index !== activeIndex && typeof available[index] === "string" ? theme.fg("dim", "\u203A") : index === activeIndex ? theme.fg("warning", input.spinner ?? "\u25D0") : theme.fg("dim", "\u25CB");
    rows.push(
      `${glyph} ${nestedCallTitle(
        {
          ref: "pi.write",
          provider: "pi",
          tool: "write",
          args: {
            path: binding.path,
            ...typeof available[index] === "string" ? { content: available[index] } : {}
          }
        },
        theme,
        invalidate,
        input.cwd && input.settings ? { cwd: input.cwd, settings: input.settings } : void 0
      )}`
    );
    if (index === activeIndex) {
      const body = renderWriteArgumentBody(
        binding.path,
        available[index] ?? "",
        input.expanded,
        theme,
        invalidate,
        input.cwd && input.settings ? { cwd: input.cwd, settings: input.settings } : void 0
      );
      for (const line of body.lines) rows.push(`  ${line}`);
      if (body.hidden > 0) {
        rows.push(
          theme.fg("dim", `  \u2026 ${body.hidden} more ${body.hidden === 1 ? "line" : "lines"}`)
        );
      }
    }
  }
  const hidden = input.bindings.length - shownBindings.length;
  if (hidden > 0) {
    rows.push(
      theme.fg("dim", `\u2026 ${hidden} more ${hidden === 1 ? "write" : "writes"}`) + (input.expanded ? "" : theme.fg("dim", " \xB7 ") + expandHint(theme))
    );
  }
  return renderBoundedLines(rows);
};
var shortIdOf = (value) => typeof value === "string" ? value.slice(0, 8) : void 0;
var countOf = (result) => Array.isArray(result) ? String(result.length) : "";
var providerCallDetail = (provider, tool, args, result, preview, previewHeadline) => {
  if (provider === "agents") {
    if (previewHeadline) return previewHeadline;
    const name = argString2(args, "name");
    const previewName = isFabricAgentToolPreview(preview) ? preview.name : void 0;
    const id = shortIdOf(args.id);
    const message = argString2(args, "message");
    const task = argString2(args, "task");
    switch (tool) {
      case "create":
        return name ?? "";
      case "remove":
      case "stop":
      case "cleanup":
      case "wait":
      case "status":
      case "actorStatus":
      case "messages":
        return previewName ?? name ?? id ?? "";
      case "ask":
      case "tell":
        return [previewName ?? name ?? id, message ? truncateOneLine(message, 48) : ""].filter(Boolean).join(" ");
      case "run":
      case "spawn":
        return name ?? (task ? truncateOneLine(task, 64) : previewName ?? "");
      case "actors":
      case "list":
      case "models":
      case "peers":
        return countOf(result);
      default:
        return previewName ?? id ?? "";
    }
  }
  if (provider === "mesh") {
    if (previewHeadline) return previewHeadline;
    switch (tool) {
      case "publish":
        return argString2(args, "topic") ?? "";
      case "read":
        return [argString2(args, "topic"), countOf(result)].filter(Boolean).join(" \xB7 ");
      case "get":
      case "put":
      case "delete":
        return argString2(args, "key") ?? "";
      case "list":
        return [argString2(args, "prefix"), countOf(result)].filter(Boolean).join(" \xB7 ");
      case "members":
        return countOf(result);
      default:
        return "";
    }
  }
  if (provider === "mcp") {
    if (previewHeadline) return previewHeadline;
    switch (tool) {
      case "$call":
        return [argString2(args, "server"), argString2(args, "tool")].filter(Boolean).join(".");
      case "$register":
        return argString2(args, "name") ?? "";
      case "$servers":
        return countOf(result);
      default:
        return "";
    }
  }
  return "";
};
var structuralCallDetail = (provider, tool, args, result) => {
  if (provider !== "fabric") return "";
  const count = countOf(result);
  switch (tool) {
    case "discovery.providers":
    case "discovery.models":
    case "discovery.search":
      return count;
    case "discovery.list":
      return [argString2(args, "provider"), argString2(args, "namespace"), count].filter(Boolean).join(" \xB7 ");
    case "discovery.describe":
      return argString2(args, "ref") ?? "";
    case "workflow.parallel":
    case "workflow.pipeline": {
      const itemCount = typeof args.itemCount === "number" ? args.itemCount : void 0;
      const stageCount = typeof args.stageCount === "number" ? args.stageCount : void 0;
      return [
        itemCount !== void 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"}` : "",
        stageCount !== void 0 ? `${stageCount} ${stageCount === 1 ? "stage" : "stages"}` : ""
      ].filter(Boolean).join(" \xB7 ");
    }
    default:
      return "";
  }
};
var callHeadlinePreview = (audit) => {
  const ref = audit.ref;
  const provider = audit.provider ?? ref.split(".")[0] ?? ref;
  const tool = audit.tool ?? ref.split(".")[1] ?? ref;
  const args = audit.args ?? {};
  return providerCallDetail(provider, tool, args, audit.result, audit.preview) || headlineArg(args) || structuralCallDetail(provider, tool, args, audit.result);
};
var nestedResultTruncated = (audit) => {
  if (audit.resultTruncated === true) return true;
  const result = audit.result;
  if (typeof result !== "object" || result === null) return false;
  const details = result.details;
  if (typeof details !== "object" || details === null) return false;
  const truncation = details.truncation;
  if (typeof truncation !== "object" || truncation === null) return false;
  return truncation.truncated === true;
};
function nestedCallTitle(audit, theme, invalidate, core) {
  const title = nestedCallTitleText(audit, theme, invalidate, core);
  return nestedResultTruncated(audit) ? `${title} ${theme.fg("warning", "\xB7 truncated")}` : title;
}
var nestedCallTitleText = (audit, theme, invalidate, core) => {
  const coreTitle = core ? coreToolTitle(audit, theme, { ...core, ...invalidate ? { invalidate } : {} }) : null;
  if (coreTitle) return coreTitle;
  const timing = core?.settings.toolCallTiming ? formatToolCallDuration(audit.startedAt, audit.endedAt) : void 0;
  const withTiming = (value) => timing ? `${value}${theme.fg("dim", ` \xB7 ${timing}`)}` : value;
  const ref = audit.ref;
  const provider = audit.provider ?? ref.split(".")[0] ?? ref;
  const tool = audit.tool ?? ref.split(".")[1] ?? ref;
  const title = theme.fg("toolTitle", theme.bold(tool));
  const args = audit.args ?? {};
  const providerDetail = providerCallDetail(
    provider,
    tool,
    args,
    audit.result,
    audit.preview,
    audit.previewHeadline
  );
  if (providerDetail) return withTiming(`${title} ${theme.fg("accent", providerDetail)}`);
  const command = argString2(args, "command");
  if (command) {
    const firstLine = command.split("\n")[0] ?? "";
    const highlighted = firstLine.length > 0 ? highlightCode(firstLine, "bash", invalidate) : null;
    const cmd = highlighted && highlighted[0] ? highlighted[0] : theme.fg("accent", firstLine);
    return withTiming(`${title} ${theme.fg("dim", "$")} ${cmd}`);
  }
  const path = argString2(args, "path");
  const pattern = argString2(args, "pattern");
  const task = argString2(args, "task");
  let detail = "";
  if (path) detail = path;
  else if (pattern) detail = `/${pattern}/${path ? ` ${path}` : ""}`;
  else if (task) detail = truncateOneLine(task, 64);
  else {
    detail = headlineArg(args) || structuralCallDetail(provider, tool, args, audit.result) || audit.previewHeadline || "";
  }
  return withTiming(detail ? `${title} ${theme.fg("accent", detail)}` : title);
};
var transcriptToolAudit = (entry) => {
  const rawName = entry.toolName ?? entry.label;
  const normalized = rawName.toLowerCase();
  const tool = normalized === "glob" ? "find" : ["read", "write", "edit", "bash", "grep", "find", "ls"].includes(normalized) ? normalized : rawName;
  const rawArgs = entry.args ?? {};
  const args = { ...rawArgs };
  if (typeof rawArgs.file_path === "string" && typeof args.path !== "string") {
    args.path = rawArgs.file_path;
  }
  if (tool === "edit" && !Array.isArray(args.edits)) {
    const oldText = typeof rawArgs.old_string === "string" ? rawArgs.old_string : void 0;
    const newText = typeof rawArgs.new_string === "string" ? rawArgs.new_string : void 0;
    if (oldText !== void 0 && newText !== void 0) args.edits = [{ oldText, newText }];
  }
  return {
    ref: `pi.${tool}`,
    provider: "pi",
    tool,
    ...Object.keys(args).length > 0 ? { args } : {},
    ...entry.result !== void 0 ? { result: entry.result } : {},
    ...entry.status !== "running" ? { success: entry.status !== "failed" } : {}
  };
};
var AGENT_PREVIEW_RENDER_MAX_DEPTH = 6;
var previewStatusGlyph = (status, theme) => status === "running" ? theme.fg("warning", "\u25D0") : status === "failed" ? theme.fg("error", "\u2717") : theme.fg("dim", "\u203A");
var descendantBreadcrumb = (node, theme) => {
  let tail = node.agents?.find((child) => child.status === "running") ?? node.agents?.[0];
  if (!tail) return void 0;
  const names = [tail.name];
  for (let depth = 0; depth < AGENT_PREVIEW_RENDER_MAX_DEPTH; depth += 1) {
    const next = tail.agents?.find((child) => child.status === "running") ?? tail.agents?.[0];
    if (!next) break;
    tail = next;
    names.push(tail.name);
  }
  const runningTool = tail.tools.slice().reverse().find((entry) => entry.status === "running");
  const shownTool = runningTool ?? tail.tools.at(-1);
  const trail = names.map((name) => theme.fg("accent", safeTerminalText(name))).join(theme.fg("dim", " \u203A "));
  const tool = shownTool ? theme.fg("dim", " \u203A ") + nestedCallTitle(transcriptToolAudit(shownTool), theme) : "";
  const glyph = tail.status === "running" || tail.status === "failed" ? `${previewStatusGlyph(tail.status, theme)} ` : "";
  return `${glyph}${trail}${tool}`;
};
var renderAgentToolPreviewLines = (audit, theme, options) => {
  if (!isFabricAgentToolPreview(audit.preview)) return [];
  return renderAgentToolPreviewNodeLines(audit.preview, theme, options, 0);
};
var renderAgentToolPreviewNodeLines = (preview, theme, options, depth) => {
  const rawPreviewText = safeTerminalText(preview.text ?? "").trim();
  const responseLines = rawPreviewText ? options.compact ? [rawPreviewText.replace(/\s+/g, " ").trim()] : rawPreviewText.split("\n").flatMap((line) => {
    const normalized = line.replace(/\s+/g, " ").trim();
    if (!normalized) return [""];
    const codePoints = Array.from(normalized);
    const chunks = [];
    for (let offset = 0; offset < codePoints.length; offset += AGENT_RESPONSE_LINE_CODE_POINTS) {
      chunks.push(codePoints.slice(offset, offset + AGENT_RESPONSE_LINE_CODE_POINTS).join(""));
    }
    return chunks;
  }) : [];
  const tools = options.showTools === false ? [] : preview.tools;
  const descendantCrumb = !options.expanded && options.showTools !== false && preview.agents !== void 0 && preview.agents.length > 0 ? descendantBreadcrumb(preview, theme) : void 0;
  const runningTool = tools.slice().reverse().find((entry) => entry.status === "running");
  const latestTool = tools.at(-1);
  const collapsedRunningTool = !options.expanded && descendantCrumb === void 0 ? runningTool : void 0;
  const visibleResponseLines = collapsedRunningTool !== void 0 || descendantCrumb !== void 0 ? [] : responseLines;
  const visibleTools = options.expanded || descendantCrumb !== void 0 ? options.expanded ? tools : [] : collapsedRunningTool ? [collapsedRunningTool] : responseLines.length === 0 && latestTool ? [latestTool] : [];
  const chevron = theme.fg("dim", "\u203A");
  const lines = [];
  for (const responseLine of visibleResponseLines) {
    const text = theme.fg("toolOutput", responseLine || " ");
    lines.push(lines.length === 0 ? `${chevron} ${text}` : `  ${text}`);
  }
  for (let toolIndex = 0; toolIndex < visibleTools.length; toolIndex++) {
    const entry = visibleTools[toolIndex];
    const nestedAudit = transcriptToolAudit(entry);
    const title = nestedCallTitle(
      nestedAudit,
      theme,
      options.invalidate,
      options.core
    );
    if (lines.length === 0) {
      lines.push(`${chevron} ${title}`);
    } else {
      const glyph = entry.status === "running" ? theme.fg("warning", "\u25D0") : entry.status === "failed" ? theme.fg("error", "\u2717") : theme.fg("dim", "\u203A");
      lines.push(`  ${glyph} ${title}`);
    }
    if (!options.expanded || !options.core || toolIndex < visibleTools.length - EXPANDED_AGENT_TOOL_BODY_COUNT) continue;
    const body = renderCoreToolBody(nestedAudit, theme, {
      cwd: options.core.cwd,
      settings: options.core.settings,
      expanded: true,
      maxLines: EXPANDED_AGENT_TOOL_BODY_LINES,
      ...options.invalidate ? { invalidate: options.invalidate } : {}
    });
    if (!body) continue;
    for (const row of body.lines) lines.push(`    ${row}`);
    if (body.hidden > 0) {
      lines.push(theme.fg("dim", `    \u2026 ${body.hidden} more lines`));
    }
  }
  if (descendantCrumb !== void 0 && lines.length === 0) {
    lines.push(`${chevron} ${descendantCrumb}`);
  }
  if (options.expanded && options.showTools !== false && preview.agents && preview.agents.length > 0) {
    if (depth < AGENT_PREVIEW_RENDER_MAX_DEPTH) {
      for (const child of preview.agents) {
        const status = child.status && child.status !== "completed" ? theme.fg("dim", ` \xB7 ${safeTerminalText(child.status)}`) : "";
        const currentTool = child.currentTool && child.status === "running" ? theme.fg("dim", ` \xB7 ${safeTerminalText(child.currentTool)}`) : "";
        lines.push(
          `  ${previewStatusGlyph(child.status, theme)} ${theme.fg("accent", safeTerminalText(child.name))}${status}${currentTool}`
        );
        const childLines = renderAgentToolPreviewNodeLines(
          child,
          theme,
          { ...options, core: void 0 },
          depth + 1
        );
        for (const row of childLines) lines.push(`  ${row}`);
      }
      if (preview.agentsTruncated) {
        lines.push(theme.fg("dim", "  \u2026 deeper agent previews hidden"));
      }
    } else {
      lines.push(theme.fg("dim", "  \u2026 deeper agent previews hidden"));
    }
  }
  return lines;
};
var singleCallProgressLine = (progress, previewLines) => progress && previewLines.length === 0 ? safeTerminalText(progress) : "";
var compactProgressPreview = (progress) => {
  const lines = safeTerminalText(progress).split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter(Boolean);
  const latest = lines[lines.length - 1] ?? "";
  if (lines.length <= 1) return latest;
  return `\u2026 ${lines.length - 1} ${lines.length === 2 ? "line" : "lines"} \xB7 ${latest}`;
};
var renderFabricMulticallPartial = (input, theme, invalidate) => {
  const done = input.audits.filter((audit) => audit.success !== void 0).length;
  let header = theme.fg(
    "warning",
    `\u25C6 ${input.activityLabel ?? "Fabric"} running \xB7 ${done}/${input.audits.length} calls`
  );
  const progress = input.progress ? compactProgressPreview(input.progress) : "";
  if (progress) header += theme.fg("dim", ` \xB7 ${progress}`);
  const rows = [header];
  const wrapLineIndexes = input.expanded ? /* @__PURE__ */ new Set() : void 0;
  if (input.phases.length > 0) {
    rows.push(theme.fg("dim", input.phases.map((phase) => `\u25C6 ${phase}`).join("  ")));
  }
  const callsShown = visibleMulticallAudits(input.audits, input.expanded);
  for (let visibleIndex = 0; visibleIndex < callsShown.length; visibleIndex++) {
    const { audit, auditIndex } = callsShown[visibleIndex];
    if (input.expanded && visibleIndex > 0) rows.push("");
    const glyph = audit.success === void 0 ? theme.fg("warning", input.spinner ?? "\u25D0") : audit.success === false ? theme.fg("error", "\u2717") : theme.fg("dim", "\u203A");
    const previewLines = renderAgentToolPreviewLines(audit, theme, {
      expanded: input.expanded,
      compact: !input.expanded,
      showTools: input.showAgentToolPreview,
      core: input.core,
      ...invalidate ? { invalidate } : {}
    });
    let callRow = `${glyph} ${nestedCallTitle(audit, theme, invalidate, input.core)}`;
    if (audit.success === false && audit.error) {
      callRow += ` ${theme.fg("dim", "\u203A")} ${theme.fg("error", truncateOneLine(safeTerminalText(audit.error), 240))}`;
    } else if (previewLines[0]) {
      callRow += ` ${previewLines[0]}`;
    }
    if (previewLines.length > 0) wrapLineIndexes?.add(rows.length);
    rows.push(callRow);
    if (audit.success !== false && input.preview?.auditIndex === auditIndex) {
      for (const line of input.preview.body.split("\n")) rows.push(`  ${line}`);
      if (input.preview.hidden > 0) {
        rows.push(
          theme.fg(
            "dim",
            `  \u2026 ${input.preview.hidden} more ${input.preview.hidden === 1 ? "line" : "lines"}`
          )
        );
      }
    }
    if (audit.success !== false && previewLines.length > 1) {
      for (const line of previewLines.slice(1)) {
        wrapLineIndexes?.add(rows.length);
        rows.push(line);
      }
    }
  }
  const callsHidden = input.audits.length - callsShown.length;
  if (callsHidden > 0) {
    const label = `\u2026 ${callsHidden} nested ${callsHidden === 1 ? "call" : "calls"} hidden`;
    rows.push(
      theme.fg("dim", label) + (input.expanded ? "" : theme.fg("dim", " \xB7 ") + expandHint(theme))
    );
  }
  return renderBoundedLines(
    rows,
    theme,
    input.core?.settings.diffIntensity ?? "off",
    wrapLineIndexes
  );
};
var CORE_TOOL_NAMES = /* @__PURE__ */ new Set(["bash", "read", "write", "edit", "grep", "find", "ls"]);
var captureFabricCoreToolPreviews = (audits, previous = []) => {
  const prior = previous.slice();
  return audits.flatMap((audit) => {
    if (!audit.tool || !CORE_TOOL_NAMES.has(audit.tool) || audit.provider !== "pi" && audit.ref !== `pi.${audit.tool}`) return [];
    const path = argString2(audit.args ?? {}, "path");
    const index = prior.findIndex(
      (candidate) => candidate.ref === audit.ref && argString2(candidate.args ?? {}, "path") === path
    );
    const old = index >= 0 ? prior.splice(index, 1)[0] : void 0;
    return [{
      ...old ?? {},
      ...audit,
      args: { ...old?.args ?? {}, ...audit.args ?? {} },
      ...audit.result !== void 0 ? { result: audit.result } : old?.result !== void 0 ? { result: old.result } : {},
      ...audit.preview !== void 0 ? { preview: audit.preview } : old?.preview !== void 0 ? { preview: old.preview } : {}
    }];
  });
};
var restoreFabricCoreToolPreviews = (audits, previews) => {
  const remaining = previews.slice();
  return audits.map((audit) => {
    if (!audit.tool || !CORE_TOOL_NAMES.has(audit.tool) || audit.provider !== "pi" && audit.ref !== `pi.${audit.tool}`) return audit;
    const path = argString2(audit.args ?? {}, "path");
    let index = remaining.findIndex(
      (preview2) => preview2.ref === audit.ref && argString2(preview2.args ?? {}, "path") === path
    );
    if (index < 0) index = remaining.findIndex((preview2) => preview2.ref === audit.ref);
    if (index < 0) return audit;
    const preview = remaining.splice(index, 1)[0];
    if (!preview) return audit;
    return {
      ...preview,
      ...audit,
      args: { ...preview.args ?? {}, ...audit.args ?? {} },
      ...audit.result !== void 0 ? { result: audit.result } : preview.result !== void 0 ? { result: preview.result } : {},
      ...audit.preview !== void 0 ? { preview: audit.preview } : preview.preview !== void 0 ? { preview: preview.preview } : {},
      ...audit.resultTruncated !== void 0 ? { resultTruncated: audit.resultTruncated } : preview.resultTruncated !== void 0 ? { resultTruncated: preview.resultTruncated } : {}
    };
  });
};
var captureFabricAgentPreviews = (audits, previous = []) => {
  const captured = previous.slice();
  const indexes = new Map(
    captured.map((preview, index) => [`${preview.ref}\0${preview.id}`, index])
  );
  for (const audit of audits) {
    if (!isFabricAgentToolPreview(audit.preview)) continue;
    const entry = { ref: audit.ref, id: audit.preview.id, preview: audit.preview };
    const key = `${entry.ref}\0${entry.id}`;
    const index = indexes.get(key);
    if (index === void 0) {
      indexes.set(key, captured.length);
      captured.push(entry);
    } else captured[index] = entry;
  }
  return captured;
};
var restoreFabricAgentPreviews = (audits, previews) => {
  const remaining = previews.slice();
  return audits.map((audit) => {
    if (isFabricAgentToolPreview(audit.preview)) return audit;
    const requestedId = argString2(audit.args ?? {}, "id");
    let index = requestedId ? remaining.findIndex((preview2) => preview2.ref === audit.ref && preview2.id === requestedId) : -1;
    if (index < 0) index = remaining.findIndex((preview2) => preview2.ref === audit.ref);
    if (index < 0) return audit;
    const preview = remaining.splice(index, 1)[0];
    return preview ? { ...audit, preview: preview.preview } : audit;
  });
};
var captureFabricWritePreviews = (audits) => audits.flatMap((audit) => {
  const rendererPreview = typeof audit.preview === "object" && audit.preview !== null && !Array.isArray(audit.preview) ? audit.preview : void 0;
  const content = audit.tool === "write" ? typeof rendererPreview?.writeContent === "string" ? rendererPreview.writeContent : argString2(audit.args ?? {}, "content") : void 0;
  if (content === void 0) return [];
  return [{ ref: audit.ref, path: argString2(audit.args ?? {}, "path"), content }];
});
var captureFabricCallHeadlinePreviews = (audits) => audits.flatMap((audit) => {
  const headline = callHeadlinePreview(audit);
  return headline ? [{ ref: audit.ref, headline }] : [];
});
var restoreFabricCallHeadlinePreviews = (audits, previews) => {
  const remaining = previews.slice();
  return audits.map((audit) => {
    const index = remaining.findIndex((preview2) => preview2.ref === audit.ref);
    if (index < 0) return audit;
    const [preview] = remaining.splice(index, 1);
    if (headlineArg(audit.args) || !preview) return audit;
    return { ...audit, previewHeadline: preview.headline };
  });
};
var restoreFabricWritePreviews = (audits, previews) => {
  const remaining = previews.slice();
  return audits.map((audit) => {
    if (audit.tool !== "write" || typeof audit.args?.content === "string") return audit;
    const path = argString2(audit.args ?? {}, "path");
    const index = remaining.findIndex(
      (preview2) => preview2.ref === audit.ref && preview2.path === path
    );
    if (index < 0) return audit;
    const [preview] = remaining.splice(index, 1);
    return preview ? { ...audit, args: { ...audit.args ?? {}, content: preview.content } } : audit;
  });
};
function nestedCallBody(audit) {
  if (audit.tool === "write" && typeof audit.args?.content === "string") {
    return audit.args.content;
  }
  const result = audit.result;
  if (typeof result === "string") return result;
  if (result !== null && typeof result === "object" && !Array.isArray(result)) {
    const obj = result;
    if (typeof obj.output === "string") return obj.output;
    if (typeof obj.text === "string") return obj.text;
  }
  return void 0;
}
var escapeControlChars4 = (text) => text.replace(/\x1b/g, "\u241B").replace(/\r/g, "\u240D").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "\uFFFD");
var lineDiff = (oldLines, newLines) => {
  const m = oldLines.length;
  const n = newLines.length;
  if (m * n > 1e6) {
    return [
      ...oldLines.map((line) => ({ kind: "-", content: line })),
      ...newLines.map((line) => ({ kind: "+", content: line }))
    ];
  }
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i2 = m - 1; i2 >= 0; i2--) {
    const oldLine = oldLines[i2] ?? "";
    const cur = dp[i2];
    const next = dp[i2 + 1];
    for (let j2 = n - 1; j2 >= 0; j2--) {
      const newLine = newLines[j2] ?? "";
      cur[j2] = oldLine === newLine ? (next[j2 + 1] ?? 0) + 1 : Math.max(next[j2] ?? 0, cur[j2 + 1] ?? 0);
    }
  }
  const out = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    const oldLine = oldLines[i] ?? "";
    const newLine = newLines[j] ?? "";
    if (oldLine === newLine) {
      out.push({ kind: " ", content: oldLine });
      i++;
      j++;
    } else if ((dp[i + 1][j] ?? 0) >= (dp[i][j + 1] ?? 0)) {
      out.push({ kind: "-", content: oldLine });
      i++;
    } else {
      out.push({ kind: "+", content: newLine });
      j++;
    }
  }
  while (i < m) {
    out.push({ kind: "-", content: oldLines[i] ?? "" });
    i++;
  }
  while (j < n) {
    out.push({ kind: "+", content: newLines[j] ?? "" });
    j++;
  }
  return out;
};
function nestedEditDiff(audit, theme, invalidate) {
  if (audit.tool !== "edit") return null;
  const args = audit.args ?? {};
  const edits = Array.isArray(args.edits) ? args.edits : [];
  if (edits.length === 0) return null;
  const lang = languageFromPath(typeof args.path === "string" ? args.path : void 0);
  const lines = [];
  for (const edit of edits.slice(0, 5)) {
    if (!edit || typeof edit !== "object") continue;
    const record = edit;
    const oldText = typeof record.oldText === "string" ? record.oldText : "";
    const newText = typeof record.newText === "string" ? record.newText : "";
    const diff = lineDiff(oldText.split("\n"), newText.split("\n"));
    if (diff.length === 0) continue;
    const oldHighlighted = lang ? highlightCode(
      diff.filter((entry) => entry.kind !== "+").map((entry) => entry.content).join("\n"),
      lang,
      invalidate
    ) : null;
    const newHighlighted = lang ? highlightCode(
      diff.filter((entry) => entry.kind !== "-").map((entry) => entry.content).join("\n"),
      lang,
      invalidate
    ) : null;
    let oldCursor = 0;
    let newCursor = 0;
    for (let index = 0; index < diff.length; index++) {
      const entry = diff[index];
      let text;
      if (entry.kind === "-") {
        text = oldHighlighted?.[oldCursor++];
      } else if (entry.kind === "+") {
        text = newHighlighted?.[newCursor++];
      } else {
        oldCursor++;
        text = newHighlighted?.[newCursor++];
      }
      const content = text != null ? text || " " : theme.fg("toolOutput", escapeControlChars4(entry.content) || " ");
      if (entry.kind === "+") {
        lines.push(`${theme.fg("toolDiffAdded", "+")} ${content}`);
      } else if (entry.kind === "-") {
        lines.push(`${theme.fg("toolDiffRemoved", "-")} ${content}`);
      } else {
        lines.push(`${theme.fg("toolDiffContext", " ")} ${content}`);
      }
    }
  }
  return lines.length > 0 ? lines : null;
}
var lineCountTrimmed = (value) => {
  const lines = value.split("\n");
  let end = lines.length;
  while (end > 0) {
    const last = lines[end - 1];
    if (last === void 0 || last.trim() === "") end--;
    else break;
  }
  return end;
};
function modelReadHint(audits, output, theme) {
  if (!output) return "";
  const modelLines = lineCountTrimmed(output);
  let readLines = 0;
  let sawRead = false;
  for (const audit of audits) {
    if (audit.tool !== "read") continue;
    const body = nestedCallBody(audit);
    if (typeof body !== "string") continue;
    sawRead = true;
    readLines += lineCountTrimmed(body);
  }
  if (!sawRead || modelLines >= readLines) return "";
  return theme.fg("warning", "\u2192 " + modelLines + " of " + readLines + " lines to model");
}

// src/ui/spinner.ts
var SPINNER_INTERVAL_MS = 250;
var SPINNER_FRAMES = ["\u25D0", "\u25D3", "\u25D1", "\u25D2"];
var spinnerFrame = (now = Date.now()) => SPINNER_FRAMES[Math.floor(now / SPINNER_INTERVAL_MS) % SPINNER_FRAMES.length];
var updateSpinner = (state, active, invalidate, now = Date.now()) => {
  if (!active) {
    if (state.timer) clearTimeout(state.timer);
    delete state.timer;
    return spinnerFrame(now);
  }
  if (!state.timer) {
    const delay = SPINNER_INTERVAL_MS - now % SPINNER_INTERVAL_MS;
    state.timer = setTimeout(() => {
      delete state.timer;
      invalidate();
    }, delay);
    state.timer.unref?.();
  }
  return spinnerFrame(now);
};

export {
  continueArcGroup,
  arcItemStyled,
  countNewlines,
  truncateMiddle,
  observePiTheme,
  languageFromPath,
  configureHighlighting,
  highlightCode,
  highlightFileLines,
  isCoreToolAudit,
  coreToolRendererEnabled,
  coreToolPreviewEnabled,
  renderCoreToolBody,
  coreToolTitle,
  safeTerminalText,
  inheritComponentBackground,
  renderBoundedLines,
  fabricMulticallCallLimit,
  expandHint,
  restoreLegacyBashCommands,
  renderFabricWriteArgumentPreview,
  nestedCallTitle,
  renderAgentToolPreviewLines,
  singleCallProgressLine,
  renderFabricMulticallPartial,
  captureFabricCoreToolPreviews,
  restoreFabricCoreToolPreviews,
  captureFabricAgentPreviews,
  restoreFabricAgentPreviews,
  captureFabricWritePreviews,
  captureFabricCallHeadlinePreviews,
  restoreFabricCallHeadlinePreviews,
  restoreFabricWritePreviews,
  nestedCallBody,
  nestedEditDiff,
  modelReadHint,
  spinnerFrame,
  updateSpinner,
  formatJsonAsYaml,
  formatFabricValue,
  safeText,
  formatActorDataPreview,
  formatDuration,
  formatTokens,
  formatCost,
  formatClock,
  padToWidth,
  wrapPlainText,
  activeStatuses,
  isActiveStatus,
  orderAgentsByCreation
};
//# sourceMappingURL=chunk-USXAEFZ2.js.map
