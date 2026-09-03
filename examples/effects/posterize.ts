import { stouch, posterize } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [posterize({ steps: 4 })])

save('posterize', source, output)
