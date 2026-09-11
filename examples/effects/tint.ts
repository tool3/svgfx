import { pstfx, tint } from '../../src/index.ts'
import { render } from '../support.ts'

render('tint', 'scene.svg', (source) => pstfx(source, [tint({ color: '#00f5d4', amount: 0.5 })]))
