const input = `
import type { TsConfig } from "./get-tsconfig";
import { getCliArgs, getAllFiles } from "./ci";
import { createTsHost, getPathsMappings as getPath, parseTsConfig } from "@tsserver/create-ts-host"
import ts, { SyntaxKind } from "typescript";
import Document,
{ Html,
  Head,
  Main, NextScript
  , DocumentContext }
from 'next/document'

import * as assert from "assert"
import chalk  from "chalk";

export const Log = (a:string, b:number)=>console.log(a,b)
const Log2 = Log
export default Log2

export const lorem = "lorem ipsum"
export type Lorem = typeof lorem
type LogResponse = ReturnType<typeof Log>

module.exports.toList = function(options = {}) {
  options.isListForm = true;

  return module.exports(options);
};
`
// console.log(input);
// atoms
const NAME = String.raw`(?<name>[\w$][\w\d]*)`
const PREFIX = String.raw`import\s.*`
const POSTFIX = String.raw`/s+from/s['"](?<path>.+)['"]`

const getImportsRegex =
  /import(?:(?:(?:[ \n\t]+(?<default>[^ *\n\t\{\},]+)[ \n\t]*(?:,|[ \n\t]+))?(?<named>[ \n\t]*\{(?:[ \n\t]*[^ \n\t"'\{\}]+[ \n\t]*,?)+\})?[ \n\t]*)|[ \n\t]*\*[ \n\t]*as[ \n\t]+(?<wildcard>[^ \n\t\{\}]+)[ \n\t]+)from[ \n\t]*(?:['"])(?<path>[^'"\n]+)(?<quote>['"])/gim
// co//nst regex = new RegExp(getImportsRegex, "gim");
const match = [ ...input.matchAll( getImportsRegex ) ]
console.log(
  match
    .filter(( m ) => Boolean( m.groups ))
    .flatMap(( m ) => m.groups as unknown as Import),
)
const imports : Import[] =
  [ ...input.matchAll( getImportsRegex ) ]
    .map(( r ) =>
      r.groups
        ? {
          ...r.groups,
          named: undefined as string[][] | undefined,
          _named: r
            .groups
            .named
            ?.replaceAll( /[{}]/g, '' )
            .split( ',' )
            .map(( name ) => name.trim()),
        }
        : undefined
    )
    .map(( x ) => x)
    .filter( Boolean ) && []

for ( const _import of imports ) {
  if ( _import._named ) {
    _import.named = _import._named?.map(( name ) =>
      name.includes( ' as ' )
        ? name.split( /\s+as\s+/ )
        : [ name, name ]
    )
  }
}
console.log( imports )

interface Import {
  _named : string[] | undefined
  named : string[][]
  default : string | undefined
  wildcard : string | undefined
  quote : string
}
// default: 'type',
// named: '{ TsConfig }',
// path: './get-tsconfig',
// quote: '"',
// wildcard: undefined
// const getRe = (name:string,regexString:string)=>{
//   console.log(name, `: \t\t\t${regexString} `)
//   const regex = new RegExp(regexString, 'gim')
//   const result = [...input.matchAll(regex)].map(r=>r.groups ? ({...r.groups, named:r.groups.named?}) : undefined ).filter(boolean)
//   console.log(result)

// }

// ```getRe("namedImports", `${PREFIX}{\s*${NAME}/s*}.*?${POSTFIX}`);```

// for (const r of results) {
//   //  const rr = Object.entries(r)//.map(([k,v])=>v.groups)
//   console.log(r.groups);
// }

// console.log(results);
