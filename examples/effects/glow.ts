import { svgfx, glow } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = svgfx(source, [glow({ color: '#ff2d55', radius: 8, intensity: 1.5 })])

save('glow', source, output)
