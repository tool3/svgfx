import { pstfx, cyberpunk } from '../../src/index.ts'
import { render } from '../support.ts'

render('cyberpunk', 'scene.svg', (source) => pstfx(source, [cyberpunk()]))
