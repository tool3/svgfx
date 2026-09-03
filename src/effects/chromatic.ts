import { defineEffect, filterStage } from '../core/effect.ts'
import { colorMatrix, primitive } from '../core/filter.ts'
import type { Effect } from '../core/types.ts'

const RED_ONLY = '1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'

const GREEN_ONLY = '0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0'

const BLUE_ONLY = '0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0'

export interface ChromaticAberrationOptions {
  readonly offset?: number
  readonly angle?: number
}

export const chromaticAberration = ({
  offset = 2,
  angle = 0,
}: ChromaticAberrationOptions = {}): Effect =>
  defineEffect('chromaticAberration', [
    filterStage(
      (io, context) => {
        const radians = (angle * Math.PI) / 180
        const dx = Math.cos(radians) * offset
        const dy = Math.sin(radians) * offset
        const shiftedRed = context.uid('chroma-shift-red')
        const shiftedBlue = context.uid('chroma-shift-blue')
        const red = context.uid('chroma-red')
        const green = context.uid('chroma-green')
        const blue = context.uid('chroma-blue')
        const combined = context.uid('chroma-combined')
        return {
          primitives: [
            primitive('feOffset', { in: io.input, dx, dy, result: shiftedRed }),
            colorMatrix(RED_ONLY, { in: shiftedRed, result: red }),
            primitive('feOffset', { in: io.input, dx: -dx, dy: -dy, result: shiftedBlue }),
            colorMatrix(BLUE_ONLY, { in: shiftedBlue, result: blue }),
            colorMatrix(GREEN_ONLY, { in: io.input, result: green }),
            primitive('feBlend', { in: red, in2: green, mode: 'screen', result: combined }),
            primitive('feBlend', { in: combined, in2: blue, mode: 'screen', result: io.output }),
          ],
        }
      },
      { margin: 20 },
    ),
  ])
