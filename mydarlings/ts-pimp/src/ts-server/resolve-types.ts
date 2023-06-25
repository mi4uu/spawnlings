import ts from "typescript";

export const resolveTypes = (
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
) => {
  const detectedComponents = [];
  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        // 🚀 This is where the magic happens.
        const type = checker.getTypeAtLocation(declaration.name);

        // A type that has call signatures is a function type.
        for (const callSignature of type.getCallSignatures()) {
          const returnType = callSignature.getReturnType();
          if (returnType.symbol?.getEscapedName().toString() === "Element") {
            detectedComponents.push(declaration.name.getText()); // was: declaration.name.text
          }
        }
      }
    }
  }

  console.log(detectedComponents);
};
