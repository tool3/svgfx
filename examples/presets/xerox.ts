import { svgfx, xerox } from '../../src/index.ts'
import { render } from '../support.ts'

render('xerox', 'tones.svg', (source) => svgfx(source, [xerox()]))
