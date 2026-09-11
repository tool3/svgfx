import { pstfx, riso } from '../../src/index.ts'
import { render } from '../support.ts'

render('riso', 'scene.svg', (source) => pstfx(source, [riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })]))
