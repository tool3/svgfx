import { svgfx, halftone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = svgfx(source, [halftone({ size: 5, angle: 15 })])

save('halftone', source, output)
