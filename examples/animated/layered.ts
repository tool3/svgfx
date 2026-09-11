import { pstfx, crt } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('matrix.svg')

const output = pstfx(
  source,
  [
    crt()
  ],
  { seed: 'dvd' },
)

save('matrix-layered', source, output)
