import { svgfx, fade } from '../../src/index.ts'
import { render } from '../support.ts'

render('fade', 'mark.svg', (source) => svgfx(source, [fade({ amount: 0.45 })]))
