import { stouch, brightness } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [brightness({ amount: 1.35 })])

save('brightness', source, output)
