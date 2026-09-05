import { svgfx, tint } from '../../src/index.ts'
import { render } from '../support.ts'

render('tint', 'scene.svg', (source) => svgfx(source, [tint({ color: '#00f5d4', amount: 0.5 })]))
