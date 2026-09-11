import { pstfx, grayscale } from '../../src/index.ts'
import { render } from '../support.ts'

render('grayscale', 'scene.svg', (source) => pstfx(source, [grayscale()]))
