import { svgfx, threshold } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = svgfx(source, [threshold({ level: 0.62, dark: '#101010', light: '#f6f4ef' })])

save('threshold', source, output)
