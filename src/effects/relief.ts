import { defineEffect, filterStage } from '../core/effect.ts'
import { primitive, series } from '../core/filter.ts'
import { formatNumber } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface EmbossOptions {
  readonly depth?: number
  readonly angle?: number
  readonly desaturate?: boolean
}

const embossKernel = (depth: number, angle: number): string => {
  const radians = (angle * Math.PI) / 180
  const dx = Math.cos(radians)
  const dy = -Math.sin(radians)
  const offsets = [-1, 0, 1]
  return offsets
    .flatMap((row) =>
      offsets.map((column) =>
        formatNumber(row === 0 && column === 0 ? 0 : depth * (column * dx + row * dy)),
      ),
    )
    .join(' ')
}

export const emboss = ({ depth = 1, angle = 135, desaturate = true }: EmbossOptions = {}): Effect =>
  defineEffect('emboss', [
    filterStage((io, context) => {
      const relief = context.uid('emboss-relief')
      const convolution = primitive('feConvolveMatrix', {
        in: io.input,
        order: 3,
        divisor: 1,
        bias: 0.5,
        preserveAlpha: 'true',
        kernelMatrix: embossKernel(depth, angle),
        result: desaturate ? relief : io.output,
      })
      return {
        primitives: desaturate
          ? [
              convolution,
              primitive('feColorMatrix', { in: relief, type: 'saturate', values: 0, result: io.output }),
            ]
          : [convolution],
      }
    }),
  ])

export interface SharpenOptions {
  readonly amount?: number
}

export const sharpen = ({ amount = 1 }: SharpenOptions = {}): Effect =>
  defineEffect('sharpen', [
    filterStage((io) => ({
      primitives: series(io, [
        {
          name: 'feConvolveMatrix',
          attributes: {
            order: 3,
            divisor: 1,
            preserveAlpha: 'true',
            kernelMatrix: [
              0,
              -amount,
              0,
              -amount,
              1 + 4 * amount,
              -amount,
              0,
              -amount,
              0,
            ]
              .map(formatNumber)
              .join(' '),
          },
        },
      ]),
    })),
  ])
