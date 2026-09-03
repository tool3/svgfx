import { defineEffect, filterStage } from '../core/effect.ts'
import { RGB_CHANNELS, componentTransfer, primitive, transfer } from '../core/filter.ts'
import { clamp } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface BloomOptions {
  readonly radius?: number
  readonly threshold?: number
  readonly intensity?: number
}

export const bloom = ({ radius = 8, threshold = 0.55, intensity = 1.1 }: BloomOptions = {}): Effect =>
  defineEffect('bloom', [
    filterStage(
      (io, context) => {
        const cut = clamp(threshold, 0, 0.95)
        const slope = 1 / (1 - cut)
        const bright = context.uid('bloom-bright')
        const spread = context.uid('bloom-spread')
        const boosted = context.uid('bloom-boost')
        return {
          primitives: [
            componentTransfer(
              { in: io.input, result: bright },
              transfer(RGB_CHANNELS, { type: 'linear', slope, intercept: -cut * slope }),
            ),
            primitive('feGaussianBlur', {
              in: bright,
              stdDeviation: clamp(radius, 0, 200),
              result: spread,
            }),
            componentTransfer(
              { in: spread, result: boosted },
              transfer(RGB_CHANNELS, { type: 'linear', slope: clamp(intensity, 0, 10) }),
            ),
            primitive('feBlend', { in: io.input, in2: boosted, mode: 'screen', result: io.output }),
          ],
        }
      },
      { margin: 35 },
    ),
  ])
