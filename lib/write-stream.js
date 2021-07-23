var temp = require('./temp')
var WriteStream = require('fs').WriteStream

function TempWriteStream (template, options) {
  options = (typeof options === 'string') ? { encoding: options } : (options || {})
  var flags = options.flags === undefined ? 'w' : options.flags
  var mode = options.mode === undefined ? 0o666 : options.mode
  var info = temp.openSync(template, flags, mode)
  WriteStream.call(this, info.path, Object.assign({}, options, { fd: info.fd }))
}

TempWriteStream.prototype = Object.create(WriteStream.prototype)

module.exports = TempWriteStream
