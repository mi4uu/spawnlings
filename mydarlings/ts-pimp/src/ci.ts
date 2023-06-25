import path from "path";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import fs from "fs";

const defaultPort = 9042;
export const getCliArgs = async () => {
  const args = await yargs(hideBin(process.argv))
    .option("port", {
      alias: "p",
      type: "number",
      description: "server port",
      default: defaultPort,
    })
    .option("verbose", {
      alias: "v",
      type: "boolean",
      description: "Run with verbose logging",
    })
    .option("baseDir", {
      alias: "d",
      type: "string",
      description: "Base directory of your project",

      required: false,
      // conflicts: "tsConfig",
    })
    .option("tsConfig", {
      alias: "c",
      type: "string",
      description: "tsconfig.json path",
      // conflicts: "baseDir",
    })

    .check((argv) => {
      // Require at least one option to be provided.
      if (argv.tsConfig || argv.baseDir) {
        return true;
      }
      return false;
    })
    .help()
    .strict()
    .parse();

  const port = getValue("port", args) ?? defaultPort;
  const verbose = Boolean(getValue("verbose", args));
  const _baseDir = getValue("baseDir", args);
  const tsConfig = getValue("tsConfig", args);

  const baseDir = resolveBaseDir(_baseDir, tsConfig);

  const config = {
    port,
    verbose,
    baseDir: baseDir,
    tsConfig: tsConfig
      ? path.resolve(tsConfig)
      : path.join(baseDir, "tsconfig.json"),
  };

  if (!fs.existsSync(config.tsConfig)) {
    throw Error(`File does not exist: ${config.tsConfig}`);
  }
  return config;
};

const getValue = <K extends keyof O, O>(key: K, obj: O) => {
  if (typeof obj === "object" && obj !== null && key in obj) {
    return obj[key];
  }
  return undefined;
};

// interface argsWithBaseDir {
//   baseDir: string;
//   tsConfig: string | undefined;
// }
// interface argsWithTsConfig {
//   baseDir: string | undefined;
//   tsConfig: string;
// }
// type ArgsRequired = argsWithBaseDir | argsWithTsConfig;

const resolveBaseDir = (
  baseDir: string | undefined,
  tsConfig: string | undefined,
) => {
  const dirToConsider = baseDir
    ? baseDir
    : tsConfig
    ? path.dirname(tsConfig)
    : undefined;
  if (!dirToConsider) {
    throw Error("No base dir found");
  }
  const absDir = path.resolve(dirToConsider);
  if (!fs.existsSync(absDir)) {
    throw Error(`Directory does not exist: ${absDir}`);
  }

  return absDir;
};

// /Users/zeno/Work/nano/acrocharge/apps/front/console/pages/_app.tsx
