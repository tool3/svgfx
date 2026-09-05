import { svgfx, duotone } from '../../src/index.ts'
import { render } from '../support.ts'

render('duotone', 'tones.svg', (source) => svgfx(source, [duotone({ shadow: '#111d4a', highlight: '#ffd166' })]))
