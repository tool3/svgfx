import { stouch, sepia } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [sepia()])

save('sepia', source, output)
