/* eslint-env mocha */

var lib = require('../')

var fs = require('fs')
var path = require('path')
var assert = require('assert')

var content = new Buffer('Hello world')

var cases = [
  [ 'abc-%s-xyz', /^abc-(.+)-xyz$/ ],
  [ '%%-%%-%s-%%', /^%-%-(.+)-%$/ ],
  [ '%%%%%s%%', /^%%(.+)%$/ ],
  [ '%%s %s', /^%s (.+)$/ ],
  [ '%%%%%s', /^%%(.+)$/ ],
  [ '%s', /^(.+)$/ ],
  [ '☃☃ %s ☃☃', /^☃☃ (.+) ☃☃$/ ]
]

var throws = [
  'abc123',
  '%%s-%%s-%%s',
  '%%%%%%s%%%',
  '%%%%%%s',
  '%%%s%s',
  '%s %s',
  '%s%s',
  ''
]

cases.forEach(function (c) {
  var libWithTemplate = lib.template(c[0])

  function assertPathMatches (filePath) {
    var match = c[1].exec(path.basename(filePath))
    assert.ok(match, 'file name matches template')

    var original = match[0].replace(/%/g, '%%').replace(match[1], '%s')
    assert.equal(original, c[0], 'file name matches template')
  }

  describe('template ' + JSON.stringify(c[0]), function () {
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
})

describe('template - invalid', function () {
  throws.forEach(function (str) {
    it('should throw on ' + JSON.stringify(str), function () {
      assert.throws(function () {
        lib.template(str)
      })
    })
  })
})
