import ts from "typescript";

export const getPathsMappings = (
  tsConfig: ts.ParsedCommandLine,
  files: string[],
) => {
  const flatPathsMapping = Object.entries(tsConfig.options.paths ?? {})
    .flatMap(([alias, paths]) => paths.map((uri) => [alias, uri]))
    .sort(([a], [b]) => b.length - a.length || b.localeCompare(a));

  const barrelPaths = flatPathsMapping.filter(
    ([_alias, uri]) => !uri.includes("*"),
  );
  const dynamicPaths = flatPathsMapping
    .filter(([_alias, uri]) => uri.includes("*"))
    .map(([alias, uri]) => [alias.replace("*", ""), uri.replace("*", "")]);

  const filesAliasesArray = files.map((file) => {
    const aliases: string[] = dynamicPaths
      .filter(([_alias, uri]) => file.indexOf(uri) === 0)
      .map(([alias, uri]) =>
        file.replace(uri, alias).replace(removeExtension, "$1"),
      );

    return [file, aliases.length ? aliases : undefined];
  });
  const allFilesAliases = Object.fromEntries(filesAliasesArray);
  const filesWithAliases = Object.fromEntries(
    filesAliasesArray.filter(([_, aliases]) => Boolean(aliases)),
  );
  const filesWithoutAliases = Object.fromEntries(
    filesAliasesArray.filter(([_, aliases]) => Boolean(aliases)),
  );

  return {
    allFilesAliases,
    filesWithAliases,
    filesWithoutAliases,
    barrelPaths,
  };
};

const removeExtension = /(.*)(\.tsx?)$/;
