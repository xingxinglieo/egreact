import { convert } from '../src/index'
import { js2xml } from 'xml-js'

import path from 'path'
import fs from 'fs'

const str = convert(fs.readFileSync(path.join(__dirname, './Tree.xml')).toString())
describe('parse', () => {
  it('should parse', () => {
    console.log(str)
    expect(true).toBe(true)
  })
})
