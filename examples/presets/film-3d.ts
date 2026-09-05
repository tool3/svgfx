import { svgfx, film } from '../../src/index.ts'
import { render } from '../support.ts'

render('film-3d', 'tetrahedron.svg', (source) => svgfx(source, [film({ grain: { size: 1.2, animate: true } })]))
