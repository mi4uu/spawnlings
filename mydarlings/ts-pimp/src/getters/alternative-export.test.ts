import * as acorn from 'acorn'
import tsPlugin from 'acorn-typescript'
import { test } from 'bun:test'

/* */

test('test', () => {
  const tsParserPlugin = tsPlugin() as unknown as ( BaseParser : typeof acorn.Parser ) => typeof acorn.Parser
  const somefn = 'const damn = (a:string, b):string=>` \${a} o_0 ${b} `'
  const source = `
  const a = 1
  type A = number
  export {
    a,
    type A as B
  }
  ${somefn}
  export function dupa(){
    return null
  }
  export interface Cosie {
    name: string,
    age: number

  }
  export class Zupa{
    kind = 'Grzybowa'
  }
  export default a
  `
  const node = acorn.Parser.extend( tsParserPlugin ).parse( source, {
    sourceType: 'module',
    ecmaVersion: 'latest',
    locations: true,
  } )
  // const exported = node
  //   .body
  //   .filter(( e ) => e.specifiers && e.specifiers.some(( s ) => s.exported))
  //   .flatMap(( e ) => e.specifiers)
  //   .map(( e ) => [ e.type, e.exportKind, e.exported.name ])
  // console.log( exported )
})
