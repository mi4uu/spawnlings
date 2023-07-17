import { resolveTypes } from '@tsserver/resolve-types'
import { beforeAll, describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import ts from 'typescript'
import { getExports } from './get-export-parts'
import { exportsToTest } from './tests-internals/export.fixture'

describe('get-export-parts', () => {
  let host : ts.CompilerHost | undefined
  const options = {}
  let activeContent : string
  let files = Object.keys( exportsToTest ) as Array<keyof typeof exportsToTest>

  beforeAll( () => {
    files = Object.keys( exportsToTest ) as Array<keyof typeof exportsToTest>
    host = ts.createCompilerHost( options )
    host.writeFile = ( fileName : string, _contents : string ) => {
      console.log( `called writeFile: ${fileName}` )
    }
    host.getDirectories = ( path ) => {
      console.log( `called getDirectories: ${path}` )
      return []
    }
    host.getSourceFile = ( fileName : string ) => {
      if ( fileName in exportsToTest ) {
        return ts.createSourceFile(
          fileName,
          `
 ${exportsToTest[fileName as keyof typeof exportsToTest][0]}
 `,
          ts.ScriptTarget.Latest,
        )
      }
      else {
        const f = Bun.file( fileName )
        if ( f.size ) {
          return ts.createSourceFile(
            fileName,
            readFileSync( fileName, { encoding: 'utf-8' } ),
            ts.ScriptTarget.Latest,
          )
        }
        else {
          console.log( `!!!!!!!!! NO FILE : called getSourceFile: ${fileName}` )
        }
      }
    }

    host.fileExists = ( fileName : string ) => {
      console.log( `called fileExists: ${fileName}, RETURNED: ${fileName in files} ` )

      return fileName in files
    }
    host.readFile = ( fileName : string ) => {
      console.log( `called readFile: ${fileName}` )
      if ( fileName in files ) {
        return activeContent
      }
    }
    // end of BeforeAll
  } )
  test('getExports', () => {
    const program = ts.createProgram( {
      options: options,
      rootNames: [ ...files ],
      host,
      configFileParsingDiagnostics: [],
    } )
    expect( host ).toBeDefined()

    console.log( { emited: program.emit() } )
    const checker = program.getTypeChecker()
    const exports : [ string, ReturnType<typeof getExports> ][] = []
    for ( const fname of files ) {
      console.log( `checking file: ${fname}` )
      const source = program.getSourceFile( fname )
      expect( source ).toBeDefined()
      expect( source?.getText() ).toContain( 'export' )
      if ( source ) {
        const exportInfos = getExports( source, checker )

        exports.push( [ fname, exportInfos ] )
        resolveTypes( source, checker )
        expect( exportInfos ).toEqual( exportsToTest[fname as keyof typeof exportsToTest][1] )
      }
    }
    expect( exports.length ).toBe( files.length )
    const withExports = exports.filter(( e ) => e[1].some(( x ) => x.name || x.isDefault)).map(( f ) => ({
      fileName: f[0],
      exports: f[1],
      content: exportsToTest[f[0] as keyof typeof exportsToTest],
    }))
    console.log( '---------------WITHOUT EXPORTS' )
    //  console.log( withExports )
    const withoutExports = exports.filter(( e ) => e[1].every(( x ) => !x.name && !x.isDefault)).map(( f ) => ({
      fileName: f[0],
      exports: f[1],
      content: exportsToTest[f[0] as keyof typeof exportsToTest],
    }))
    // console.log( withoutExports )
  })
})
