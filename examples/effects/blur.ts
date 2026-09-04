import { svgfx, blur } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [blur({ radius: 4 })])

save('blur', source, output)
