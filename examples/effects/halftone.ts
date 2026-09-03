import { stouch, halftone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [halftone({ size: 5, angle: 15 })])

save('halftone', source, output)
