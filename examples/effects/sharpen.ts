import { stouch, sharpen } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [sharpen({ amount: 4 })])

save('sharpen', source, output)
