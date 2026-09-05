import { svgfx, crt } from '../../src/index.ts'
import { render } from '../support.ts'

render('crt', 'scene.svg', (source) => svgfx(source, [crt()]))
