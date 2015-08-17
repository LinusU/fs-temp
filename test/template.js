/* eslint-env mocha */

var lib = require('../')

var fs = require('fs')
var assert = require('assert')

var content = new Buffer('Hello world')
var libWithTemplate = lib.template('abc-%s-xyz')

function assertPathMatches (path) {
  assert.ok(/abc-.*-xyz/.test(path), 'path matches pattern')
}

describe('template', function () {
  var cleanup = []

  after(function () {
    cleanup.forEach(function (fn) {
      try { fn() } catch (err) {}
    })

    cleanup = []
  })

  it('should open a file', function (done) {
    libWithTemplate.open('w', function (err, res) {
      assert.ifError(err)
      cleanup.push(fs.closeSync.bind(fs, res.fd))
      cleanup.push(fs.unlinkSync.bind(fs, res.path))
      assertPathMatches(res.path)
      done()
    })
  })

  it('should create a directory', function (done) {
    libWithTemplate.mkdir(function (err, path) {
      assert.ifError(err)

      cleanup.push(fs.rmdirSync.bind(fs, path))
      assertPathMatches(path)

      done()
    })
  })

  it('should write a file', function (done) {
    libWithTemplate.writeFile(content, function (err, path) {
      assert.ifError(err)

      cleanup.push(fs.unlinkSync.bind(fs, path))
      assertPathMatches(path)

      done()
    })
  })

  it('should write a stream', function (done) {
    var out = libWithTemplate.createWriteStream()

    out.on('finish', function () {
      cleanup.push(fs.unlinkSync.bind(fs, out.path))
      assertPathMatches(out.path)

      done()
    })

    out.end(content)
  })
})
