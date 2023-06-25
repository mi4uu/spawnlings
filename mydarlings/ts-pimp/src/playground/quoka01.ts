import ts from 'typescript'
const options = {}
const host = ts.createCompilerHost( options )
host.writeFile = (
  fileName : string,
  contents : string,
) => {
  console.log( `called writeFile: ${fileName}` )
}
host.getDirectories = ( path ) => {
  console.log( `called getDirectories: ${path}` )
  return []
}

host.fileExists = ( fileName : string ) => {
  console.log( `called fileExists: ${fileName}` )
  return true
}
host.readFile = ( fileName : string ) => {
  console.log( `called readFile: ${fileName}` )
  return ` import { foo } from 'path/to/module';
  `
}

const source = ts.createSourceFile(
  'x.ts',
  `
import { foo } from 'path/to/module';
`,
  ts.ScriptTarget.Latest,
)

const program = ts.createProgram( {
  options: options,
  rootNames: [ './x.ts' ],
  host,
  configFileParsingDiagnostics: [], // tsConfig.errors,
} )

console.log( { emited: program.emit() } )

const source2 = program.getSourceFile( './x.ts' )

source2?.forEachChild( ( child ) => {
  console.log( ts.SyntaxKind[child.kind] )
} )
