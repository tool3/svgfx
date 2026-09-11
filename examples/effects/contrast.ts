import { pstfx, contrast } from '../../src/index.ts'
import { render } from '../support.ts'

render('contrast', 'scene.svg', (source) => pstfx(source, [contrast({ amount: 1.7 })]))
