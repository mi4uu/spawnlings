import process from 'process'
import { parentPort, workerData } from 'worker_threads'
import { runBench } from '../regexBench'

console.log( `[${process.pid}]`, ' Im Allive!!!' )
const bytesToMB = ( bytes ) => {
  return Math.round( bytes / 1024 / 1024 * 100 ) / 100
}
const mem = []
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

const msg = `ok ( ${timeSpendInMinutes} min | mem: ${
  bytesToMB( memAvg )
} MB | memAvg: ${bytesToMB( memAvg )} MB | memMax: ${
  bytesToMB( memMax )
} MB | memMin: ${bytesToMB( memMin )} MB )`

if ( typeof process.send === 'function' ) {
  process.send( msg )
}
else {
  parentPort.postMessage( msg )
}
