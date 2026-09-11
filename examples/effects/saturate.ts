import { pstfx, saturate } from '../../src/index.ts'
import { render } from '../support.ts'

render('saturate', 'scene.svg', (source) => pstfx(source, [saturate({ amount: 2.2 })]))
