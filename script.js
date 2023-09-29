
import { Worker } from 'node:worker_threads'
import { processByChunks, processLineByLine } from './shared.js'

export async function processLineByLineWorker(id) {
  return new Promise((resolve) => {
    const worker = new Worker('./worker-lines.js', { workerData: { id } })
    worker.on('message', resolve)
  })
}

export async function processByChunksWorker(id) {
  return new Promise((resolve) => {
    const worker = new Worker('./worker-chunks.js', { workerData: { id } })
    worker.on('message', resolve)
  })
}

// PLAYGROUND ---------------------------------------------------------------------------

// processLineByLine(0)
// processByChunks(0)
// processLineByLineWorker(0)
// processByChunksWorker(0)

// Promise.all(new Array(20).fill(null).map((_, index) => processLineByLine(index)))
// Promise.all(new Array(20).fill(null).map((_, index) => processLineByLineWorker(index)))

// Promise.all(new Array(20).fill(null).map((_, index) => processByChunks(index)))
Promise.all(new Array(20).fill(null).map((_, index) => processByChunksWorker(index)))
