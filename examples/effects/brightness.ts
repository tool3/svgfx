import { pstfx, brightness } from '../../src/index.ts'
import { render } from '../support.ts'

render('brightness', 'scene.svg', (source) => pstfx(source, [brightness({ amount: 1.35 })]))
