import { svgfx, duotone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('tones.svg')

const output = svgfx(source, [duotone({ shadow: '#111d4a', highlight: '#ffd166' })])

save('duotone', source, output)
