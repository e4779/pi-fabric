// src/ui/fabric-code-parser.ts
var identifierStart = (char) => /[A-Za-z_$π]/u.test(char);
var identifierPart = (char) => /[A-Za-z0-9_$π]/u.test(char);
var readEscape = (source, index) => {
  const char = source[index];
  if (char === void 0) return { value: "", next: index };
  const simple = {
    n: "\n",
    r: "\r",
    t: "	",
    b: "\b",
    f: "\f",
    v: "\v",
    0: "\0"
  };
  if (char in simple) return { value: simple[char], next: index + 1 };
  if (char === "\n") return { value: "", next: index + 1 };
  if (char === "\r") return { value: "", next: source[index + 1] === "\n" ? index + 2 : index + 1 };
  if (char === "x") {
    const digits = source.slice(index + 1, index + 3);
    if (/^[0-9a-f]{2}$/i.test(digits)) return { value: String.fromCharCode(Number.parseInt(digits, 16)), next: index + 3 };
  }
  if (char === "u") {
    if (source[index + 1] === "{") {
      const end = source.indexOf("}", index + 2);
      const digits2 = end < 0 ? "" : source.slice(index + 2, end);
      if (/^[0-9a-f]{1,6}$/i.test(digits2)) {
        return { value: String.fromCodePoint(Number.parseInt(digits2, 16)), next: end + 1 };
      }
    }
    const digits = source.slice(index + 1, index + 5);
    if (/^[0-9a-f]{4}$/i.test(digits)) return { value: String.fromCharCode(Number.parseInt(digits, 16)), next: index + 5 };
  }
  return { value: char, next: index + 1 };
};
var tokenize = (source) => {
  const tokens = [];
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    if (/\s/u.test(char)) {
      index++;
      continue;
    }
    if (char === "/" && source[index + 1] === "/") {
      index = source.indexOf("\n", index + 2);
      if (index < 0) break;
      continue;
    }
    if (char === "/" && source[index + 1] === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end < 0 ? source.length : end + 2;
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      const quote = char;
      let value = "";
      let dynamicTemplate = false;
      index++;
      while (index < source.length) {
        const current = source[index];
        if (current === quote) {
          index++;
          break;
        }
        if (quote === "`" && current === "$" && source[index + 1] === "{") dynamicTemplate = true;
        if (current === "\\") {
          const escaped = readEscape(source, index + 1);
          value += escaped.value;
          index = escaped.next;
          continue;
        }
        value += current;
        index++;
      }
      if (!dynamicTemplate) tokens.push({ kind: "string", text: value });
      continue;
    }
    if (identifierStart(char)) {
      const start = index++;
      while (index < source.length && identifierPart(source[index])) index++;
      tokens.push({ kind: "identifier", text: source.slice(start, index) });
      continue;
    }
    tokens.push({ kind: "punctuation", text: char });
    index++;
  }
  return tokens;
};
var fabricStringLiterals = (code) => tokenize(code).filter((token) => token.kind === "string").map((token) => token.text);
var propertyName = (token) => token?.kind === "identifier" || token?.kind === "string" ? token.text : void 0;
var namedStringKey = (tokens, start, end) => {
  if (tokens[start]?.text !== "\u03C0") return void 0;
  if (tokens[start + 1]?.text === "." && tokens[start + 2]?.kind === "identifier" && start + 3 === end) {
    return tokens[start + 2].text;
  }
  if (tokens[start + 1]?.text === "[" && tokens[start + 2]?.kind === "string" && tokens[start + 3]?.text === "]" && start + 4 === end) {
    return tokens[start + 2].text;
  }
  return void 0;
};
var objectBinding = (tokens, start) => {
  let depth = 1;
  let index = start + 1;
  let path;
  let stringKey;
  while (index < tokens.length && depth > 0) {
    if (tokens[index]?.text === "{") {
      depth++;
      index++;
      continue;
    }
    if (tokens[index]?.text === "}") {
      depth--;
      index++;
      continue;
    }
    if (depth !== 1) {
      index++;
      continue;
    }
    const name = propertyName(tokens[index]);
    if (!name || tokens[index + 1]?.text !== ":") {
      index++;
      continue;
    }
    const valueStart = index + 2;
    let valueEnd = valueStart;
    let nested = 0;
    while (valueEnd < tokens.length) {
      const text = tokens[valueEnd].text;
      if (nested === 0 && (text === "," || text === "}")) break;
      if (text === "(" || text === "[" || text === "{") nested++;
      else if (text === ")" || text === "]" || text === "}") nested--;
      valueEnd++;
    }
    if (["path", "file", "file_path"].includes(name) && valueEnd === valueStart + 1 && tokens[valueStart]?.kind === "string") {
      path = tokens[valueStart].text;
    } else if (["content", "text", "contents"].includes(name)) {
      stringKey = namedStringKey(tokens, valueStart, valueEnd);
    }
    index = valueEnd;
  }
  return path !== void 0 && stringKey !== void 0 ? { binding: { path, stringKey }, next: index } : { next: index };
};
var fabricWriteBindings = (code) => {
  const tokens = tokenize(code);
  const bindings = [];
  for (let index = 0; index < tokens.length - 5; index++) {
    if (tokens[index]?.text !== "pi" || tokens[index + 1]?.text !== "." || tokens[index + 2]?.text !== "write" || tokens[index + 3]?.text !== "(" || tokens[index + 4]?.text !== "{") continue;
    const parsed = objectBinding(tokens, index + 4);
    if (parsed.binding) bindings.push(parsed.binding);
    index = parsed.next - 1;
  }
  return bindings;
};
var TITLE_MAX_CHARS = 80;
var TITLE_MAX_ANCHOR_CHARS = 40;
var TITLE_MAX_COMMAND_CHARS = 30;
var TITLE_MAX_TASK_CHARS = 40;
var TITLE_MAX_PATTERN_CHARS = 24;
var TITLE_MAX_KEY_CHARS = 24;
var TITLE_MAX_WINDOW_TOKENS = 96;
var TITLE_SAFE_ANCHOR = /^[A-Za-z0-9_./~@*+,-]+$/;
var TITLE_FILE_LIKE = /\.[A-Za-z0-9]{1,8}$/;
var PI_VERB_LABELS = {
  read: "Read",
  bash: "Shell",
  edit: "Edit",
  write: "Write",
  grep: "Search",
  find: "Search",
  ls: "Search"
};
var ROOT_VERB_LABELS = {
  agents: "Agent",
  memory: "Memory",
  state: "State",
  schema: "Schema",
  compact: "Compact",
  mesh: "Mesh",
  tools: "Tools"
};
var TITLE_PATH_KEYS = /* @__PURE__ */ new Set(["path", "file", "file_path"]);
var humanizeIdentifier = (value) => value.replace(/[_-]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (char) => char.toUpperCase());
var titleAnchorPathLike = (value) => value.length > 0 && value.length <= 64 && TITLE_SAFE_ANCHOR.test(value) && (value.includes("/") || TITLE_FILE_LIKE.test(value) || value.includes("*"));
var titleBasename = (value) => value.split("/").filter(Boolean).pop() ?? value;
var titleClip = (value, maxChars) => value.length > maxChars ? `${value.slice(0, maxChars - 1)}\u2026` : value;
var clipWords = (value, maxChars) => {
  if (value.length <= maxChars) return value;
  const cut = value.slice(0, maxChars - 1);
  const space = cut.lastIndexOf(" ");
  return `${space > 0 ? cut.slice(0, space) : cut}\u2026`;
};
var callWindow = (tokens, openIndex) => {
  let depth = 0;
  let end = openIndex;
  while (end < tokens.length && end - openIndex < TITLE_MAX_WINDOW_TOKENS) {
    const text = tokens[end].text;
    if (text === "(" || text === "[" || text === "{") depth++;
    else if (text === ")" || text === "]" || text === "}") {
      depth--;
      if (depth <= 0) break;
    }
    end++;
  }
  return { start: openIndex + 1, end };
};
var isNamedStringToken = (tokens, index) => tokens[index]?.kind === "string" && tokens[index - 1]?.text === "[" && tokens[index - 2]?.text === "\u03C0";
var windowKeyedString = (tokens, start, end, keys) => {
  for (let index = start; index < end; index++) {
    if (tokens[index]?.kind !== "string" || isNamedStringToken(tokens, index)) continue;
    if (tokens[index - 1]?.text !== ":") continue;
    const key = propertyName(tokens[index - 2]);
    if (key === void 0 || !(typeof keys === "string" ? key === keys : keys.has(key))) continue;
    return tokens[index].text;
  }
  return void 0;
};
var windowFirstString = (tokens, start, end) => {
  for (let index = start; index < end; index++) {
    if (tokens[index]?.kind === "string" && !isNamedStringToken(tokens, index)) return tokens[index].text;
  }
  return void 0;
};
var windowPathLike = (tokens, start, end) => {
  for (let index = start; index < end; index++) {
    if (tokens[index]?.kind === "string" && !isNamedStringToken(tokens, index) && titleAnchorPathLike(tokens[index].text)) {
      return tokens[index].text;
    }
  }
  return void 0;
};
var dirQualifier = (value) => TITLE_FILE_LIKE.test(titleBasename(value)) ? titleClip(titleBasename(value), TITLE_MAX_ANCHOR_CHARS) : TITLE_SAFE_ANCHOR.test(value) && value !== "." && value.length <= TITLE_MAX_ANCHOR_CHARS ? value : void 0;
var searchTarget = (tokens, start, end) => {
  const pattern = windowKeyedString(tokens, start, end, "pattern");
  let head;
  if (pattern !== void 0) {
    if (titleAnchorPathLike(pattern)) head = titleClip(titleBasename(pattern), TITLE_MAX_ANCHOR_CHARS);
    else if (TITLE_SAFE_ANCHOR.test(pattern) && pattern.length <= TITLE_MAX_PATTERN_CHARS) head = `"${pattern}"`;
  }
  const pathValue = windowKeyedString(tokens, start, end, TITLE_PATH_KEYS);
  let tail = pathValue !== void 0 ? dirQualifier(pathValue) : void 0;
  if (tail === void 0 && pathValue === void 0) {
    const positional = windowFirstString(tokens, start, end);
    if (positional !== void 0 && TITLE_SAFE_ANCHOR.test(positional) && positional.length <= TITLE_MAX_ANCHOR_CHARS) {
      tail = titleAnchorPathLike(positional) ? titleClip(titleBasename(positional), TITLE_MAX_ANCHOR_CHARS) : positional;
    }
  }
  if (head !== void 0 && tail !== void 0) return `${head} in ${tail}`;
  return head ?? tail;
};
var pathTarget = (tokens, start, end) => {
  const keyed = windowKeyedString(tokens, start, end, TITLE_PATH_KEYS);
  if (keyed !== void 0 && TITLE_FILE_LIKE.test(titleBasename(keyed))) {
    return titleClip(titleBasename(keyed), TITLE_MAX_ANCHOR_CHARS);
  }
  const loose = windowPathLike(tokens, start, end);
  if (loose !== void 0) return titleClip(titleBasename(loose), TITLE_MAX_ANCHOR_CHARS);
  return keyed !== void 0 ? dirQualifier(keyed) : void 0;
};
var piCallTarget = (label, tokens, start, end) => {
  if (label === "Shell") {
    const command = windowFirstString(tokens, start, end);
    return command !== void 0 ? titleClip(command.split("\n")[0], TITLE_MAX_COMMAND_CHARS) : void 0;
  }
  if (label === "Search") return searchTarget(tokens, start, end);
  return pathTarget(tokens, start, end);
};
var fabricExecTitleHint = (code) => {
  const tokens = tokenize(code);
  const groups = /* @__PURE__ */ new Map();
  const record = (verb, target) => {
    const list = groups.get(verb);
    if (list) list.push(target);
    else groups.set(verb, [target]);
  };
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index];
    if (token.kind !== "identifier") continue;
    if ((token.text === "agents" || token.text === "compact") && tokens[index + 1]?.text === "(") {
      const window = callWindow(tokens, index + 1);
      const target = token.text === "agents" ? (() => {
        const task = windowKeyedString(tokens, window.start, window.end, "task");
        return task !== void 0 ? clipWords(task.split("\n")[0], TITLE_MAX_TASK_CHARS) : void 0;
      })() : void 0;
      record(ROOT_VERB_LABELS[token.text], target);
      continue;
    }
    const dot = tokens[index + 1];
    const leaf = tokens[index + 2];
    if (dot?.text !== "." || leaf?.kind !== "identifier") continue;
    if (token.text === "pi" && tokens[index + 3]?.text === "(") {
      const label = PI_VERB_LABELS[leaf.text] ?? humanizeIdentifier(leaf.text);
      const window = callWindow(tokens, index + 3);
      record(label, piCallTarget(label, tokens, window.start, window.end));
      continue;
    }
    if (token.text === "mcp" && tokens[index + 3]?.text === "." && tokens[index + 4]?.kind === "identifier" && tokens[index + 5]?.text === "(") {
      record("Mcp", `${leaf.text}.${tokens[index + 4].text}`);
      continue;
    }
    if (tokens[index + 3]?.text === "(") {
      const label = ROOT_VERB_LABELS[token.text];
      if (!label) continue;
      if (token.text === "memory" || token.text === "state") {
        const window = callWindow(tokens, index + 3);
        const key = windowKeyedString(tokens, window.start, window.end, "key");
        record(label, key !== void 0 ? clipWords(key.split("\n")[0], TITLE_MAX_KEY_CHARS) : void 0);
      } else {
        record(label, void 0);
      }
    }
  }
  if (groups.size === 0) return void 0;
  const segments = [];
  for (const [verb, targets] of groups) {
    const first = targets.find((target) => target !== void 0);
    let segment = verb;
    if (first !== void 0) {
      segment = `${verb} ${first}`;
      if (targets.length > 1) {
        segment += targets.every((target) => target === first) ? ` \xD7${targets.length}` : ` +${targets.length - 1}`;
      }
    } else if (targets.length > 1) {
      segment += ` \xD7${targets.length}`;
    }
    segments.push(segment);
  }
  let title;
  let overflow = false;
  for (const segment of segments) {
    if (title === void 0) {
      title = segment.length <= TITLE_MAX_CHARS ? segment : clipWords(segment, TITLE_MAX_CHARS);
      continue;
    }
    const candidate = `${title} + ${segment}`;
    if (candidate.length <= TITLE_MAX_CHARS) {
      title = candidate;
      continue;
    }
    overflow = true;
    break;
  }
  if (overflow && title !== void 0 && title.length + 3 <= TITLE_MAX_CHARS) title = `${title} +\u2026`;
  return title;
};

export {
  fabricStringLiterals,
  fabricWriteBindings,
  fabricExecTitleHint
};
//# sourceMappingURL=chunk-4IZKKHJM.js.map
