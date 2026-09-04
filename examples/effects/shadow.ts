import { svgfx, shadow } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = svgfx(source, [shadow({ x: 6, y: 8, blur: 6, opacity: 0.55 })])

save('shadow', source, output)
