import { svgfx, neon } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = svgfx(source, [neon({ color: '#4cc9f0' })])

save('neon', source, output)
