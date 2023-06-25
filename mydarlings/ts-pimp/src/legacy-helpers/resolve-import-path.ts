import fs from "fs";
import path from "path";
import { resolvePathPattern } from "./resolve-path-patern";
export async function resolveImportPath(importPath: string): Promise<string> {
  const tsconfigPath = path.resolve("tsconfig.json");
  console.log({ tsconfigPath });
  // const tsconfigText = fs.readFileSync(tsconfigPath, "utf-8");
  const tsconfigText = await Bun.file(tsconfigPath).json();
  console.log(tsconfigText);
  const transpiler = new Bun.Transpiler({
    loader: "js",
  });
  const tsconfig = tsconfigText;
  const baseUrl = tsconfig.compilerOptions.baseUrl;
  const paths = tsconfig.compilerOptions.paths;

  if (paths?.[importPath]) {
    const pathPatterns = paths[importPath];
    for (const pathPattern of pathPatterns) {
      const resolvedPath = resolvePathPattern(pathPattern);
      if (resolvedPath) {
        return resolvedPath;
      }
    }
  }

  return path.resolve(baseUrl, importPath);
}
