
var lib = require('../');

var fs = require('fs');
var assert = require('assert');

var data = new Buffer('testing 1 2 3');

function checkWrittenFile (path) {

  var content = fs.readFileSync(path);
  assert.equal(content.toString(), data.toString());

}

describe('createWriteStream', function () {

  var cleanup = [];

  after(function () {

    cleanup.forEach(function (path) {
      try { fs.unlinkSync(path); } catch (err) {}
    });

    cleanup = [];

  });

  it('should write a stream', function (done) {

    var s = lib.createWriteStream();
    var pathEmitted = false;

    s.on('path', function (path) {
      cleanup.push(path);
      pathEmitted = true;
    });

    s.on('finish', function () {
      assert.ok(pathEmitted);
      checkWrittenFile(s.path);
      done();
    });

    s.end(data);

  });

  it('should accept string and encoding', function (done) {

    var s = lib.createWriteStream({ encoding: 'utf-8' });
    var pathEmitted = false;

    s.on('path', function (path) {
      cleanup.push(path);
      pathEmitted = true;
    });

    s.on('finish', function () {
      assert.ok(pathEmitted);
      checkWrittenFile(s.path);
      done();
    });

    s.end(data.toString());

  });

});
