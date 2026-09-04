import { svgfx, posterize } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [posterize({ steps: 4 })])

save('posterize', source, output)
