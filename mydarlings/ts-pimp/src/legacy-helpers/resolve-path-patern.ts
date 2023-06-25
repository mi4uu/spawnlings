import fs from "fs";
import path from "path";
export function resolvePathPattern(pathPattern: string): string | undefined {
  const match = pathPattern.match(/\*$/);
  if (match) {
    const directoryPath = path.resolve(pathPattern.slice(0, -1));
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const filePath = path.resolve(directoryPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        const nestedFilePath = resolvePathPattern(`${filePath}/index`);
        if (nestedFilePath) {
          return nestedFilePath;
        }
      } else if (file.endsWith(".ts")) {
        return filePath;
      }
    }
  } else {
    const filePath = path.resolve(pathPattern);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
}
