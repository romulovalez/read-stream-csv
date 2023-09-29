import { parentPort, workerData } from 'node:worker_threads'
import { processByChunks } from './shared.js'

processByChunks(workerData.id).then(result => parentPort.postMessage(result))
