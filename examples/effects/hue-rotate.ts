import { pstfx, hueRotate } from '../../src/index.ts'
import { render } from '../support.ts'

render('hue-rotate', 'scene.svg', (source) => pstfx(source, [hueRotate({ angle: 140 })]))
