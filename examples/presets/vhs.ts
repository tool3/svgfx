import { stouch, vhs } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [vhs()])

save('vhs', source, output)
