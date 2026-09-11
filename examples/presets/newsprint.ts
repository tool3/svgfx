import { pstfx, newsprint } from '../../src/index.ts'
import { render } from '../support.ts'

render('newsprint', 'tones.svg', (source) => pstfx(source, [newsprint()]))
