import { svgfx, xerox } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = svgfx(source, [xerox()])

save('xerox', source, output)
