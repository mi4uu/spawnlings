import ts from 'typescript'

export const getExportParts = (
  node : ts.ExportDeclaration,
) => {
  const exportClause = node.exportClause

  let namedMembers : { [key : string] : boolean } = {}
  let defaultMember : string | undefined
  let asteriskExport = false
  let renaming : { [key : string] : string } = {}

  if ( exportClause ) {
    if ( ts.isNamespaceExport( exportClause ) ) {
      asteriskExport = true
    }
    else {
      exportClause.elements.forEach( ( elem ) => {
        const name = elem.name.getText()
        const isType = elem.propertyName != null
        namedMembers[name] = isType
      } )
    }
  }
  else {
    defaultMember = node
            .exportClause == null && node
          .moduleSpecifier != null
      ? 'default'
      : undefined
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
    namedMembers,
    defaultMember,
    asteriskExport,
    renaming,
    pos0: node.getStart(),
    pos1: node.getEnd(),
  }
}
