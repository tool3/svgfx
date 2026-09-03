import { stouch, crt } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [crt()])

save('crt', source, output)
