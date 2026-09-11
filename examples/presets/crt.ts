import { pstfx, crt } from '../../src/index.ts'
import { render } from '../support.ts'

render('crt', 'scene.svg', (source) => pstfx(source, [crt()]))
