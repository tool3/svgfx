import { stouch, newsprint } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = stouch(source, [newsprint()])

save('newsprint', source, output)
