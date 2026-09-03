import { stouch, bloom, glitch, grain, scanlines } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('motion.svg')

const output = stouch(
  source,
  [
    bloom({ radius: 6, threshold: 0.45 }),
    glitch({ intensity: 0.6, slices: 8, animate: true, speed: 1.4 }),
    scanlines({ gap: 3, opacity: 0.3, animate: true, speed: 5 }),
    grain({ amount: 0.35, animate: true }),
  ],
  { seed: 'dvd' },
)

save('motion-layered', source, output)
