import { svgfx, grayscale } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [grayscale()])

save('grayscale', source, output)
