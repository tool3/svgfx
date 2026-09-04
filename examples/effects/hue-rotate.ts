import { svgfx, hueRotate } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [hueRotate({ angle: 140 })])

save('hue-rotate', source, output)
