import { expect, test } from 'bun:test'
import ts from 'typescript'
import { getImportParts } from './get-import-parts'

test('2 + 2', () => {
  expect( 2 + 2 ).toBe( 4 )
})

// Tests that the function works with a valid ts.ImportDeclaration node
test('test_valid_import_declaration', () => {
  const node = ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports( [
        ts.createImportSpecifier(
          undefined,
          ts.createIdentifier( 'foo' ),
        ),
      ] ),
    ),
    ts.createStringLiteral( 'path/to/module' ),
  )

  const result = getImportParts( node )

  expect( result ).toEqual( {
    importPath: 'path/to/module',
    namedMembers: { foo: false },
    defaultMember: undefined,
    asteriskImport: false,
    renaming: {},
    pos0: 0,
    pos1: 34,
  } )
})
