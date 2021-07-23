/* eslint-env mocha */

import assert from 'node:assert'
import fs from 'node:fs'

import lib from '../index.js'

const data = Buffer.from('testing 1 2 3')

function checkWrittenFile (path) {
  const content = fs.readFileSync(path)
  assert.equal(content.toString(), data.toString())
}

describe('writeFile', () => {
  let cleanup = []

  after(function () {
    for (const path of cleanup) {
      try { fs.unlinkSync(path) } catch {}
    }

    cleanup = []
  })

  it('should write a file async', (done) => {
    lib.writeFile(data, (err, path) => {
      assert.ifError(err)

      cleanup.push(path)
      checkWrittenFile(path)

      done()
    })
  })

  it('should write a file sync', () => {
    const path = lib.writeFileSync(data)

    cleanup.push(path)
    checkWrittenFile(path)
  })

  it('should accept string and encoding async', (done) => {
    lib.writeFile(data.toString(), 'utf-8', (err, path) => {
      assert.ifError(err)

      cleanup.push(path)
      checkWrittenFile(path)

      done()
    })
  })

  it('should accept string and encoding sync', () => {
    const path = lib.writeFileSync(data.toString(), 'utf-8')

    cleanup.push(path)
    checkWrittenFile(path)
  })
})
