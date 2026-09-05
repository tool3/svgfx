import { svgfx, posterize } from '../../src/index.ts'
import { render } from '../support.ts'

render('posterize', 'scene.svg', (source) => svgfx(source, [posterize({ steps: 4 })]))
