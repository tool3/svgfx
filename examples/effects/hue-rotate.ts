import { svgfx, hueRotate } from '../../src/index.ts'
import { render } from '../support.ts'

render('hue-rotate', 'scene.svg', (source) => svgfx(source, [hueRotate({ angle: 140 })]))
