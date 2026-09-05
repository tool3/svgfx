import { svgfx, film } from '../../src/index.ts'
import { render } from '../support.ts'

render('film', 'scene.svg', (source) => svgfx(source, [film()]))
