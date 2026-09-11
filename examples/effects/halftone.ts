import { pstfx, halftone } from '../../src/index.ts'
import { render } from '../support.ts'

render('halftone', 'tones.svg', (source) => pstfx(source, [halftone({ size: 5, angle: 15 })]))
