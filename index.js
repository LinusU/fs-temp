
var fs = require('fs');

var retry = require('./lib/retry');
var randomPath = require('./lib/random-path');

exports.open = function (flags, mode, cb) {

  switch (flags) {
    case 'w': flags = 'wx'; break;
    case 'w+': flags = 'wx+'; break;
    default: throw new Error('Unknown file open flag: ' + flags);
  }

  if (typeof mode === 'function') {
    cb = mode;
    mode = undefined;
  }

  var path;

  retry.async(function (cb) {
    randomPath.async(function (err, _path) {
      if (err) { return cb(err); }

      path = _path;
      fs.open(path, flags, mode, cb);
    });
  }, function (err, fd) {
    cb(err, err ? undefined : { fd: fd, path: path });
  });
};

exports.openSync = function (flags, mode) {

  switch (flags) {
    case 'w': flags = 'wx'; break;
    case 'w+': flags = 'wx+'; break;
    default: throw new Error('Unknown file open flag: ' + flags);
  }

  var path;

  var fd = retry.sync(function () {
    path = randomPath.sync();
    return fs.openSync(path, flags, mode);
  });

  return { fd: fd, path: path };
};

exports.mkdir = function (mode, cb) {

  if (typeof mode === 'function') {
    cb = mode;
    mode = undefined;
  }

  var path;

  retry.async(function (cb) {
    randomPath.async(function (err, _path) {
      if (err) { return cb(err); }

      path = _path;
      fs.mkdir(path, mode, cb);
    });
  }, function (err) {
    cb(err, err ? undefined : path);
  });
};

exports.mkdirSync = function (mode) {
  var path;

  retry.sync(function () {
    path = randomPath.sync();
    fs.mkdirSync(path, mode);
  });

  return path;
};

exports.writeFile = function (data, options, cb) {
  cb = arguments[arguments.length - 1];

  if (typeof options === 'function' || !options) {
    options = { flag: 'wx' };
  } else if (typeof options === 'string') {
    options = { encoding: options, flag: 'wx' };
  } else if (typeof options === 'object') {
    options.flag = 'wx';
  } else {
    throw new TypeError('Bad arguments');
  }

  var path;

  retry.async(function (cb) {
    randomPath.async(function (err, _path) {
      if (err) { return cb(err); }

      path = _path;
      fs.writeFile(path, data, options, cb);
    });
  }, function (err) {
    cb(err, err ? undefined : path);
  });
};

exports.writeFileSync = function (data, options, cb) {

  if (!options) {
    options = { flag: 'wx' };
  } else if (typeof options === 'string') {
    options = { encoding: options, flag: 'wx' };
  } else if (typeof options === 'object') {
    options.flag = 'wx';
  } else {
    throw new TypeError('Bad arguments');
  }

  var path;

  retry.sync(function () {
    path = randomPath.sync();
    fs.writeFileSync(path, data, options);
  });

  return path;
};
