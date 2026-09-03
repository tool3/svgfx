import { stouch, chromaticAberration } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [chromaticAberration({ offset: 4 })])

save('chromatic-aberration', source, output)
