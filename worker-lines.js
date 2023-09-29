import { parentPort, workerData } from 'node:worker_threads'
import { processLineByLine } from './shared.js'

processLineByLine(workerData.id).then(result => parentPort.postMessage(result))
