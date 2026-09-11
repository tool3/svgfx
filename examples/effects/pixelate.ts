import { pstfx, pixelate } from '../../src/index.ts'
import { render } from '../support.ts'

render('pixelate', 'mark.svg', (source) => pstfx(source, [pixelate({ size: 10 })]))
