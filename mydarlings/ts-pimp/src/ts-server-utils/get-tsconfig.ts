import ts from "typescript";

export const getTsConfig = (
  override: {
    compilerOptions?: ts.CompilerOptions;
    include?: string[];
    exclude?: string[];
    files?: string[];
    extends?: string;
  } = {},
  currentDir = process.cwd(),
  tsconfigName: string | undefined = undefined,
  tsconfigPath: string | undefined = undefined,
) => {
  const configFile = tsconfigPath
    ? tsconfigPath
    : ts.findConfigFile(currentDir, ts.sys.fileExists, tsconfigName);
  if (!configFile) {
    throw Error("tsconfig.json not found");
  }
  const { config } = ts.readConfigFile(configFile, ts.sys.readFile);

  config.compilerOptions = Object.assign(
    {},
    config.compilerOptions,
    override.compilerOptions,
  );
  if (override.include) {
    config.include = override.include;
  }
  if (override.exclude) {
    config.exclude = override.exclude;
  }
  if (override.files) {
    config.files = override.files;
  }
  if (override.extends) {
    config.files = override.extends;
  }

  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
    config,
    ts.sys,
    currentDir,
  );

  return {
    options,
    fileNames,
    errors,
  };
};
export type TsConfig = ReturnType<typeof getTsConfig>;

export interface TsConfigOverride {
  compilerOptions?: ts.CompilerOptions;
  include?: string[];
  exclude?: string[];
  files?: string[];
  extends?: string;
}
