import fs from 'node:fs'
import os from 'node:os'
import randomPath from 'random-path'

import { retryAsync, retrySync } from './retry.js'
import WriteStream from './write-stream.js'

const tmpdir = os.tmpdir()

export function open (template, flags, mode, cb) {
  switch (flags) {
    case 'w': flags = 'wx'; break
    case 'w+': flags = 'wx+'; break
    default: throw new Error('Unknown file open flag: ' + flags)
  }

  if (typeof mode === 'function') {
    cb = mode
    mode = undefined
  }

  let path

  retryAsync(function (cb) {
    path = randomPath(tmpdir, template)
    fs.open(path, flags, mode, cb)
  }, function (err, fd) {
    cb(err, err ? undefined : { fd, path })
  })
}

export function openSync (template, flags, mode) {
  switch (flags) {
    case 'w': flags = 'wx'; break
    case 'w+': flags = 'wx+'; break
    default: throw new Error('Unknown file open flag: ' + flags)
  }

  let path

  const fd = retrySync(function () {
    path = randomPath(tmpdir, template)
    return fs.openSync(path, flags, mode)
  })

  return { fd, path }
}

export function mkdir (template, mode, cb) {
  if (typeof mode === 'function') {
    cb = mode
    mode = undefined
  }

  let path

  retryAsync(function (cb) {
    path = randomPath(tmpdir, template)
    fs.mkdir(path, mode, cb)
  }, function (err) {
    cb(err, err ? undefined : path)
  })
}

export function mkdirSync (template, mode) {
  let path

  retrySync(function () {
    path = randomPath(tmpdir, template)
    fs.mkdirSync(path, mode)
  })

  return path
}

export function writeFile (template, data, options, cb) {
  cb = arguments[arguments.length - 1]

  if (typeof options === 'function' || !options) {
    options = { flag: 'wx' }
  } else if (typeof options === 'string') {
    options = { encoding: options, flag: 'wx' }
  } else if (typeof options === 'object') {
    options.flag = 'wx'
  } else {
    throw new TypeError('Bad arguments')
  }

  let path

  retryAsync(function (cb) {
    path = randomPath(tmpdir, template)
    fs.writeFile(path, data, options, cb)
  }, function (err) {
    cb(err, err ? undefined : path)
  })
}

export function writeFileSync (template, data, options) {
  if (!options) {
    options = { flag: 'wx' }
  } else if (typeof options === 'string') {
    options = { encoding: options, flag: 'wx' }
  } else if (typeof options === 'object') {
    options.flag = 'wx'
  } else {
    throw new TypeError('Bad arguments')
  }

  let path

  retrySync(function () {
    path = randomPath(tmpdir, template)
    fs.writeFileSync(path, data, options)
  })

  return path
}

export function createWriteStream (template, options) {
  return new WriteStream(template, options)
}
