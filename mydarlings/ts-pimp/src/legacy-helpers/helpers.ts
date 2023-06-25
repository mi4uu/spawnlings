import ts from "typescript";

export const iterate = (nodes: ts.Node[]) => {
  const goodNodes: ts.Node[] = [];
  for (const n of nodes) {
    try {
      const text = n.getText();
      console.log(
        `[${ts.SyntaxKind[n.kind]}] ${n.pos} - ${n.end} (${
          text.length
        } len) : ${makeItShort(text)}`,
      );

      console.log(n.getText());
      goodNodes.push(n);
    } catch (error) {
      console.log(`[${ts.SyntaxKind[n.kind]}] ${n.pos} - ${n.end} Error`);
    }
  }

  const children = goodNodes.flatMap((node) => {
    try {
      return node.getChildren();
    } catch (error) {
      console.log("cant get children of node:");
      console.log(`${node.pos} - ${node.end}`);
    }
  });
  const r = children.filter(Boolean);
  iterate(r as ts.Node[]);
};

export const makeItShort = (str: string) =>
  str.length > 10
    ? `${str.substring(0, 7)}... ${str.substring(str.length - 3)}`
    : str;

const arr = [1, 2, 2, 3, 3, 4, 5, 6] as const;
