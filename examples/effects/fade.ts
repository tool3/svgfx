import { pstfx, fade } from '../../src/index.ts'
import { render } from '../support.ts'

render('fade', 'mark.svg', (source) => pstfx(source, [fade({ amount: 0.45 })]))
