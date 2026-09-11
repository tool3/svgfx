import { pstfx, neon } from '../../src/index.ts'
import { render } from '../support.ts'

render('neon', 'mark.svg', (source) => pstfx(source, [neon({ color: '#4cc9f0' })]))
