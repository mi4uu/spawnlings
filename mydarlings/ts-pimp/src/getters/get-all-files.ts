import { fdir } from "fdir";

const includeRegexp =
  /^(?!.*(?:node_modules|\.vscode|\.history)).*\/+.*\.tsx?$/;

export const getAllFiles = (rootDir: string) => {
  const files = new fdir()
    .filter((path) => {
      return includeRegexp.test(path);
    })
    .withRelativePaths()
    .crawl(rootDir)
    .sync();

  return files;
};
