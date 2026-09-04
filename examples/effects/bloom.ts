import { svgfx, bloom } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [bloom({ radius: 8, threshold: 0.5 })])

save('bloom', source, output)
