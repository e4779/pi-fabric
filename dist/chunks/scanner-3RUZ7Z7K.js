import {
  stableJsonHash
} from "./chunk-2DGB2R4E.js";

// src/speculation/scanner.ts
import ts from "typescript";
var ROOTS = /* @__PURE__ */ new Set(["pi", "memory", "state", "schema", "compact", "components", "mcp"]);
var LITERAL_FAIL = Symbol("literal-fail");
var literalOk = (value) => ({ ok: true, value });
var LITERAL_FAIL_RESULT = { ok: false };
var isJsonShape = (value) => {
  if (value === null) return true;
  switch (typeof value) {
    case "string":
    case "boolean":
      return true;
    case "number":
      return Number.isFinite(value);
    case "object": {
      if (Array.isArray(value)) return value.every(isJsonShape);
      const record = value;
      return Object.values(record).every(isJsonShape);
    }
    default:
      return false;
  }
};
var evalLiteral = (node) => {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return literalOk(node.text);
  }
  if (ts.isNumericLiteral(node)) {
    if (node.text.endsWith("n")) return LITERAL_FAIL_RESULT;
    const value = Number(node.text);
    return Number.isFinite(value) ? literalOk(value) : LITERAL_FAIL_RESULT;
  }
  if (ts.isPrefixUnaryExpression(node) && (node.operator === ts.SyntaxKind.MinusToken || node.operator === ts.SyntaxKind.PlusToken) && ts.isNumericLiteral(node.operand)) {
    if (node.operand.text.endsWith("n")) return LITERAL_FAIL_RESULT;
    const value = Number(node.operand.text);
    if (!Number.isFinite(value)) return LITERAL_FAIL_RESULT;
    return literalOk(node.operator === ts.SyntaxKind.MinusToken ? -value : value);
  }
  if (node.kind === ts.SyntaxKind.TrueKeyword) return literalOk(true);
  if (node.kind === ts.SyntaxKind.FalseKeyword) return literalOk(false);
  if (node.kind === ts.SyntaxKind.NullKeyword) return literalOk(null);
  if (ts.isArrayLiteralExpression(node)) {
    const items = [];
    for (const element of node.elements) {
      if (ts.isSpreadElement(element) || ts.isOmittedExpression(element)) return LITERAL_FAIL_RESULT;
      const item = evalLiteral(element);
      if (!item.ok) return item;
      items.push(item.value);
    }
    return literalOk(items);
  }
  if (ts.isObjectLiteralExpression(node)) {
    const record = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) return LITERAL_FAIL_RESULT;
      const name = property.name;
      if (!ts.isIdentifier(name) && !ts.isStringLiteral(name)) return LITERAL_FAIL_RESULT;
      const value = evalLiteral(property.initializer);
      if (!value.ok) return value;
      record[name.text] = value.value;
    }
    return literalOk(record);
  }
  return LITERAL_FAIL_RESULT;
};
var collectBoundNames = (name, into) => {
  if (ts.isIdentifier(name)) {
    into.add(name.text);
    return;
  }
  for (const element of name.elements) {
    if (ts.isBindingElement(element)) collectBoundNames(element.name, into);
  }
};
var accessChain = (node) => {
  const segments = [];
  let current = node;
  while (ts.isPropertyAccessExpression(current)) {
    segments.unshift(current.name.text);
    current = current.expression;
  }
  if (!ts.isIdentifier(current)) return void 0;
  segments.unshift(current.text);
  return segments;
};
var refFromChain = (segments, tainted) => {
  const root = segments[0];
  if (!ROOTS.has(root) || tainted.has(root)) return void 0;
  if (segments.length === 2) return `${segments[0]}.${segments[1]}`;
  if (segments.length === 3 && root === "mcp") return segments.join(".");
  return void 0;
};
var LiteralCallScanner = class {
  #scannedLength = 0;
  #tainted = /* @__PURE__ */ new Set();
  #emitted = /* @__PURE__ */ new Set();
  push(code) {
    const appended = code.slice(this.#scannedLength);
    const forceScan = code.length < this.#scannedLength;
    if (!forceScan && !appended.includes(")")) return [];
    this.#scannedLength = code.length;
    const source = ts.createSourceFile(
      "speculation.ts",
      code,
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.TS
    );
    for (const statement of source.statements) {
      this.#collectStatementBindings(statement, this.#tainted);
    }
    const candidates = [];
    const visit = (node) => {
      if (ts.isCallExpression(node)) {
        const segments = accessChain(node.expression);
        if (segments) {
          const ref = refFromChain(segments, this.#tainted);
          if (ref) {
            const args = this.#literalArgs(node);
            if (args !== void 0) {
              const key = `${ref}
${stableJsonHash(args)}`;
              if (!this.#emitted.has(key)) {
                this.#emitted.add(key);
                candidates.push({ ref, args });
              }
            }
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
    return candidates;
  }
  // Zero-arg calls mean `{}`; a single object literal is the documented
  // fabric calling convention. Positional multi-arg calls are skipped: their
  // normalization lives on the guest bridge, and guessing here would risk
  // keying the speculation store on the wrong argument shape.
  #literalArgs(node) {
    if (node.arguments.length === 0) return {};
    if (node.arguments.length !== 1) return void 0;
    const only = node.arguments[0];
    if (ts.isSpreadElement(only)) return void 0;
    const value = evalLiteral(only);
    if (!value.ok) return void 0;
    if (typeof value.value !== "object" || value.value === null || Array.isArray(value.value) || !isJsonShape(value.value)) {
      return void 0;
    }
    return value.value;
  }
  #collectStatementBindings(node, into) {
    const visit = (current) => {
      if (ts.isVariableDeclaration(current)) collectBoundNames(current.name, into);
      else if ((ts.isFunctionDeclaration(current) || ts.isClassDeclaration(current)) && current.name) {
        into.add(current.name.text);
      } else if (ts.isFunctionExpression(current) || ts.isArrowFunction(current) || ts.isMethodDeclaration(current)) {
        for (const parameter of current.parameters) collectBoundNames(parameter.name, into);
      } else if (ts.isImportDeclaration(current) && current.importClause) {
        const clause = current.importClause;
        if (clause.name) into.add(clause.name.text);
        if (clause.namedBindings) {
          if (ts.isNamespaceImport(clause.namedBindings)) {
            into.add(clause.namedBindings.name.text);
          } else {
            for (const element of clause.namedBindings.elements) into.add(element.name.text);
          }
        }
      }
      ts.forEachChild(current, visit);
    };
    visit(node);
  }
};
export {
  LiteralCallScanner
};
//# sourceMappingURL=scanner-3RUZ7Z7K.js.map
