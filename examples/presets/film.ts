import { pstfx, film } from '../../src/index.ts'
import { render } from '../support.ts'

render('film', 'scene.svg', (source) => pstfx(source, [film()]))
