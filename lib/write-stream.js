import { WriteStream } from 'node:fs'
import { openSync } from './temp.js'

export default class TempWriteStream extends WriteStream {
  constructor (template, options) {
    options = (typeof options === 'string') ? { encoding: options } : (options || {})

    const flags = options.flags === undefined ? 'w' : options.flags
    const mode = options.mode === undefined ? 0o666 : options.mode
    const { fd, path } = openSync(template, flags, mode)

    super(path, { ...options, fd })

    this.path = path
  }
}
