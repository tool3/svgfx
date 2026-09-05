import { svgfx, wave } from '../../src/index.ts'
import { render } from '../support.ts'

render('wave', 'mark.svg', (source) => svgfx(source, [wave({ amplitude: 16, frequency: 0.03 })]))
