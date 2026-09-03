import { stouch, cyberpunk } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [cyberpunk()])

save('cyberpunk', source, output)
