import { svgfx, grayscale } from '../../src/index.ts'
import { render } from '../support.ts'

render('grayscale', 'scene.svg', (source) => svgfx(source, [grayscale()]))
