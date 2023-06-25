import { parentPort, workerData } from 'worker_threads'
import { getConfig } from '../config'
import { createNPrimeNumbers } from '../prime'

const config = await getConfig()
const { numOfGeneratedResults } = workerData

const result = createNPrimeNumbers(
  config.numOfGeneratedResults,
)
parentPort.postMessage( result )
