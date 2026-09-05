import { svgfx, pixelate } from '../../src/index.ts'
import { render } from '../support.ts'

render('pixelate', 'mark.svg', (source) => svgfx(source, [pixelate({ size: 10 })]))
