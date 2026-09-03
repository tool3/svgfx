import { defineEffect, layerStage } from '../core/effect.ts'
import { cover, group, radialGradient, stop } from '../core/layers.ts'
import { clamp } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface VignetteOptions {
  readonly amount?: number
  readonly radius?: number
  readonly softness?: number
  readonly color?: string
}

export const vignette = ({
  amount = 0.65,
  radius = 0.6,
  softness = 0.7,
  color = '#000000',
}: VignetteOptions = {}): Effect =>
  defineEffect('vignette', [
    layerStage((content, context) => {
      const gradientId = context.uid('vignette')
      const inner = clamp(radius, 0, 0.99)
      const strength = clamp(amount, 0, 1)
      const middle = inner + (1 - inner) * clamp(1 - softness, 0, 1) * 0.5
      return {
        defs: [
          radialGradient(
            gradientId,
            [
              stop(inner, color, 0),
              stop(clamp(middle, inner, 0.999), color, strength * 0.35),
              stop(1, color, strength),
            ],
            { cx: '50%', cy: '50%', r: '75%' },
          ),
        ],
        content: group([content, cover(context.viewport, { fill: `url(#${gradientId})` })]),
      }
    }),
  ])
