import { parseTsConfig } from '@tsserver/config/parse-ts-config'
import { readRawTsConfig } from '@tsserver/config/read-raw-ts-config'
import { createTsHost } from '@tsserver/create-ts-host'
import fs from 'fs'
import path from 'path'
import ts from 'typescript'
import { getAllFiles } from './get-all-files'
import { Export, getExports } from './get-export-parts'
import { getImportParts, getImportStringFromParts, ImportParts } from './get-import-parts'
import { getPathsMappings } from './get-paths-mappings'

const baseDir = '/Users/zeno/Work/nano/acrocharge'
const fileExists = ( src : string ) => {
  try {
    fs.accessSync( src, fs.constants.F_OK )
  }
  catch (e) {
    console.log( e )
    return false
  }
  return true
}

const getNewPathMappings = () => {
  const allFiles = getAllFiles( baseDir )
  const dirs = allFiles
    .filter(( dir ) => !(dir.includes( '__test__' ) || dir.includes( '__tests__' ) || dir.includes( 'jest' )))
    .map( ( file ) => {
      const parts = file.split( '/src/' )
      if ( parts.length < 2 ) {
        //    console.warn( parts )
        return undefined
      }
      return parts[0] + '/src/'
    } )
    .filter( Boolean )

  const libsDirs = dirs.filter(( dir ) => dir.startsWith( 'libs' ))
  const uDirs = Array.from( new Set( libsDirs ) ) as string[]
  const projectDirs = uDirs.filter(( dir ) =>
    fileExists( `${path.join( baseDir, dir ).replace( '/src/', '/tsconfig.json' )}` )
  )

  // uDirs.filter( ( dir ) => {
  //   const p = `${dir?.replace( '/src/', '/tsconfig.json' )}`
  //   console.log( p )
  //   return p
  // } )

  //  console.log( projectDirs )
  console.log( { potentialPathsCount: projectDirs.length } )
  const prefix = '#libs/'
  const paths = projectDirs.map( ( dir ) => {
    const namePartsAll = dir.split( '/' )
    namePartsAll.pop()
    namePartsAll.pop()
    namePartsAll.shift()
    const nameParts = [ ...new Set( namePartsAll ) ]
    const name = [ prefix, nameParts.join( '-' ), '/*' ].join( '' )
    return [ name, `./${dir}*` ]
  } )
  console.log( paths )
}

const getImportsForString = ( source : ts.SourceFile ) : [ ImportParts[], ts.ImportDeclaration[] ] => {
  const imports : ReturnType<typeof getImportParts>[] = []
  const importDeclarations : ts.ImportDeclaration[] = []
  source?.forEachChild( ( child ) => {
    if ( ts.isImportDeclaration( child ) ) {
      imports.push( getImportParts( child ) )
      importDeclarations.push( child )
    }
  } )
  return [ imports, importDeclarations ]
}

const getImportsDetails = (
  source : ts.SourceFile,
  checker : ts.TypeChecker,
) : [ ImportParts[], ts.ImportDeclaration[] ] => {
  const imports : ReturnType<typeof getImportParts>[] = []
  const importDeclarations : ts.ImportDeclaration[] = []

  source.forEachChild( ( child ) => {
    if ( ts.isImportDeclaration( child ) ) {
      const importDeclaration = child
      const importDeclarationSymbol = checker.getSymbolAtLocation( importDeclaration.moduleSpecifier )
      const importedFrom = `${importDeclarationSymbol?.getName()}`
      if ( importedFrom.includes( 'node_modules' ) ) {
        return
      }
      console.log( importDeclaration.getText(), ' --> ', importDeclarationSymbol?.getName() )
      const importParts = getImportParts( importDeclaration )
      importDeclarationSymbol?.getDeclarations()?.forEach( ( importDeclarationDeclaration ) => {
        //  console.log( x.getSourceFile().fileName )
        const moduleSymbol = checker.getSymbolAtLocation( importDeclarationDeclaration.getSourceFile() )
        const exports = getExports( importDeclarationDeclaration.getSourceFile(), checker )
        const name = moduleSymbol?.getName()
        const mapped = moduleSymbol?.getDeclarations()?.map(( exportDeclaration ) =>
          exportDeclaration.getSourceFile().fileName
        )
        const namedMappings = importParts.namedMembers.map( ( namedImports ) => {
          const namedMapped = exports.find(( exportName ) =>
            exportName.name === namedImports.name || exportName.name === namedImports.renamedFrom
          )
          if ( namedMapped ) {
            return namedMapped.path[0]
          }
        } )
        console.log( { name, mapped, exports, namedMappings } )
      } )
    }
  } )
  return [ imports, importDeclarations ]
}

