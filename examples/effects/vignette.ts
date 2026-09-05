import { svgfx, vignette } from '../../src/index.ts'
import { render } from '../support.ts'

render('vignette', 'scene.svg', (source) => svgfx(source, [vignette({ amount: 0.8, radius: 0.5 })]))
