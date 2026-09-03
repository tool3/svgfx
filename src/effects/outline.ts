import { defineEffect, filterStage } from '../core/effect.ts'
import { merge, primitive } from '../core/filter.ts'
import type { Effect } from '../core/types.ts'

export type OutlinePosition = 'outside' | 'inside'

export interface OutlineOptions {
  readonly width?: number
  readonly color?: string
  readonly position?: OutlinePosition
}

export const outline = ({
  width = 2,
  color = '#000000',
  position = 'outside',
}: OutlineOptions = {}): Effect =>
  defineEffect('outline', [
    filterStage(
      (io, context) => {
        const shape = context.uid('outline-shape')
        const band = context.uid('outline-band')
        const tint = context.uid('outline-tint')
        const stroke = context.uid('outline-stroke')
        const radius = Math.max(width, 0)
        const shaping =
          position === 'outside'
            ? [primitive('feMorphology', { in: io.input, operator: 'dilate', radius, result: band })]
            : [
                primitive('feMorphology', { in: io.input, operator: 'erode', radius, result: shape }),
                primitive('feComposite', { in: io.input, in2: shape, operator: 'out', result: band }),
              ]
        return {
          primitives: [
            ...shaping,
            primitive('feFlood', { 'flood-color': color, result: tint }),
            primitive('feComposite', { in: tint, in2: band, operator: 'in', result: stroke }),
            merge(position === 'outside' ? [stroke, io.input] : [io.input, stroke], { result: io.output }),
          ],
        }
      },
      { margin: 25 },
    ),
  ])
