const getImportsRegex =
  /import(?:(?:(?:[ \n\t]+(?<default>[^ *\n\t\{\},]+)[ \n\t]*(?:,|[ \n\t]+))?(?<named>[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)|[ \n\t]*\*[ \n\t]*as[ \n\t]+(?<wildcard>[^ \n\t\{\}]+)[ \n\t]+)from[ \n\t]*(?:['"])(?<path>[^'"\n]+)(?<quote>['"])/gim;

const importsParse = (content: string) => {
  const matches = [...content.matchAll(getImportsRegex)];

  console.log(matches);
};
