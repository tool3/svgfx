import { svgfx, shadow } from '../../src/index.ts'
import { render } from '../support.ts'

render('shadow', 'mark.svg', (source) => svgfx(source, [shadow({ x: 6, y: 8, blur: 6, opacity: 0.55 })]))
