import ts from "typescript";

export const getOptions = (configPath: string): Promise<ts.CompilerOptions> => {
  const file = Bun.file(configPath);
  const json = file.json();
  return json;
};
