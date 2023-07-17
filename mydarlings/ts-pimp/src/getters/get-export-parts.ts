import ts from 'typescript'
export interface Export {
  name : string
  typeOnly : boolean
  isDefault : boolean
  path : string[]
}

export const getExports = ( sourceFile : ts.SourceFile, checker : ts.TypeChecker ) : Export[] => {
  let exports : Export[] = []
  const moduleSymbol = checker.getSymbolAtLocation( sourceFile )
  if ( moduleSymbol ) {
    exports = checker.getExportsOfModule( moduleSymbol ).flatMap( ( symbol ) => {
      const isDefault = symbol.name === 'default'
      const isTypeExport = (symbol.flags & ts.SymbolFlags.Type) !== 0
      const isValueExport = (symbol.flags & ts.SymbolFlags.Value) !== 0
      const typeOnly = isTypeExport && !isValueExport
      return {
        name: symbol.name,
        isDefault,
        typeOnly,
        path: symbol.getDeclarations()?.map(
          ( x ) => x.getSourceFile().fileName,
          //  x.getText()
        ),
      }
    } )
  }
  return exports
}
