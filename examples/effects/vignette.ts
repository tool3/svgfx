import { svgfx, vignette } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [vignette({ amount: 0.8, radius: 0.5 })])

save('vignette', source, output)
