import { svgfx, brightness } from '../../src/index.ts'
import { render } from '../support.ts'

render('brightness', 'scene.svg', (source) => svgfx(source, [brightness({ amount: 1.35 })]))
