import ts from "typescript";
import type { TsConfig } from "./get-tsconfig";

export const createServer = ({ options, fileNames, errors }: TsConfig) => {
  const program = ts.createProgram({
    options,
    rootNames: fileNames,
    configFileParsingDiagnostics: errors,
  });

  const { diagnostics, emitSkipped } = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(diagnostics, errors);

  if (allDiagnostics.length) {
    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (path) => path,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: () => ts.sys.newLine,
    };
    const message = ts.formatDiagnostics(allDiagnostics, formatHost);
    console.warn(message);
  }

  if (emitSkipped) {
    throw Error("emitSkipped");
  }
};
