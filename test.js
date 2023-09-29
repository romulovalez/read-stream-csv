import test from 'node:test'
import assert from 'node:assert'
import { processByChunks, processLineByLine } from './shared.js'
import { processByChunksWorker } from './script.js'

test('process by lines', async () => {
  const result = await processLineByLine(0)
  assert.strictEqual(result, 'finished')
})

test('process by chunks', async () => {
  const result = await processByChunks(0)
  assert.strictEqual(result, 'finished')
})

test('process by chunks x20 using worker threads', async () => {
  const result = await Promise.all(new Array(20).fill(null).map((_, index) => processByChunksWorker(index)))
  assert.deepStrictEqual(result, new Array(20).fill('finished'))
})