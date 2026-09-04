import { svgfx, tint } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [tint({ color: '#00f5d4', amount: 0.5 })])

save('tint', source, output)
