import { validateTemplate } from 'random-path'
import * as temp from './lib/temp.js'

export function template (template) {
  validateTemplate(template)

  return {
    open: temp.open.bind(temp, template),
    openSync: temp.openSync.bind(temp, template),
    mkdir: temp.mkdir.bind(temp, template),
    mkdirSync: temp.mkdirSync.bind(temp, template),
    writeFile: temp.writeFile.bind(temp, template),
    writeFileSync: temp.writeFileSync.bind(temp, template),
    createWriteStream: temp.createWriteStream.bind(temp, template)
  }
}

const _default = Object.assign(template('%s'), { template })

export const open = _default.open
export const openSync = _default.openSync
export const mkdir = _default.mkdir
export const mkdirSync = _default.mkdirSync
export const writeFile = _default.writeFile
export const writeFileSync = _default.writeFileSync
export const createWriteStream = _default.createWriteStream

export default _default
