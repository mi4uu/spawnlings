import ts from "typescript";

export const parseTsConfig = (
  config: ts.CompilerOptions,
  currentDir: string,
  host?: ts.ParseConfigHost,
) => ts.parseJsonConfigFileContent(config, host ?? ts.sys, currentDir);
