import { defineEffect, filterStage } from '../core/effect.ts'
import { series } from '../core/filter.ts'
import { clamp } from '../core/numbers.ts'
import type { Effect } from '../core/types.ts'

export interface ShadowOptions {
  readonly x?: number
  readonly y?: number
  readonly blur?: number
  readonly color?: string
  readonly opacity?: number
}

export const shadow = ({
  x = 3,
  y = 4,
  blur = 4,
  color = '#000000',
  opacity = 0.4,
}: ShadowOptions = {}): Effect =>
  defineEffect('shadow', [
    filterStage(
      (io) => ({
        primitives: series(io, [
          {
            name: 'feDropShadow',
            attributes: {
              dx: x,
              dy: y,
              stdDeviation: clamp(blur, 0, 200),
              'flood-color': color,
              'flood-opacity': clamp(opacity, 0, 1),
            },
          },
        ]),
      }),
      { margin: 40 },
    ),
  ])
