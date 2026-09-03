import { defineEffect, filterStage } from '../core/effect.ts'
import { componentTransfer, merge, primitive, transfer } from '../core/filter.ts'
import { clamp } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface GlowOptions {
  readonly color?: string
  readonly radius?: number
  readonly spread?: number
  readonly intensity?: number
}

export const glow = ({
  color = '#ffffff',
  radius = 6,
  spread = 0,
  intensity = 1,
}: GlowOptions = {}): Effect =>
  defineEffect('glow', [
    filterStage(
      (io, context) => {
        const grown = context.uid('glow-grown')
        const soft = context.uid('glow-soft')
        const boosted = context.uid('glow-boost')
        const tint = context.uid('glow-tint')
        const halo = context.uid('glow-halo')
        const dilation =
          spread > 0
            ? [primitive('feMorphology', { in: io.input, operator: 'dilate', radius: spread, result: grown })]
            : []
        return {
          primitives: [
            ...dilation,
            primitive('feGaussianBlur', {
              in: spread > 0 ? grown : io.input,
              stdDeviation: clamp(radius, 0, 200),
              result: soft,
            }),
            componentTransfer(
              { in: soft, result: boosted },
              transfer(['A'], { type: 'linear', slope: clamp(intensity, 0, 10) }),
            ),
            primitive('feFlood', { 'flood-color': color, result: tint }),
            primitive('feComposite', { in: tint, in2: boosted, operator: 'in', result: halo }),
            merge([halo, io.input], { result: io.output }),
          ],
        }
      },
      { margin: 40 },
    ),
  ])
