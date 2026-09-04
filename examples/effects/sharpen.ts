import { svgfx, sharpen } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [sharpen({ amount: 4 })])

save('sharpen', source, output)
