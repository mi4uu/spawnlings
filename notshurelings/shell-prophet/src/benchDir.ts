import { fdir } from 'fdir'
const testDir = '/Users/zeno/Work/nano/acrocharge'
const measure = async (
  name : string,
  fn : ( s : string ) => Promise<string[]>,
) => {
  const start = Date.now()
  const r = await fn( testDir )

  const end = Date.now()
  const t = (end - start) / (1000 * 1)
  console.log(
    `name: ${name} time: ${
      t.toFixed( 2 )
    } s . files: ${r.length}`,
  )
}

const runfdir = ( s : string ) => {
  const api = new fdir().withFullPaths().crawl( s )

  return api.sync()
}

await measure( 'fdir', runfdir )
