/* eslint-env mocha */

import assert from 'node:assert'
import fs from 'node:fs'

import lib from '../index.js'

function checkCreatedDir (path) {
  const files = fs.readdirSync(path)
  assert.equal(files.length, 0)
}

describe('mkdir', () => {
  let cleanup = []

  after(() => {
    for (const path of cleanup) {
      try { fs.rmdirSync(path) } catch {}
    }

    cleanup = []
  })

  it('should create empty directory async', (done) => {
    lib.mkdir((err, path) => {
      assert.ifError(err)

      cleanup.push(path)
      checkCreatedDir(path)

      done()
    })
  })

  it('should create empty directory sync', () => {
    const path = lib.mkdirSync()

    cleanup.push(path)
    checkCreatedDir(path)
  })
})
