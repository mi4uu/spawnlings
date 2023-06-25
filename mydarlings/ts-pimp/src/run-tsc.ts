#!/Users/zeno/.bun/bin/bun
import { $ } from 'bnx'
import { isAbsolute, relative, resolve } from 'path'
import process from 'process'

const pathSeparator = '/'
const resolvePath = (
  basePath : string,
  filePath : string,
) : string => {
  let basePathTmp = basePath.split( pathSeparator )
  let filePathTmp = filePath.split( pathSeparator )
  for ( let bl = 0; bl < basePathTmp.length; bl++ ) {
    basePathTmp = basePath.split( pathSeparator )
    for ( let fl = 0; fl < filePathTmp.length; fl++ ) {
      const tmpPath = resolve(
        basePathTmp.join( pathSeparator ),
        filePathTmp.join( pathSeparator ),
      )
      console.log( `* trying ${tmpPath}` )
      if ( Bun.file( tmpPath ).size > 0 ) {
        return tmpPath
      }
      basePathTmp.pop()
    }
    filePathTmp.pop()
  }
  throw Error( 'not found' )
}

const baseDir = process.argv[2]
const configName = process.argv[3]
const fileUri = process.argv[4]
const newConfigName = 'tsconfig.watch.json'
const absFilePath = resolvePath( baseDir, fileUri )
const absConfigPath = resolve( baseDir, configName )

console.log( { absFilePath, absConfigPath } )

const config = await Bun.file( absConfigPath ).json()
const newConfig = {
  ...config,
  compilerOptions: {
    ...config.compilerOptions,
  },
  files: [ fileUri ],
  include: [],
  exclude: [],
}
const newConfigAbsPath = resolvePath(
  baseDir,
  newConfigName,
)
await Bun.write(
  newConfigAbsPath,
  JSON.stringify( newConfig, null, 2 ),
)

const absPathToTsc = resolve(
  baseDir,
  'node_modules/typescript/lib/tsc.js',
)
const absPathToNewConfig = resolve(
  baseDir,
  newConfigName,
)
const cmd =
  `bun run  ${absPathToTsc} -p ${absPathToNewConfig} --noEmit --incremental --listfiles`
console.log( `running: ${cmd}` )

// const cmd =
//   `node ${absPathToTsc} -p ${absPathToNewConfig} --noEmit --incremental --listfiles`
// console.log( `running: ${cmd}` )

try {
  const checkThatGodDamnThing = $`${cmd}`
  console.log( checkThatGodDamnThing )
}
catch (error) {
  console.log( `OH NO, ERROR! : ${error}` )
}
