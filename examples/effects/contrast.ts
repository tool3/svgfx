import { stouch, contrast } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [contrast({ amount: 1.7 })])

save('contrast', source, output)
