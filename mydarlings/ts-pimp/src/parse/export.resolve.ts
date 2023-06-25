const regexp =
  /export\s+(?<default>default)?\s*(?<typeKeyword>type)?\s*([\w$][\w\d$]*)/g;
export const exportResolve = (content: string): ExportResolve[] =>
  [...content.matchAll(regexp)]
    .map((_export) => _export.groups)
    .filter(Boolean) as unknown as ExportResolve[];
export interface ExportResolve {
  name: string;
  default: "default" | undefined;
  type: "type" | undefined;
}
