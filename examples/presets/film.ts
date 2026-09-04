import { svgfx, film } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [film()])

save('film', source, output)
