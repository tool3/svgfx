import { svgfx, cyberpunk } from '../../src/index.ts'
import { render } from '../support.ts'

render('cyberpunk', 'scene.svg', (source) => svgfx(source, [cyberpunk()]))
