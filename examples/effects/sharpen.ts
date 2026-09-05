import { svgfx, sharpen } from '../../src/index.ts'
import { render } from '../support.ts'

render('sharpen', 'scene.svg', (source) => svgfx(source, [sharpen({ amount: 4 })]))
