import { pstfx, bloom } from '../../src/index.ts'
import { render } from '../support.ts'

render('bloom', 'scene.svg', (source) => pstfx(source, [bloom({ radius: 8, threshold: 0.5 })]))
