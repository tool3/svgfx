import { svgfx, scanlines } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [scanlines({ gap: 3, thickness: 1.2, opacity: 0.35 })])

save('scanlines', source, output)
