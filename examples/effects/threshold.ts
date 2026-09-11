import { pstfx, threshold } from '../../src/index.ts'
import { render } from '../support.ts'

render('threshold', 'tones.svg', (source) => pstfx(source, [threshold({ level: 0.62, dark: '#101010', light: '#f6f4ef' })]))
