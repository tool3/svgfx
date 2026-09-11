import { pstfx, glow } from '../../src/index.ts'
import { render } from '../support.ts'

render('glow', 'mark.svg', (source) => pstfx(source, [glow({ color: '#ff2d55', radius: 8, intensity: 1.5 })]))
