import { pstfx, outline } from '../../src/index.ts'
import { render } from '../support.ts'

render('outline', 'mark.svg', (source) => pstfx(source, [outline({ width: 3, color: '#6b7280' })]))
