import { animate } from '../core/animation.ts'
import { defineEffect, filterStage } from '../core/effect.ts'
import { primitive } from '../core/filter.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface WaveOptions {
  readonly amplitude?: number
  readonly frequency?: number
  readonly octaves?: number
  readonly animate?: boolean
  readonly speed?: number
}

export const wave = ({
  amplitude = 12,
  frequency = 0.02,
  octaves = 2,
  animate: animated = false,
  speed = 0.15,
}: WaveOptions = {}): Effect =>
  defineEffect('wave', [
    filterStage(
      (io, context) => {
        const noise = context.uid('wave-noise')
        const base = clamp(frequency, 0.0001, 2)
        const motion = animated && context.motion
        return {
          primitives: [
            primitive(
              'feTurbulence',
              {
                type: 'fractalNoise',
                baseFrequency: base,
                numOctaves: Math.max(Math.round(octaves), 1),
                seed: Math.round(context.range(0, 512, 'seed')),
                result: noise,
              },
              motion
                ? [
                    animate({
                      attributeName: 'baseFrequency',
                      values: `${formatNumber(base)};${formatNumber(base * 1.6)};${formatNumber(base)}`,
                      dur: `${formatNumber(1 / Math.max(speed, 0.01))}s`,
                    }),
                  ]
                : [],
            ),
            primitive('feDisplacementMap', {
              in: io.input,
              in2: noise,
              scale: amplitude,
              xChannelSelector: 'R',
              yChannelSelector: 'G',
              result: io.output,
            }),
          ],
        }
      },
      { margin: 25 },
    ),
  ])
