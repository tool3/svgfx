import { svgfx, pixelate } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = svgfx(source, [pixelate({ size: 10 })])

save('pixelate', source, output)
