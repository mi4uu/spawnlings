import os from 'os'

const NUM_OF_GENERATED_RESULTS = 10_000_000 as const
const FALLBACK_NUM_OF_WORKERS = 8
export const getNumOfCpuCores = () => {
  return os.cpus().length
}
export const getNumOfWorkers = async () => {
  let cpus = FALLBACK_NUM_OF_WORKERS
  try {
    cpus = getNumOfCpuCores()
  }
  catch (error) {
    console.error(
      'Cant determine host CPU Count, error was:',
    )
    if ( isError( error ) ) {
      console.error(
        isError( error ) ? error.message : error,
      )
      console.log( '---------- Error trace --------------' )
      console.log( error.stack )
    }
    else {
      console.log( error )
    }
  }
  return cpus ?? FALLBACK_NUM_OF_WORKERS
}

export const getConfig = async () => {
  return ({
    numOfWorkers: await getNumOfWorkers(),
    numOfGeneratedResults: NUM_OF_GENERATED_RESULTS,
  })
}

const isError = ( error : unknown ) : error is Error => {
  return error instanceof Error
}
