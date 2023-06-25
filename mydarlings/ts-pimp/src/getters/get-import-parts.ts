import ts from 'typescript'

interface NamedMember {
  name : string
  isType : boolean
  renamedFrom? : string
}
export interface ImportParts {
  importPath : string
  namedMembers : NamedMember[]
  defaultMember? : string
  asteriskImport? : string
  defaultIsType? : boolean
}
export const getImportParts = (
  node : ts.ImportDeclaration,
) : ImportParts => {
  if ( !ts.isImportDeclaration( node ) ) {
    throw Error( 'not an import declaration' )
  }

  const importClause = node.importClause
  const importPath = 'text' in node.moduleSpecifier
    ? node.moduleSpecifier.text as string
    : node.moduleSpecifier.getText().slice(
      1,
      -1,
    )
  const namedBindings = importClause
    && importClause.namedBindings

  let namedMembers : NamedMember[] = []
  let defaultMember : string | undefined
  let asteriskImport = undefined

  if ( namedBindings ) {
    if ( ts.isNamespaceImport( namedBindings ) ) {
      asteriskImport = namedBindings
        .name
        ?.escapedText as string
    }
    else {
      namedBindings.elements.forEach( ( elem ) => {
        namedMembers.push( {
          name: elem.name.text,
          isType: elem.isTypeOnly,
          renamedFrom: elem.propertyName?.escapedText as
            | string
            | undefined,
        } )
      } )
    }
  }

  if ( importClause && importClause.name ) {
    defaultMember = importClause.name.text
    importClause.isTypeOnly
  }

  return {
    importPath,
    namedMembers,
    defaultMember: importClause?.name?.text,
    asteriskImport,
    defaultIsType: importClause && importClause.isTypeOnly,
  }
}
