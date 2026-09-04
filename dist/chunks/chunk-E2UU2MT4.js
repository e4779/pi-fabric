// src/runtime/type-checker.ts
import path from "node:path";
import ts from "typescript";
var compilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeNext,
  strict: false,
  noImplicitAny: false,
  strictNullChecks: false,
  strictFunctionTypes: false,
  strictBindCallApply: false,
  alwaysStrict: false,
  strictPropertyInitialization: false,
  noImplicitThis: false,
  useUnknownInCatchVariables: false,
  noEmit: false,
  sourceMap: true,
  skipLibCheck: true,
  lib: ["lib.es2022.d.ts"]
};
var TYPE_CORRECTNESS_CODES = /* @__PURE__ */ new Set([
  2339,
  2551,
  2322,
  2345,
  2367,
  2531,
  2532,
  18047,
  18048,
  7006,
  7008,
  7019,
  7031,
  7032,
  7033,
  7034
]);
var nextCheckerId = 0;
var normalizeTypeScriptPath = (fileName) => fileName.replaceAll("\\", "/");
var wrapFabricGuestCode = (code) => `async function __piFabricMain() {
${code}
}
`;
var FabricTypeChecker = class {
  constructor(declarations) {
    this.declarations = declarations;
    const id = ++nextCheckerId;
    this.#guestFile = normalizeTypeScriptPath(path.resolve(`/__pi_fabric_guest_${id}.ts`));
    this.#declarationFile = normalizeTypeScriptPath(
      path.resolve(`/__pi_fabric_globals_${id}.d.ts`)
    );
    this.#sourceFile = ts.createSourceFile(
      this.#guestFile,
      "",
      ts.ScriptTarget.ES2022,
      true
    );
    this.#declarationSource = ts.createSourceFile(
      this.#declarationFile,
      declarations,
      ts.ScriptTarget.ES2022,
      true
    );
    const isGuestFile = (fileName) => this.#baseHost.getCanonicalFileName(normalizeTypeScriptPath(fileName)) === this.#baseHost.getCanonicalFileName(this.#guestFile);
    const isDeclarationFile = (fileName) => this.#baseHost.getCanonicalFileName(normalizeTypeScriptPath(fileName)) === this.#baseHost.getCanonicalFileName(this.#declarationFile);
    this.#host = {
      ...this.#baseHost,
      fileExists: (fileName) => isGuestFile(fileName) || isDeclarationFile(fileName) || this.#baseHost.fileExists(fileName),
      readFile: (fileName) => {
        if (isGuestFile(fileName)) return this.#sourceText;
        if (isDeclarationFile(fileName)) return this.declarations;
        return this.#baseHost.readFile(fileName);
      },
      getSourceFile: (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
        if (isGuestFile(fileName)) return this.#sourceFile;
        if (isDeclarationFile(fileName)) return this.#declarationSource;
        const cached = this.#stableFiles.get(fileName);
        if (cached) return cached;
        const source = this.#baseHost.getSourceFile(
          fileName,
          languageVersion,
          onError,
          shouldCreateNewSourceFile
        );
        if (source) this.#stableFiles.set(fileName, source);
        return source;
      }
    };
  }
  #guestFile;
  #declarationFile;
  #baseHost = ts.createCompilerHost(compilerOptions, true);
  #stableFiles = /* @__PURE__ */ new Map();
  #declarationSource;
  #host;
  #sourceText = "";
  #sourceFile;
  #program;
  check(code) {
    this.#sourceText = wrapFabricGuestCode(code);
    this.#sourceFile = ts.createSourceFile(
      this.#guestFile,
      this.#sourceText,
      ts.ScriptTarget.ES2022,
      true
    );
    const program = ts.createProgram({
      rootNames: [this.#declarationFile, this.#guestFile],
      options: compilerOptions,
      host: this.#host,
      ...this.#program ? { oldProgram: this.#program } : {}
    });
    this.#program = program;
    const diagnostics = [
      ...program.getSyntacticDiagnostics(this.#sourceFile),
      ...program.getSemanticDiagnostics(this.#sourceFile).filter((diagnostic) => !TYPE_CORRECTNESS_CODES.has(diagnostic.code))
    ];
    const errors = diagnostics.map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (!diagnostic.file || diagnostic.start === void 0) {
        return { line: 0, column: 0, message };
      }
      const position = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
      return {
        line: Math.max(1, position.line),
        column: position.character + 1,
        message
      };
    });
    if (errors.length > 0) return { errors };
    let javascript;
    let sourceMap;
    program.emit(this.#sourceFile, (fileName, content) => {
      if (fileName.endsWith(".js.map")) sourceMap = content;
      else if (fileName.endsWith(".js")) javascript = content;
    });
    return {
      errors,
      ...javascript ? { javascript } : {},
      ...sourceMap ? { sourceMap } : {}
    };
  }
};
var checkerCache = /* @__PURE__ */ new Map();
var MAX_CHECKERS = 4;
var checkerFor = (declarations) => {
  const cached = checkerCache.get(declarations);
  if (cached) {
    checkerCache.delete(declarations);
    checkerCache.set(declarations, cached);
    return cached;
  }
  const checker = new FabricTypeChecker(declarations);
  checkerCache.set(declarations, checker);
  while (checkerCache.size > MAX_CHECKERS) {
    const oldest = checkerCache.keys().next().value;
    if (oldest === void 0) break;
    checkerCache.delete(oldest);
  }
  return checker;
};
var transpileFabricCodeWithSourceMap = (code) => {
  const result = ts.transpileModule(wrapFabricGuestCode(code), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      sourceMap: true
    }
  });
  return {
    code: result.outputText,
    ...result.sourceMapText ? { sourceMap: result.sourceMapText } : {}
  };
};
var typeCheckFabricCode = (code, declarations) => checkerFor(declarations).check(code);

export {
  normalizeTypeScriptPath,
  wrapFabricGuestCode,
  transpileFabricCodeWithSourceMap,
  typeCheckFabricCode
};
//# sourceMappingURL=chunk-E2UU2MT4.js.map
