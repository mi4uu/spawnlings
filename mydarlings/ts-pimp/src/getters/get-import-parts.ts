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
    else if ( ts.isNamedImports( namedBindings ) ) {
      namedBindings.elements.forEach( ( elem ) => {
        namedMembers.push( {
          name: elem.name.text,
          isType: importClause.isTypeOnly
            || elem.isTypeOnly,
          renamedFrom: elem.propertyName?.escapedText as
            | string
            | undefined,
        } )
      } )
    }
  }

  if ( importClause && ts.isImportClause( importClause ) ) {
    if ( importClause.name ) {
      defaultMember = importClause.name.text
    }
    if (
      importClause.namedBindings
      && ts.isNamespaceImport(
        importClause.namedBindings,
      )
    ) {
      asteriskImport = importClause.namedBindings.name.text
    }
  }

  return {
    importPath,
    namedMembers,
    defaultMember,
    asteriskImport,
    defaultIsType: Boolean( defaultMember )
      && importClause?.isTypeOnly,
  }
}

export const getImportStringFromParts = (
  parts : ImportParts,
) => {
  const defaultPart = parts.defaultMember
    ? `${
      parts.defaultIsType ? 'type ' : ''
    } ${parts.defaultMember}`
    : undefined
  const namedParts = parts.namedMembers?.length
    ? '{ ' + parts
      .namedMembers
      .map( ( member ) => {
        const name = member.renamedFrom
          ? `${
            member.renamedFrom ?? member.name
          } as ${member.name}`
          : member.name
        return `${member.isType ? 'type ' : ''}${name}`
      } )
      .join( ', ' )
      + ' }'
    : undefined
  const asterriskPart = parts.asteriskImport
    ? `* as ${parts.asteriskImport}`
    : undefined
  const imports = [ defaultPart, asterriskPart, namedParts ]
    .filter( Boolean )
    .join( ', ' )

  return `import ${imports} from '${parts.importPath}'\n`
    .replaceAll( /\s{2,}/g, ' ' )
}
