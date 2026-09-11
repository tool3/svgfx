import { pstfx, grain } from '../../src/index.ts'
import { render } from '../support.ts'

render('grain', 'scene.svg', (source) => pstfx(source, [grain({ amount: 0.5 })]))
