import { animate } from '../core/animation.ts'
import { defineEffect, filterStage } from '../core/effect.ts'
import { RGB_CHANNELS, componentTransfer, primitive, transfer } from '../core/filter.ts'
import { clamp } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export type GrainBlend = 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'normal'

export interface GrainOptions {
  readonly amount?: number
  readonly size?: number
  readonly monochrome?: boolean
  readonly blend?: GrainBlend
  readonly animate?: boolean
  readonly speed?: number
}

const FRAME_COUNT = 8

export const grain = ({
  amount = 0.32,
  size = 0.8,
  monochrome = true,
  blend = 'overlay',
  animate: animated = false,
  speed = 12,
}: GrainOptions = {}): Effect =>
  defineEffect('grain', [
    filterStage((io, context) => {
      const noise = context.uid('grain-noise')
      const desaturated = context.uid('grain-mono')
      const leveled = context.uid('grain-level')
      const blended = context.uid('grain-blend')
      const strength = clamp(amount, 0, 1)
      const motion = animated && context.motion
      const frames = Array.from({ length: FRAME_COUNT }, (_, index) =>
        Math.round(context.range(0, 512, `frame${index}`)),
      )
      return {
        primitives: [
          primitive(
            'feTurbulence',
            {
              type: 'fractalNoise',
              baseFrequency: clamp(size, 0.01, 4),
              numOctaves: 3,
              stitchTiles: 'stitch',
              seed: Math.round(context.range(0, 512, 'seed')),
              result: noise,
            },
            motion
              ? [
                  animate({
                    attributeName: 'seed',
                    values: [...frames, frames[0] ?? 0].join(';'),
                    dur: `${clamp(FRAME_COUNT / Math.max(speed, 0.1), 0.05, 60)}s`,
                    calcMode: 'discrete',
                  }),
                ]
              : [],
          ),
          ...(monochrome
            ? [primitive('feColorMatrix', { in: noise, type: 'saturate', values: 0, result: desaturated })]
            : []),
          componentTransfer({ in: monochrome ? desaturated : noise, result: leveled }, [
            ...transfer(RGB_CHANNELS, { type: 'linear', slope: strength, intercept: 0.5 - strength / 2 }),
            ...transfer(['A'], { type: 'table', tableValues: '1 1' }),
          ]),
          primitive('feBlend', { in: leveled, in2: io.input, mode: blend, result: blended }),
          primitive('feComposite', { in: blended, in2: io.input, operator: 'in', result: io.output }),
        ],
      }
    }),
  ])
