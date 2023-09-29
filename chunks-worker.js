import { once } from 'node:events'
import { createReadStream } from 'node:fs'
import { parentPort, workerData } from 'node:worker_threads'

console.time(workerData.id)

const fileStream = createReadStream('file.csv')

let unprocessed = ''
fileStream.on('data', (chunk) => {
  const chunkString = unprocessed + chunk.toString()

  let start = 0
  for (let index = start; index < chunkString.length; ++index) {
    if (chunkString[index] === '\n') {
      // const line = chunkString.slice(start, index - 1) // Remove \r at the end
      start = index + 1
    }
  }

  if (chunkString[chunkString.length - 1] !== '\n') {
    unprocessed = chunkString.slice(start)
  }
})

await once(fileStream, 'end')

console.timeEnd(workerData.id)

parentPort.postMessage('finished')