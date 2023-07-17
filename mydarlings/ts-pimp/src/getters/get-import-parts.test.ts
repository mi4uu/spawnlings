import { describe, expect, test } from 'bun:test'
import ts from 'typescript'
import {
  getImportParts,
  getImportStringFromParts,
  ImportParts,
} from './get-import-parts'

const getImportsForString = (
  text : string,
) : [ ImportParts[], ts.ImportDeclaration[] ] => {
  const source = ts.createSourceFile(
    'x.ts',
    text,
    ts.ScriptTarget.Latest,
  )
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

describe('get-import-parts', () => {
  // Tests that the function works with a valid ts.ImportDeclaration node
  test('test_valid_import_declaration', () => {
    const [ imports ] = getImportsForString( `
   import { foo } from 'path/to/module';
   console.log("ssss")
   const bar = foo
   export default bar
   ` )

    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [ {
        name: 'foo',
        isType: false,
        renamedFrom: undefined,
      } ],
      defaultMember: undefined,
      asteriskImport: undefined,
      defaultIsType: false,
    } )
  })
  // Tests that the function works correctly with a valid ts.ImportDeclaration node with namedBindings
  test('test_valid_import_declaration_node_with_named_bindings', () => {
    const [ imports ] = getImportsForString( `
    import { foo as bar } from 'path/to/module';
    console.log("ssss")

    ` )

    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [ {
        name: 'bar',
        isType: false,
        renamedFrom: 'foo',
      } ],
      defaultMember: undefined,
      asteriskImport: undefined,
      defaultIsType: false,
    } )

    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import { foo as bar } from 'path/to/module'\n",
      )
  })

  // Tests that the function works correctly with a valid ts.ImportDeclaration node with namedBindings and default import
  test('test_valid_import_declaration_node_with_named_bindings_and_default_import', () => {
    const [ imports ] = getImportsForString( `
  import foo, { bar } from 'path/to/module';

  ` )

    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [ {
        name: 'bar',
        isType: false,
        renamedFrom: undefined,
      } ],
      defaultMember: 'foo',
      asteriskImport: undefined,
      defaultIsType: false,
    } )
    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import foo, { bar } from 'path/to/module'\n",
      )
  })

  // Tests that the function works correctly with a valid ts.ImportDeclaration node with namedBindings and renaming
  test('test_valid_import_declaration_node_with_named_bindings_and_renaming', () => {
    const [ imports ] = getImportsForString( `
  import { foo as bar, baz as qux } from 'path/to/module';

  ` )
    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [
        { name: 'bar', isType: false, renamedFrom: 'foo' },
        { name: 'qux', isType: false, renamedFrom: 'baz' },
      ],
      defaultMember: undefined,
      asteriskImport: undefined,
      defaultIsType: false,
    } )
    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import { foo as bar, baz as qux } from 'path/to/module'\n",
      )
  })
  // Tests that the function works correctly with a valid ts.ImportDeclaration node with namespace import
  test('test_valid_import_declaration_node_with_namespace_import', () => {
    const [ imports ] = getImportsForString( `
  import * as foo from 'path/to/module';


  ` )

    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [],
      defaultMember: undefined,
      asteriskImport: 'foo',
      defaultIsType: false,
    } )
    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import * as foo from 'path/to/module'\n",
      )
  })
})
describe('get imports with type import', () => {
  test('types import', () => {
    const [ imports ] = getImportsForString( `
    import someDefault, { type foo as bar, baz as qux } from 'path/to/module';
    import defaultExport, * as name from "module-name";
    import type someThingHere from "@myModule"

    ` )
    expect( imports ).toHaveLength( 3 )

    expect( imports[0] ).toEqual( {
      importPath: 'path/to/module',
      namedMembers: [
        { name: 'bar', isType: true, renamedFrom: 'foo' },
        { name: 'qux', isType: false, renamedFrom: 'baz' },
      ],
      defaultMember: 'someDefault',
      asteriskImport: undefined,
      defaultIsType: false,
    } )
    expect( imports[1] ).toEqual( {
      importPath: 'module-name',
      namedMembers: [],
      defaultMember: 'defaultExport',
      asteriskImport: 'name',
      defaultIsType: false,
    } )
    expect( imports[2] ).toEqual( {
      importPath: '@myModule',
      namedMembers: [],
      defaultMember: 'someThingHere',
      asteriskImport: undefined,
      defaultIsType: true,
    } )
    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import someDefault, { type foo as bar, baz as qux } from 'path/to/module'\n",
      )
    expect( getImportStringFromParts( imports[1] ) )
      .toMatch(
        "import defaultExport, * as name from 'module-name'\n",
      )
    expect( getImportStringFromParts( imports[2] ) )
      .toMatch(
        "import type someThingHere from '@myModule'\n",
      )
  })

  test('types import 2', () => {
    const [ imports, declarations ] = getImportsForString( `
      import type { foo, baz as qux } from '#someLib2';
      ` )
    expect( imports ).toHaveLength( 1 )

    expect( imports[0] ).toEqual( {
      importPath: '#someLib2',
      namedMembers: [
        {
          name: 'foo',
          isType: true,
          renamedFrom: undefined,
        },
        { name: 'qux', isType: true, renamedFrom: 'baz' },
      ],
      defaultMember: undefined,
      asteriskImport: undefined,
      defaultIsType: false,
    } )
    expect( getImportStringFromParts( imports[0] ) )
      .toMatch(
        "import { type foo, type baz as qux } from '#someLib2'\n",
      )
  })
})
