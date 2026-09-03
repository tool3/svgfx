import { stouch, saturate } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [saturate({ amount: 2.2 })])

save('saturate', source, output)
