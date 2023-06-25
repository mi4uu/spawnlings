import { getConfig } from '../config'
import { createNPrimeNumbers } from '../prime'

const run = async () => {
  const { numOfWorkers, numOfGeneratedResults } =
    await getConfig()
  const workerTasks = []
  const results:string[] = []

  for ( let i = 0; i < numOfWorkers; i++ ) {
    const task = new Promise( ( resolve, reject ) => {
      setTimeout( () => {
        try{
          const primes = createNPrimeNumbers(
            numOfGeneratedResults,
          )
          resolve(
            `${primes[0]} ... ${primes[primes.length - 1]}`,
          )
        } catch(error){
          reject(error)
        }


      }, 0 )
    } )
    workerTasks.push( task )
  }

  await Promise.all( workerTasks.map( ( task, i ) => {
    return task.then( ( res ) => {
      results.push( `process_${i + 1} : ${res}` )
      console.log(`## process_${i + 1} : ${res}`)
      return `process_${i + 1} : ${res}`
    } ).catch( ( error ) => {
      console.error( "IT BLOW UP! ", error )
    })
  } ) )

  console.log( JSON.stringify( results, null, 2 ) )
  return 0
}
await run()

