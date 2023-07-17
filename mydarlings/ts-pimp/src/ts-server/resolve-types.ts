import ts from 'typescript'

export const resolveTypes = ( sourceFile : ts.SourceFile, checker : ts.TypeChecker ) => {
  const detectedComponents = []
  const getType = ( node : ts.Node ) => {
    if ( ts.isVariableStatement( node ) ) {
      for ( const declaration of node.declarationList.declarations ) {
        // 🚀 This is where the magic happens.
        const type = checker.getTypeAtLocation( declaration.name )
        //  console.log( 'x', type.getCallSignatures() )
        // console.log( 'x', checker.getExportsOfModule( declaration ) )
        // A type that has call signatures is a function type.
        for ( const callSignature of type.getCallSignatures() ) {
          const returnType = callSignature.getReturnType()
          if ( returnType.symbol?.getEscapedName().toString() === 'Element' ) {
            detectedComponents.push( declaration.name.getText() ) // was: declaration.name.text
          }
        }
      }
    }
    else {
      ts.forEachChild( node, getType )
    }
  }
  sourceFile.forEachChild( getType )

  // console.log( detectedComponents )
  return detectedComponents
}
