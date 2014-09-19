
var os = require('os');
var path = require('path');
var crypto = require('crypto');

var tmpPath = os.tmpDir();

exports.async = function (cb) {
  crypto.randomBytes(8, function (err, bytes) {
    if (err) { return cb(err); }

    var name = bytes.toString('base64').replace(/[+/=]/g, '-');

    cb(null, path.join(tmpPath, name));
  });
};

exports.sync = function () {
  var bytes = crypto.randomBytes(8);
  var name = bytes.toString('base64').replace(/[+/=]/g, '-');

  return path.join(tmpPath, name);
};
