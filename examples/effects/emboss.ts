import { svgfx, emboss } from '../../src/index.ts'
import { render } from '../support.ts'

render('emboss', 'mark.svg', (source) => svgfx(source, [emboss({ depth: 1.4 })]))
