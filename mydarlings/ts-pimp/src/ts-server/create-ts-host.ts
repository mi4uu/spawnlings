import ts from "typescript";
export const createTsHost = (
  options: ts.CompilerOptions,
  verbose?: boolean,
  keepGeneratedFiles?: boolean,
) => {
  const createdFiles: string[][] = [];

  const host = ts.createCompilerHost(options);
  host.writeFile = (fileName: string, contents: string) => {
    if (verbose) {
      console.log(`writing file ${fileName}`);
    }
    if (keepGeneratedFiles) {
      createdFiles.push([fileName, contents]);
    }
  };
  return {
    host,
    getCreatedFiles: () => createdFiles,
  };
};

// export const createDummyTsHost = (
//   options: ts.CompilerOptions,
//   verbose?: boolean,
//   keepGeneratedFiles?: boolean,
// ) => {

//   const host: ts.CompilerHost = {
//     fileExists() {
//       return true;
//     },
//     getCanonicalFileName() {
//       return parseSettings.filePath;
//     },
//     getCurrentDirectory() {
//       return '';
//     },
//     getDirectories() {
//       return [];
//     },
//     getDefaultLibFileName() {
//       return 'lib.d.ts';
//     },

//     // TODO: Support Windows CRLF
//     getNewLine() {
//       return '\n';
//     },
//     getSourceFile(filename: string) {
//       return ts.createSourceFile(
//         filename,
//         parseSettings.code,
//         ts.ScriptTarget.Latest,
//         /* setParentNodes */ true,
//        'ts', //?
//       );
//     },
//     readFile() {
//       return undefined;
//     },
//     useCaseSensitiveFileNames() {
//       return true;
//     },
//     writeFile() {
//       return null;
//     },
//   };
//   return {
//     host,
//     getCreatedFiles: () => [],
//   };
// };
