
import { createReadStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { once } from 'node:events'
import { Worker } from 'node:worker_threads'

// Stream process big files
// https://nodejs.org/api/readline.html#readline_example_read_file_stream_line_by_line

// processLineByLine(0)
// processByChunks(0)
processByChunksWorker(0)

// Promise.all(new Array(20).fill(null).map((_, index) => processByChunks(index)))
// Promise.all(new Array(20).fill(null).map((_, index) => processByChunksWorker(index)))

// // Profiling
// tsx --prof script.ts
// tsx --prof-process chunk.log > processed.txt
// node -prof script.js
// node --prof-process chunk-js.log > chunk-js.txt
// node --prof-process line-js.log > line-js.txt

export async function processLineByLine(id) {
  console.time(id)
  const fileStream = createReadStream('file.csv')

  const rl = createInterface({
    input: fileStream,
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    crlfDelay: Infinity,
  })

  rl.on('line', (line) => {
    // console.log(`Line from file: ${line}`)
  })

  await once(rl, 'close')

  console.timeEnd(id)

  return 'finished'
}

export async function processByChunks(id) {
  console.time(id)

  // CSV files need to end with a new line
  const fileStream = createReadStream('file.csv', { highWaterMark: 64 * 1024 })

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
    } else {
      unprocessed = ''
    }
  })

  await once(fileStream, 'end')

  console.timeEnd(id)

  return 'finished'
}

// Using worker threads: https://nodejs.org/api/worker_threads.html
export async function processByChunksWorker(id) {
  return new Promise((resolve) => {
    const worker = new Worker('./chunks-worker.js', { workerData: { id } })
    worker.on('message', resolve)
  })
}
