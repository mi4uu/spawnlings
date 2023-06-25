import TsconfigPathsPlugin from '@esbuild-plugins/tsconfig-paths'
import { build } from 'esbuild'
import { resolve } from 'path'

const tsconfig = resolve( './tsconfig.node.json' )

build( {
  entryPoints: [ './src/index.ts' ],
  bundle: true,
  outfile: './out/esbuild/out.mjs',
  sourcemap: true,
  platform: 'node',
  target: 'node16.8',
  format: 'esm',
  // banner: {
  //   js: 'import { createRequire as topLevelCreateRequire } from "module";\n const require = topLevelCreateRequire(import.meta.url);',
  // },
  plugins: [ TsconfigPathsPlugin( { tsconfig } ) ],
} )
// esbuild index.ts --bundle --outfile=out.mjs --platform=node --target=node16.8 --format=esm  --banner:js='import { createRequire as topLevelCreateRequire } from \"module\";\n const require = topLevelCreateRequire(import.meta.url);'
