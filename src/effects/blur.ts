import { defineEffect, filterStage } from '../core/effect.ts'
import { series } from '../core/filter.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export type BlurAxis = 'both' | 'horizontal' | 'vertical'

export interface BlurOptions {
  readonly radius?: number
  readonly axis?: BlurAxis
}

const deviation = (radius: number, axis: BlurAxis): string =>
  axis === 'horizontal'
    ? `${formatNumber(radius)} 0`
    : axis === 'vertical'
      ? `0 ${formatNumber(radius)}`
      : formatNumber(radius)

export const blur = ({ radius = 3, axis = 'both' }: BlurOptions = {}): Effect =>
  defineEffect('blur', [
    filterStage(
      (io) => ({
        primitives: series(io, [
          { name: 'feGaussianBlur', attributes: { stdDeviation: deviation(clamp(radius, 0, 200), axis) } },
        ]),
      }),
      { margin: 25 },
    ),
  ])
