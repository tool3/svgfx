import { svgfx, grain } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [grain({ amount: 0.5 })])

save('grain', source, output)
