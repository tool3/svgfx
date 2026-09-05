import { svgfx, chromaticAberration } from '../../src/index.ts'
import { render } from '../support.ts'

render('chromatic-aberration', 'scene.svg', (source) => svgfx(source, [chromaticAberration({ offset: 1 })]))
