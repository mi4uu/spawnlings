import process from 'process'
import { getConfig } from '../config'
import { runBench } from '../regexBench'
const run = async () => {
  const { numOfWorkers, numOfGeneratedResults } =
    await getConfig()
  const workerTasks = []
  const results : string[] = []

  const bytesToMB = ( bytes : number ) => {
    return Math.round( bytes / 1024 / 1024 * 100 ) / 100
  }
  const mem : number[] = []
  const start = Date.now()
  const halfOfMinuteinMs = 60000
  const interval = setInterval( () => {
    const { rss } = process.memoryUsage()
    mem.push( rss )
  }, halfOfMinuteinMs )
  const result = runBench()

  const timeSpend = Date.now() - start
  const timeSpendInMinutes = timeSpend / 1000 / 60
  const memMax = Math.max( ...mem )
  const memMin = Math.min( ...mem )
  const memAvg = mem.reduce( ( a, b ) => a + b, 0 )
    / mem.length
  clearInterval( interval )

  const memMsg = ` ( ${timeSpendInMinutes} min | mem: ${
    bytesToMB( memAvg )
  } MB | memAvg: ${bytesToMB( memAvg )} MB | memMax: ${
    bytesToMB( memMax )
  } MB | memMin: ${bytesToMB( memMin )} MB )`

  for ( let i = 0; i < numOfWorkers; i++ ) {
    const task = new Promise( ( resolve, reject ) => {
      const start = Date.now()
      setTimeout( () => {
        try {
          runBench()
          const benchTime = Date.now() - start
          const benchTimeInMinutes = benchTime / 1000 / 60
          const msg = `process_${
            i + 1
          }: ${benchTimeInMinutes} minutes`
          results.push( msg )
          resolve(
            msg,
          )
        }
        catch (error) {
          reject( error )
        }
      }, 0 )
    } )
    workerTasks.push( task )
  }

  await Promise.all( workerTasks.map( async ( task, i ) => {
    return await task
  } ) )

  console.log( JSON.stringify( results, null, 2 ) )

  console.log( memMsg )
  console.log( '' )
  return 0
}
await run()
