/* eslint-env mocha */

import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import lib from '../index.js'

const content = Buffer.from('Hello world')

const cases = [
  ['abc-%s-xyz', /^abc-(.+)-xyz$/],
  ['%%-%%-%s-%%', /^%-%-(.+)-%$/],
  ['%%%%%s%%', /^%%(.+)%$/],
  ['%%s %s', /^%s (.+)$/],
  ['%%%%%s', /^%%(.+)$/],
  ['%s', /^(.+)$/],
  ['☃☃ %s ☃☃', /^☃☃ (.+) ☃☃$/]
]

const throws = [
  'abc123',
  '%%s-%%s-%%s',
  '%%%%%%s%%%',
  '%%%%%%s',
  '%%%s%s',
  '%s %s',
  '%s%s',
  ''
]

for (const c of cases) {
  const libWithTemplate = lib.template(c[0])

  function assertPathMatches (filePath) {
    const match = c[1].exec(path.basename(filePath))
    assert.ok(match, 'file name matches template')

    const original = match[0].replace(/%/g, '%%').replace(match[1], '%s')
    assert.equal(original, c[0], 'file name matches template')
  }

  describe('template ' + JSON.stringify(c[0]), () => {
    let cleanup = []

    after(function () {
      for (const fn of cleanup) {
        try { fn() } catch {}
      }

      cleanup = []
    })

    it('should open a file', (done) => {
      libWithTemplate.open('w', (err, res) => {
        assert.ifError(err)
        cleanup.push(() => fs.closeSync(res.fd))
        cleanup.push(() => fs.unlinkSync(res.path))
        assertPathMatches(res.path)
        done()
      })
    })

    it('should create a directory', (done) => {
      libWithTemplate.mkdir((err, path) => {
        assert.ifError(err)

        cleanup.push(() => fs.rmdirSync(path))
        assertPathMatches(path)

        done()
      })
    })

    it('should write a file', (done) => {
      libWithTemplate.writeFile(content, (err, path) => {
        assert.ifError(err)

        cleanup.push(() => fs.unlinkSync(path))
        assertPathMatches(path)

        done()
      })
    })

    it('should write a stream', (done) => {
      const out = libWithTemplate.createWriteStream()

      out.on('finish', () => {
        cleanup.push(() => fs.unlinkSync(out.path))
        assertPathMatches(out.path)

        done()
      })

      out.end(content)
    })
  })
}

describe('template - invalid', () => {
  for (const str of throws) {
    it('should throw on ' + JSON.stringify(str), () => {
      assert.throws(() => {
        lib.template(str)
      })
    })
  }
})
