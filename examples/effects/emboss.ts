import { stouch, emboss } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = stouch(source, [emboss({ depth: 1.4 })])

save('emboss', source, output)
