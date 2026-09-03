import { stouch, xerox } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [xerox()])

save('xerox', source, output)
