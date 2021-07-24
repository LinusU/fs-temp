/* eslint-env mocha */

import assert from 'node:assert'
import fs from 'node:fs'

import lib from '../index.js'

const data = Buffer.from('testing 1 2 3')

function checkOpenFile (res, flag) {
  fs.writeSync(res.fd, data, 0, data.length, null)

  if (flag === 'w+') {
    const buf = Buffer.alloc(data.length)
    const bytesRead = fs.readSync(res.fd, buf, 0, data.length, 0)
    assert.equal(bytesRead, data.length)
    assert.equal(buf.toString(), data.toString())
  }

  fs.closeSync(res.fd)

  const content = fs.readFileSync(res.path)
  assert.equal(content.toString(), data.toString())
}

describe('open', () => {
  let cleanup = []

  after(() => {
    for (const obj of cleanup) {
      try { fs.closeSync(obj.fd) } catch {}
      try { fs.unlinkSync(obj.path) } catch {}
    }

    cleanup = []
  })

  it('creates temporary file for writing async', (done) => {
    lib.open('w', (err, res) => {
      assert.ifError(err)

      cleanup.push(res)
      checkOpenFile(res, 'w')

      done()
    })
  })

  it('creates temporary file for writing sync', () => {
    const res = lib.openSync('w')

    cleanup.push(res)
    checkOpenFile(res, 'w')
  })

  it('creates temporary file for reading and writing async', (done) => {
    lib.open('w+', (err, res) => {
      assert.ifError(err)

      cleanup.push(res)
      checkOpenFile(res, 'w+')

      done()
    })
  })

  it('creates temporary file for reading and writing sync', () => {
    const res = lib.openSync('w+')

    cleanup.push(res)
    checkOpenFile(res, 'w+')
  })

  it('should throw on unknown flag', () => {
    assert.throws(() => {
      lib.openSync('asd')
    })

    assert.throws(() => {
      lib.open('asd', () => {
        assert(false)
      })
    })
  })
})
