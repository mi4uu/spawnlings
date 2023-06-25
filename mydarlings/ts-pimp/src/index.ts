// import jc from "json-cycle";
import { getPathsMappings } from '@get/get-paths-mappings'
import { parseTsConfig } from '@tsserver/config/parse-ts-config'
import { readRawTsConfig } from '@tsserver/config/read-raw-ts-config'
import { createTsHost } from '@tsserver/create-ts-host'
import assert from 'assert'
import chalk from 'chalk'
import { resolve } from 'path'
import ts, { SyntaxKind } from 'typescript'
import { getCliArgs } from './ci'
import { getAllFiles } from './getters/get-all-files'
import { measureit } from './utils/measure'

const args = await getCliArgs()
console.log( `htop -p ${process.pid}` )
console.log( { parsedArgs: args } )

let measure = measureit( 'readRawTsConfig' )
const configRaw = await readRawTsConfig(
  {
    exclude: [],
  },
  args.tsConfig,
)
console.log( measure.stop() )
// console.log({ configRaw });

const { host, getCreatedFiles } = createTsHost(
  configRaw,
  args.verbose,
  true,
)
const tsConfig = parseTsConfig( configRaw, args.baseDir )

console.log(
  '--------------------------------------------------',
)

// console.log({
//   tsConfigOptions: tsConfig.options,
// });
// console.log("--------------------------------------------------");
measure = measureit( 'get files' )
const allFiles = getAllFiles( args.baseDir )
const mapped = getPathsMappings( tsConfig, allFiles )
console.log( measure.stop() )

console.log( {
  allFiles: allFiles.length,
  withAliases: Object
    .keys( mapped.filesWithAliases )
    .length,
  withMultipleAliases: Object
    .values( mapped.filesWithAliases )
    .filter(
      ( x ) => (x as string[]).length > 1,
    )
    .length,
  withoutAliases: Object
    .keys( mapped.filesWithoutAliases )
    .length,
} )
if ( args.verbose ) {
  console.log( allFiles.filter )
}

console.log(
  '==================================================',
)

const inputFile =
  '/Users/zeno/Work/nano/acrocharge/apps/front/console/pages/_app.tsx'
// const program = ts.createProgram([inputFile], tsConfig.options, host);
// .slice(0, 500)
const inputFiles = allFiles.map(( x ) =>
  resolve( args.baseDir, x )
)

const genAstOnlyOptions : ts.CompilerOptions = {
  ...tsConfig.options,
}
measure = measureit( 'create program' )
const program = ts.createProgram( {
  options: genAstOnlyOptions,
  rootNames: [ ...inputFiles ],
  host,
  configFileParsingDiagnostics: [], // tsConfig.errors,
} )
console.log( measure.stop() )

measure = measureit( 'emit' )
const emitResult = program.emit()
console.log( {
  emitedFiles: emitResult.emittedFiles?.length,
  emitSkipped: emitResult.emitSkipped,
  diagnostics: emitResult.diagnostics,
} )
console.log( measure.stop() )
const genFiles = getCreatedFiles()
const genFilesNames = genFiles.map(( x ) => x[0])
const genUniqueFilesNames = new Set( genFilesNames )
console.log( {
  genFiles: genFilesNames.length,
  genUniqueFilesNames: genUniqueFilesNames.size,
} )
// console.log({emitResult})

// const allDiagnostics = ts
//   .getPreEmitDiagnostics(program)
//   .concat(emitResult.diagnostics, tsConfig.errors);

// if (allDiagnostics.length && args.verbose) {
//   const formatHost: ts.FormatDiagnosticsHost = {
//     getCanonicalFileName: (path) => path,
//     getCurrentDirectory: ts.sys.getCurrentDirectory,
//     getNewLine: () => ts.sys.newLine,
//   };
//   const message = ts.formatDiagnostics(allDiagnostics, formatHost);
//   console.warn(message);
// }

const getFileDetails = (
  program : ts.Program,
  fileSrc : string,
) => {
  const stat = {
    nodes: 0,
    lines: 0,
    imports: 0,
    exports: 0,
  }
  const source = program.getSourceFile( fileSrc ) // ?? program.getSourceFileByPath(fileSrc);
  function visitNode( node : ts.Node ) {
    stat.nodes += 1
    // const importsStat = {
    //   isNamedImports: ts.isNamedImports(node),
    //   isImportDeclaration: ts.isImportDeclaration(node),
    //   isImportEqualsDeclaration: ts.isImportEqualsDeclaration(node),
    //   isImportClause: ts.isImportClause(node),
    //   isImportTypeAssertionContainer: ts.isImportTypeAssertionContainer(node),
    //   isNamespaceImport: ts.isNamespaceImport(node),
    //   isImportSpecifier: ts.isImportSpecifier(node),
    // }

    if ( ts.isImportDeclaration( node ) ) {
      stat.imports += 1
      const importPath = node.moduleSpecifier.getText()
      const details = getImportParts( node )
      console.log( importPath, details )
    }
    if ( ts.isExportDeclaration( node ) ) {
      stat.imports += 1
    }
    ts.forEachChild( node, visitNode )
  }
  if ( source ) {
    stat.lines = source.text.split( '\n' ).length
    source.forEachChild( visitNode )

    return stat
  }
  else {
    //   console.log(program.getRootFileNames())
    console.warn(
      { source },
      `File does not exist: ${fileSrc}`,
    )

    throw Error( `File does not exist: ${fileSrc}` )
  }
}

measure = measureit( 'get files details' )
const stat = {
  nodes: 0,
  lines: 0,
  imports: 0,
  files: 0,
  errors: 0,
}
for ( const f of inputFiles ) {
  // console.log(`File ${f}:`)
  // const measureFile = measureit("get details")
  try {
    const result = getFileDetails( program, f )
    stat.files += 1
    stat.nodes += result.nodes
    stat.lines += result.lines
    stat.imports += result.imports
  }
  catch (error) {
    stat.errors += 1
  }

  // console.log(result)
  // console.log(measureFile.stop())

  // console.log(emitResult.map.get(f))
}
console.log( { stat } )
console.log( measure.stop() )

// const checker = program.getTypeChecker();

// const sourceFileSymbol = checker.getSymbolAtLocation(source);
// if (sourceFileSymbol) {
//   const exports = checker.getExportsOfModule(sourceFileSymbol);
//   for (const ex of exports) {
//     console.log({
//       name: ex.name,
//       exports: ex.exports,
//       globEx: ex.globalExports,
//     });
//   }
// } else {
//   console.error("no exports");
// }
// console.log(emitResult.diagnostics);
// console.log(
//   Object.fromEntries(
//     Object.entries(mapped.filesWithAliases).filter(
//       ([file, aliases]) => (aliases as string[]).length > 1,
//     ),
//   ),
// );
// console.log({ args });
// bun run start -d /Users/zeno/Work/nano/acrocharge/ -c  /Users/zeno/Work/nano/acrocharge/tsconfig.base.json

// const imports = await getImports(inputFile, tsConfig);
// const server = createServer(config);
// }

// const server = createServer(inputFile, tsConfig);
// console.log({
//   emited: server.emitResult.emittedFiles,
//   created: server.createdFiles,
//   skiped: server.emitResult.emitSkipped,
//   compilerOptions: server.program.getCompilerOptions(),
// });

// const st = jc.decycle(server.source.statements);
// console.log("d");
// console.log(jc.stringify(st, null, 2));
// console.log(JSON.stringify(server.createdFiles, null, 2));
// console.log({ imports: imports });
