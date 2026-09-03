import { defineEffect, filterStage } from '../core/effect.ts'
import { primitive } from '../core/filter.ts'
import type { Effect } from '../core/types.ts'

export interface PixelateOptions {
  readonly size?: number
}

export const pixelate = ({ size = 8 }: PixelateOptions = {}): Effect =>
  defineEffect('pixelate', [
    filterStage(
      (io, context) => {
        const cell = Math.max(size, 1)
        const { viewport } = context
        const dot = context.uid('pixelate-dot')
        const cellResult = context.uid('pixelate-cell')
        const grid = context.uid('pixelate-grid')
        const sampled = context.uid('pixelate-sampled')
        return {
          primitives: [
            primitive('feFlood', {
              x: viewport.x + cell / 2 - 1,
              y: viewport.y + cell / 2 - 1,
              width: 2,
              height: 2,
              'flood-color': '#ffffff',
              result: dot,
            }),
            primitive('feComposite', {
              in: dot,
              in2: dot,
              operator: 'over',
              x: viewport.x,
              y: viewport.y,
              width: cell,
              height: cell,
              result: cellResult,
            }),
            primitive('feTile', { in: cellResult, result: grid }),
            primitive('feComposite', { in: io.input, in2: grid, operator: 'in', result: sampled }),
            primitive('feMorphology', {
              in: sampled,
              operator: 'dilate',
              radius: cell / 2,
              result: io.output,
            }),
          ],
        }
      },
      { region: 'viewport' },
    ),
  ])
