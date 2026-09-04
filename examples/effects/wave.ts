import { svgfx, wave } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = svgfx(source, [wave({ amplitude: 16, frequency: 0.03 })])

save('wave', source, output)
