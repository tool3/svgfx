import { svgfx, vhs } from '../../src/index.ts'
import { render } from '../support.ts'

render('vhs', 'scene.svg', (source) => svgfx(source, [vhs()]))
