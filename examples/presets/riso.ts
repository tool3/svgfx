import { svgfx, riso } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })])

save('riso', source, output)
