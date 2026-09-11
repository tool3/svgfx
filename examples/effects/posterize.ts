import { pstfx, posterize } from '../../src/index.ts'
import { render } from '../support.ts'

render('posterize', 'scene.svg', (source) => pstfx(source, [posterize({ steps: 4 })]))
