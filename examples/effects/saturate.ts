import { svgfx, saturate } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [saturate({ amount: 2.2 })])

save('saturate', source, output)
