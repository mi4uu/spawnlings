import { fork } from 'child_process'
import { getConfig } from '../config'
const pids : (number | undefined)[] = []
const run = async () => {
  const { numOfWorkers, numOfGeneratedResults } =
    await getConfig()
  const workerTasks = []
  const results : string[] = []
  console.log( `* process PID: ${process.pid}` )
  pids.push( process.pid )
  for ( let i = 0; i < numOfWorkers; i++ ) {
    const task = new Promise( ( resolve, reject ) => {
      const worker = fork(
        './src/playground/test-fork/worker2.mjs',
        [],
        {
          env: {
            numOfGeneratedResults:
              `${numOfGeneratedResults}`,
          },
        },
      )
      console.log(
        `\t\t> worker ${i + 1} | PID: ${worker.pid}`,
      )
      pids.push( worker.pid )
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
  console.log( `\n\nMONITOR: htop -p ${pids.join( ',' )}` )
  await Promise.all(
    workerTasks.map( ( task, i ) => {
      return task
        .then( ( res ) => {
          const msg = `process_${i + 1}: ${res}`
          results.push( msg )
        } )
        .catch( ( error ) => {
          console.error(
            `fork process_${i + 1} DOWN! `,
            error,
          )
        } )
        .finally( () => {
          return 0
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
