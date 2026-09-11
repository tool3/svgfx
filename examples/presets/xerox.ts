import { pstfx, xerox } from '../../src/index.ts'
import { render } from '../support.ts'

render('xerox', 'tones.svg', (source) => pstfx(source, [xerox()]))
