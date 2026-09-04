import { stouch, outline } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = stouch(source, [outline({ width: 3, color: '#6b7280' })])

save('outline', source, output)
