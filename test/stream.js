/* eslint-env mocha */

import assert from 'node:assert'
import fs from 'node:fs'

import lib from '../index.js'

const data = Buffer.from('testing 1 2 3')

function checkWrittenFile (path) {
  const content = fs.readFileSync(path)
  assert.equal(content.toString(), data.toString())
}

describe('createWriteStream', () => {
  let cleanup = []

  after(() => {
    for (const path of cleanup) {
      try { fs.unlinkSync(path) } catch {}
    }

    cleanup = []
  })

  it('should write a stream', (done) => {
    const s = lib.createWriteStream()

    assert.strictEqual(typeof s.path, 'string')
    assert.notStrictEqual(s.path, '')

    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data)
  })

  it('should accept string and encoding #1', (done) => {
    const s = lib.createWriteStream('utf-8')

    assert.strictEqual(typeof s.path, 'string')
    assert.notStrictEqual(s.path, '')

    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data.toString())
  })

  it('should accept string and encoding #2', (done) => {
    const s = lib.createWriteStream({ encoding: 'utf-8' })

    assert.strictEqual(typeof s.path, 'string')
    assert.notStrictEqual(s.path, '')

    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data.toString())
  })
})
