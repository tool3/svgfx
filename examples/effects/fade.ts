import { stouch, fade } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('mark.svg')

const output = stouch(source, [fade({ amount: 0.45 })])

save('fade', source, output)
