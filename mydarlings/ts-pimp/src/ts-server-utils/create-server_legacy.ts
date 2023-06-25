import assert from "assert";
import ts from "typescript";

export const createServer = (filePath: string, options: ts.CompilerOptions) => {
  const createdFiles = new Map();
  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName: string, contents: string) => {
    createdFiles.set(fileName, contents);
  };
  const program = ts.createProgram([filePath], options, host);
  const emitResult = program.emit();
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(filePath);

  assert(source);
  const moduleSymbol = checker.getSymbolAtLocation(source);

  assert(moduleSymbol);
  const exports = checker.getExportsOfModule(moduleSymbol);
  return {
    createdFiles,
    host,
    program,
    emitResult,
    checker,
    source,
    moduleSymbol,
    exports,
  };
};
