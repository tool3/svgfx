import { stouch, crt } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('motion.svg')

const output = stouch(source, [crt()])

save('motion-crt', source, output)
