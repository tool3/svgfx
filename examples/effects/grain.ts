import { svgfx, grain } from '../../src/index.ts'
import { render } from '../support.ts'

render('grain', 'scene.svg', (source) => svgfx(source, [grain({ amount: 0.5 })]))
