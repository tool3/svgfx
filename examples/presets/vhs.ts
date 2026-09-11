import { pstfx, vhs } from '../../src/index.ts'
import { render } from '../support.ts'

render('vhs', 'scene.svg', (source) => pstfx(source, [vhs()]))
