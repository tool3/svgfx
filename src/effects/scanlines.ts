import { animationDeclaration, keyframes } from '../core/animation.ts'
import { defineEffect, layerStage } from '../core/effect.ts'
import { cover, expanded, group, pattern, rect } from '../core/layers.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import { clipAttributes, clipped } from '../core/silhouette.ts'
import type { ClipMode } from '../core/silhouette.ts'
import type { Effect } from '../core/types.ts'

export type ScanlineBlend = 'multiply' | 'overlay' | 'screen' | 'normal'

export interface ScanlinesOptions {
  readonly gap?: number
  readonly thickness?: number
  readonly opacity?: number
  readonly color?: string
  readonly angle?: number
  readonly blend?: ScanlineBlend
  readonly animate?: boolean
  readonly speed?: number
  readonly clip?: ClipMode
}

export const scanlines = ({
  gap = 4,
  thickness = 1.5,
  opacity = 0.28,
  color = '#000000',
  angle = 0,
  blend = 'multiply',
  animate: animated = false,
  speed = 6,
  clip = 'shape',
}: ScanlinesOptions = {}): Effect =>
  defineEffect('scanlines', [
    layerStage((content, context) => {
      const patternId = context.uid('scanlines')
      const animationName = context.uid('scanroll')
      const pitch = Math.max(gap, 0.1)
      const motion = animated && context.motion
      const area = angle === 0 ? context.viewport : expanded(context.viewport, 1.6)
      const shape = clipped(content, context, clip)
      const overlay = cover(area, {
        fill: `url(#${patternId})`,
        opacity: clamp(opacity, 0, 1),
        style: blend === 'normal' ? undefined : `mix-blend-mode:${blend}`,
        ...clipAttributes(shape),
      })
      return {
        defs: [
          ...(shape?.defs ?? []),
          pattern(
            patternId,
            { width: pitch, height: pitch, patternTransform: angle === 0 ? undefined : `rotate(${formatNumber(angle)})` },
            [rect({ x: 0, y: 0, width: pitch, height: clamp(thickness, 0, pitch), fill: color })],
          ),
        ],
        styles: motion
          ? [
              keyframes(animationName, [
                ['from', 'transform:translateY(0)'],
                ['to', `transform:translateY(${formatNumber(pitch)}px)`],
              ]),
            ]
          : [],
        content: group([
          shape?.content ?? content,
          motion
            ? group([overlay], {
                style: animationDeclaration(animationName, `${formatNumber(pitch / Math.max(speed, 0.1))}s`),
              })
            : overlay,
        ]),
      }
    }),
  ])
