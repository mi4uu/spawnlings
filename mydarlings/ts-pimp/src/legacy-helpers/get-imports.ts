import ts from "typescript";
import { iterate } from "./helpers";
import assert from "assert";
//import Bun from "bun";

export interface Import {
  path: string;
  resolvedPath: string;
}

export async function getImports(
  filePath: string,
  options: ts.CompilerOptions,
): Promise<Import[]> {
  const defaultOptions = {
    strict: true,
    target: ts.ScriptTarget.Latest,
  };
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

  // const myImports = exports
  //   .flatMap((_export) => {
  //     return _export.declarations?.flatMap((declaration) => {
  //       return "imports" in declaration.parent
  //         ? declaration.parent.imports
  //         : undefined;
  //     });
  //   })
  //   .filter(Boolean);

  // console.log({ myImports });
  // for (const ii of myImports) {
  //   const i = ii as any;
  //   console.log({
  //     name: "name" in i && i.name,
  //     moduleSpecifier: "moduleSpecifier" in i && i.moduleSpecifier,
  //     resolvedModules: "resolvedModules" in i && i.resolvedModules,
  //     text: "text" in i && i.text,
  //     kind: ts.SyntaxKind[i.kind],
  //   });
  // }

  if (!source) {
    throw new Error(`Could not find source file ${filePath}`);
  }

  const imports: Import[] = [];

  function visitNode(node: ts.Node) {
    // console.log({ node: node.getText() });
    if (ts.isImportDeclaration(node)) {
      const importPath = node.moduleSpecifier.getText();
      // const resolvedPath = await resolveImportPath(importPath);
      imports.push({ path: importPath, resolvedPath: importPath });
    }
    ts.forEachChild(node, visitNode);
  }
  //console.log("zasyslem plik: ", sourceFile.fileName);
  //console.log(sourceFile.text);
  const childNodes = source.getChildren();

  // const transpiler = new Bun.Transpiler({
  //   loader: "tsx",
  //   tsconfig:
  //     "/Users/zeno/Work/nano/acrocharge/apps/front/console/tsconfig.json",
  // });

  // // const result = transpiler.scanImports(source.getFullText());
  // const result = transpiler.scan(source.getFullText());

  // console.log({ result });

  // const ftoken = sourceFile.getFirstToken();
  // console.log(ftoken?.getText());
  //console.log(`childrens: ${childNodes.length}`);

  //iterate(childNodes);

  const t = await source.forEachChild(visitNode);

  //visitNode(sourceFile);

  return imports;
}

// const imports = await getImports(
//   "/Users/zeno/Work/nano/acrocharge/apps/front/console/pages/_app.tsx",
// );
// console.log("\n\n\n----------\n");
// console.log({ imports: imports });
