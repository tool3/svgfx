import { pstfx, chromaticAberration } from '../../src/index.ts'
import { render } from '../support.ts'

render('chromatic-aberration', 'scene.svg', (source) => pstfx(source, [chromaticAberration({ offset: 1 })]))
