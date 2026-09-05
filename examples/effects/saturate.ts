import { svgfx, saturate } from '../../src/index.ts'
import { render } from '../support.ts'

render('saturate', 'scene.svg', (source) => svgfx(source, [saturate({ amount: 2.2 })]))
