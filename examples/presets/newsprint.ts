import { svgfx, newsprint } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = svgfx(source, [newsprint()])

save('newsprint', source, output)
