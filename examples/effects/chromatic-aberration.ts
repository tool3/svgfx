import { svgfx, chromaticAberration } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [chromaticAberration({ offset: 4 })])

save('chromatic-aberration', source, output)
