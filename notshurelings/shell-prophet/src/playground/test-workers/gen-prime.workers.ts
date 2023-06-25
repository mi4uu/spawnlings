import { Worker } from 'worker_threads'
import { getConfig } from '../config'

const run = async () => {
  const { numOfWorkers, numOfGeneratedResults } =
    await getConfig()
  const workerTasks = []
  // const results : Record<string, string>[] = []
  const results : string[] = []
  for ( let i = 0; i < numOfWorkers; i++ ) {
    const task = new Promise( ( resolve, reject ) => {
      const worker = new Worker(
        './src/playground/test-fork/worker2.mjs',
        {
          workerData: { numOfGeneratedResults },
        },
      )
      worker.on( 'message', ( message : unknown ) => {
        resolve( message )
      } )
      worker.on( 'error', reject )
      worker.on( 'exit', ( code : number ) => {
        if ( code !== 0 ) {
          reject(
            new Error(
              `Worker stopped with exit code ${code}`,
            ),
          )
        }
      } )
    } )
    workerTasks.push( task )
  }

  await Promise.all(
    workerTasks.map( ( task, i ) => {
      return task.then( ( res ) => {
       // const res_ = res as number[]
        //const last = res_.pop()
        // const msg : Record<string, string> = {
        //   [`process_${i + 1}`]: `${res_[0]} ... ${last}`,
        // }
        results.push( `process_${i + 1}: ${res}` )
      } )
    } ),
  )
  try {
    console.log( results.join( '\n' ) )
  }
  catch (error) {
    console.error( 'IT BLOW UP! ', error )
    console.log( 'data sent :' )
    console.log( { results } )
    return 1
  }
  return 0
}
await run()
