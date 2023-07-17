// import type { ServeOptions } from 'bun'
import { statSync } from 'fs'
import * as path from 'path'

const PROJECT_ROOT = path.resolve( import.meta.dir, '..' )
const PUBLIC_DIR = path.resolve( PROJECT_ROOT, 'public' )
const BUILD_DIR = path.resolve( PROJECT_ROOT, 'build' )
console.log( { PROJECT_ROOT, PUBLIC_DIR, BUILD_DIR } )
await Bun.build( { entrypoints: [ path.resolve( PROJECT_ROOT, 'src/index.tsx' ) ], outdir: BUILD_DIR } )

function serveFromDir( config : { directory : string; path : string } ) : Response | null {
  let basePath = path.join( config.directory, config.path )
  const suffixes = [ '', '.html', 'index.html' ]
  console.log( { basePath } )
  for ( const suffix of suffixes ) {
    try {
      const pathWithSuffix = path.join( basePath, suffix )
      const stat = statSync( pathWithSuffix )
      console.log( { pathWithSuffix } )
      if ( stat && stat.isFile() ) {
        return new Response( Bun.file( pathWithSuffix ) )
      }
    }
    catch (err) {}
  }

  return null
}

const server = Bun.serve( {
  fetch( request ) {
    let reqPath = new URL( request.url ).pathname
    console.log( request.method, reqPath, request.url )
    if ( reqPath === '/' ) {
      reqPath = '/index.html'
    }

    // check public
    const publicResponse = serveFromDir( { directory: PUBLIC_DIR, path: reqPath } )
    console.log( { publicResponse } )
    if ( publicResponse ) {
      return publicResponse
    }

    // check /.build
    const buildResponse = serveFromDir( { directory: BUILD_DIR, path: reqPath } )
    console.log( { buildResponse } )

    if ( buildResponse ) {
      return buildResponse
    }
    console.log( 'NOT FOUND!' )

    return new Response( 'File not found', { status: 404 } )
  },
} )

console.log( `Listening on http://localhost:${server.port}` )
