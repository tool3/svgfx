import { svgfx, cyberpunk } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [cyberpunk()])

save('cyberpunk', source, output)
