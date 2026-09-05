import { svgfx, blur } from '../../src/index.ts'
import { render } from '../support.ts'

render('blur', 'scene.svg', (source) => svgfx(source, [blur({ radius: 4 })]))
