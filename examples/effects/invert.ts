import { pstfx, invert } from '../../src/index.ts'
import { render } from '../support.ts'

render('invert', 'scene.svg', (source) => pstfx(source, [invert()]))
