import { pstfx, emboss } from '../../src/index.ts'
import { render } from '../support.ts'

render('emboss', 'mark.svg', (source) => pstfx(source, [emboss({ depth: 1.4 })]))
