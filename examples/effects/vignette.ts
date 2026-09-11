import { pstfx, vignette } from '../../src/index.ts'
import { render } from '../support.ts'

render('vignette', 'scene.svg', (source) => pstfx(source, [vignette({ amount: 0.8, radius: 0.5 })]))
