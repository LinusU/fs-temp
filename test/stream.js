/* eslint-env mocha */

var lib = require('../')

var fs = require('fs')
var assert = require('assert')

var data = new Buffer('testing 1 2 3')

function checkWrittenFile (path) {
  var content = fs.readFileSync(path)
  assert.equal(content.toString(), data.toString())
}

describe('createWriteStream', function () {
  var cleanup = []

  after(function () {
    cleanup.forEach(function (path) {
      try { fs.unlinkSync(path) } catch (err) {}
    })

    cleanup = []
  })

  it('should write a stream', function (done) {
    var s = lib.createWriteStream()
    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data)
  })

  it('should accept string and encoding #1', function (done) {
    var s = lib.createWriteStream('utf-8')
    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data.toString())
  })

  it('should accept string and encoding #2', function (done) {
    var s = lib.createWriteStream({ encoding: 'utf-8' })
    cleanup.push(s.path)

    s.on('finish', function () {
      checkWrittenFile(s.path)
      done()
    })

    s.end(data.toString())
  })
})
