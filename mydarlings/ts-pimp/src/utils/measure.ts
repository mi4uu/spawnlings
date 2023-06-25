
import { heapStats } from "bun:jsc";
const bytesToMB = ( bytes:number ) => {
    return Math.round( bytes / 1024 / 1024 * 100 ) / 100
  }

class Measure {
    private startTime: number
    private name: string
    private intervalHandler: Timer
    private memStat:ReturnType<typeof heapStats>
    constructor(name: string) {
        this.name = name
        this.startTime = Date.now()
        this.memStat = heapStats()
        this.intervalHandler = setInterval( () => {

            // const { rss } = process.memoryUsage()
             console.log("ELOOOOOO")
        //     mem.push( rss )
          }, 100 )
    }
    stop() {
        const timePassed = Date.now() - this.startTime;
        const secondsPassed = timePassed / (1000 );
        const minutesPassed = secondsPassed * 60;
        const memStat2=heapStats()
        clearInterval(this.intervalHandler)
        // setTimeout(() => {

        //     delete this
        // },1)
        const heap = bytesToMB(memStat2.heapSize-this.memStat.heapSize)
        const heapMsg = `${heap} MB`
        return secondsPassed>60?`[${this.name}] ${minutesPassed.toFixed(2)} minutes | ${heapMsg}`:`[${this.name}] ${secondsPassed.toFixed(2)} seconds  | ${heapMsg}`;

      }

}
export const measureit = (name: string) => {
    return new Measure(name)
}
