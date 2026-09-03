import { stouch, glitch } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [glitch({ intensity: 0.8, slices: 10 })])

save('glitch', source, output)