const resolvex = ( sourceFile : ts.SourceFile, program : ts.Program ) => {
  ts.forEachChild( sourceFile, function visit( node ) {
    if ( ts.isImportDeclaration( node ) ) {
      const importDeclaration = node as ts.ImportDeclaration
      const moduleSpecifier = importDeclaration.moduleSpecifier.getText()
      const resolvedModule = ts.resolveModuleName(
        moduleSpecifier,
        sourceFile.fileName,
        program.getCompilerOptions(),
        ts.sys,
      )

      if ( resolvedModule.resolvedModule ) {
        const importedFrom = resolvedModule.resolvedModule.resolvedFileName
        console.log( `Imported from: ${importedFrom}` )
      }
    }

    ts.forEachChild( node, visit )
  } )
}

// buildIn resolving seems useless
const getMeta = async () => {
  const allFiles = getAllFiles( baseDir )
  const inputFiles = allFiles.map(( x ) => path.resolve( baseDir, x ))
  const configRaw = await readRawTsConfig(
    { exclude: [], files: inputFiles },
    path.resolve( baseDir, 'tsconfig.base.json' ),
  )
  const { host } = createTsHost( configRaw, false, false )
  const tsConfig = parseTsConfig( configRaw, baseDir )
  const program = ts.createProgram( {
    options: tsConfig.options,
    rootNames: [ ...inputFiles ],
    host,
    configFileParsingDiagnostics: [], // tsConfig.errors,
  } )
  const checker = program.getTypeChecker()

  const currentMappings = getPathsMappings( tsConfig, allFiles )

  const filesWithMeta : Record<string, { exports? : Export[]; imports? : ImportParts[] }> = {}
  for ( const file of inputFiles ) {
    const source = program.getSourceFile( file )
    if ( source ) {
      const exports = getExports( source, checker )
      if ( exports ) {
        filesWithMeta[file] = { exports }
      }

      const imports = getImportsForString( source )[0]
      if ( imports ) {
        if ( filesWithMeta[file] ) {
          filesWithMeta[file].imports = imports
        }
        else {
          filesWithMeta[file] = { imports }
        }
      }
      getImportsDetails( source, checker )
    }
    //  program.emit()
  }
  //  console.log( filesWithMeta )
}

// buildIn resolving seems useless
const getFileImports = async () => {
  const allFiles = getAllFiles( baseDir )
  const inputFiles = allFiles.map(( x ) => path.resolve( baseDir, x ))
  const configRaw = await readRawTsConfig(
    { exclude: [], files: inputFiles },
    path.resolve( baseDir, 'tsconfig.base.json' ),
  )
  const { host } = createTsHost( configRaw, false, false )
  const tsConfig = parseTsConfig( configRaw, baseDir )
  const program = ts.createProgram( {
    options: tsConfig.options,
    rootNames: [ ...inputFiles ],
    host,
    configFileParsingDiagnostics: [], // tsConfig.errors,
  } )

  //  const checker = program.getTypeChecker()
  for ( const file of inputFiles ) {
    const ast = program.getSourceFile( file )
    program.emit()

    if ( ast ) {
      //  console.log( ast.resolvedModules.forEach(( x ) => console.log( { resolvedModule: x } )) )
      const imports = getImportsForString( ast )[0]
      const nonLocal = imports.filter(( x ) => !(x.importPath.startsWith( './' ) || x.importPath.startsWith( '../' )))
      const mapOfResolved = nonLocal.map( ( x ) => {
        try {
          const importStatement = getImportStringFromParts( x ).replace( '\n', '' )
          const resolved = ts.resolveModuleName( importStatement, ast.fileName, program.getCompilerOptions(), ts.sys )

          return [ x.importPath, importStatement, resolved.resolvedModule?.resolvedFileName ]
        }
        catch (e) {
          console.log( e )
          return undefined
        }
      } )
      const mapOfResolved2 = getImportsForString( ast )[1].map( ( x ) => {
        try {
          const importStatement = x.moduleSpecifier.getText().replaceAll( '"', '' ).replaceAll( "'", '' )
          console.log( { importStatement } )

          const resolved = ts.resolveModuleName( importStatement, ast.fileName, program.getCompilerOptions(), ts.sys )
          return {
            isExternal: resolved?.resolvedModule?.isExternalLibraryImport,
            reslovedPath: resolved.resolvedModule?.resolvedFileName,
          }
        }
        catch (e) {
          console.log( x.kind, ts.SyntaxKind[x.kind] )
          console.log( ast.fileName, e.message, '😢' )
          console.log( String( x ).slice( 0, 100 ) )
          //    console.log( e )
          //  console.log( program.getCompilerOptions() )
          return undefined
        }
      } )

      console.log( file, mapOfResolved2 )
    }
    else {
      console.error( `parsing ast for file ${file} failed! 😢😢😢😢` )
    }
  }
}

getNewPathMappings()
// await getFileImports()
await getMeta()
