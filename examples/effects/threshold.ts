import { stouch, threshold } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [threshold({ level: 0.5, dark: '#101010', light: '#f6f4ef' })])

save('threshold', source, output)
