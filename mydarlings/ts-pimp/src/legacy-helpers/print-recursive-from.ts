import ts from "typescript";

export function printRecursiveFrom(
  node: ts.Node,
  indentLevel: number,
  sourceFile: ts.SourceFile,
) {
  const indentation = "-".repeat(indentLevel);
  const syntaxKind = ts.SyntaxKind[node.kind];
  const nodeText = node.getText(sourceFile);
  console.log(`${indentation}${syntaxKind}: ${nodeText}`);

  node.forEachChild((child) =>
    printRecursiveFrom(child, indentLevel + 1, sourceFile),
  );
}
