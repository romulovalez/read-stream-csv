import { once } from 'events';
import { createReadStream } from 'fs';
import { createInterface } from 'readline';

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
  // We're working with a buffer of 64KiB (default value)
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
