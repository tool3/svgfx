import { svgfx, contrast } from '../../src/index.ts'
import { render } from '../support.ts'

render('contrast', 'scene.svg', (source) => svgfx(source, [contrast({ amount: 1.7 })]))
