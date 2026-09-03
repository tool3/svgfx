import { stouch, blur } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [blur({ radius: 4 })])

save('blur', source, output)
