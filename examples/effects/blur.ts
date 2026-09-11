import { pstfx, blur } from '../../src/index.ts'
import { render } from '../support.ts'

render('blur', 'scene.svg', (source) => pstfx(source, [blur({ radius: 4 })]))
