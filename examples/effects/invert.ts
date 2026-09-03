import { stouch, invert } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [invert()])

save('invert', source, output)
