import { pstfx, sepia } from '../../src/index.ts'
import { render } from '../support.ts'

render('sepia', 'scene.svg', (source) => pstfx(source, [sepia()]))
