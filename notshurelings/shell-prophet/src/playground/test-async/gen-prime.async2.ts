import { getConfig } from '../config'
import { createNPrimeNumbers } from '../prime'

const run = async () => {
  const { numOfWorkers, numOfGeneratedResults } = await getConfig()

  const workerTasks = []

  for (let i = 0; i < numOfWorkers; i++) {
    const task = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const primes = createNPrimeNumbers(numOfGeneratedResults)
          const result = `${primes[0]} ... ${primes[primes.length - 1]}`
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }, 0)
    })

    workerTasks.push(task)
  }

  const results = await Promise.allSettled(workerTasks)

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`## process_${i + 1} : ${result.value}`)
    } else {
      console.error(`IT BLOW UP! ${result.reason}`)
    }
  })

  return 0
}

await run()
