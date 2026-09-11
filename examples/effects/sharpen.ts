import { pstfx, sharpen } from '../../src/index.ts'
import { render } from '../support.ts'

render('sharpen', 'scene.svg', (source) => pstfx(source, [sharpen({ amount: 4 })]))
