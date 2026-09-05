import { svgfx, sepia } from '../../src/index.ts'
import { render } from '../support.ts'

render('sepia', 'scene.svg', (source) => svgfx(source, [sepia()]))
