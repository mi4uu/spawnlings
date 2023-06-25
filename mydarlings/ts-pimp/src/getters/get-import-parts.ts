import ts from 'typescript'

export const getImportParts = (
  node : ts.ImportDeclaration,
) => {
  const importClause = node.importClause
  const importPath = node.moduleSpecifier.getText().slice(
    1,
    -1,
  )
  const namedBindings = importClause
    && importClause.namedBindings

  let namedMembers : { [key : string] : boolean } = {}
  let defaultMember : string | undefined
  let asteriskImport = false
  let renaming : { [key : string] : string } = {}

  if ( namedBindings ) {
    if ( ts.isNamespaceImport( namedBindings ) ) {
      asteriskImport = true
    }
    else {
      namedBindings.elements.forEach( ( elem ) => {
        const name = elem.name.getText()
        const isType = elem.propertyName != null
        namedMembers[name] = isType
      } )
    }
  }

  if ( importClause && importClause.name ) {
    defaultMember = importClause.name.getText()
  }

  if (
    Object.keys( namedMembers ).length
    && Object.keys( namedMembers ).some(( name ) =>
      name.includes( ' as ' )
    )
  ) {
    Object.keys( namedMembers ).forEach( ( name ) => {
      const [ before, after ] = name.split( ' as ' )
      renaming[before.trim()] = after.trim()
    } )
  }

  return {
    importPath,
    namedMembers,
    defaultMember,
    asteriskImport,
    renaming,
    pos0: node.getStart(),
    pos1: node.getEnd(),
  }
}
