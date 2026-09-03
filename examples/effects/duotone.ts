import { stouch, duotone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [duotone({ shadow: '#111d4a', highlight: '#ffd166' })])

save('duotone', source, output)
