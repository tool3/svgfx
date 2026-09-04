import { element, withAttributes } from '../core/document.ts'
import { defineEffect, layerStage } from '../core/effect.ts'
import { LUMINANCE_MATRIX, RGB_CHANNELS, colorMatrix, componentTransfer, primitive, transfer } from '../core/filter.ts'
import { cover, group, mask, pattern, use } from '../core/layers.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import { clipAttributes, clipped } from '../core/silhouette.ts'
import type { ClipMode } from '../core/silhouette.ts'
import type { EffectContext, Effect, SvgElement, Viewport } from '../core/types.ts'

export interface HalftoneOptions {
  readonly size?: number
  readonly angle?: number
  readonly levels?: number
  readonly color?: string
  readonly background?: string | null
  readonly keepSource?: boolean
  readonly clip?: ClipMode
}

const EDGE = 60

interface Band {
  readonly mask: SvgElement
  readonly cut: SvgElement
  readonly dots: SvgElement
  readonly layer: SvgElement
}

const maskRegion = (viewport: Viewport): Viewport => ({
  x: viewport.x - viewport.width * 0.1,
  y: viewport.y - viewport.height * 0.1,
  width: viewport.width * 1.2,
  height: viewport.height * 1.2,
})

const cutFilter = (id: string, threshold: number): SvgElement => {
  const luminance = `${id}-luminance`
  const stepped = `${id}-stepped`
  return element('filter', { id, 'color-interpolation-filters': 'sRGB' }, [
    colorMatrix(LUMINANCE_MATRIX, { in: 'SourceGraphic', result: luminance }),
    componentTransfer(
      { in: luminance, result: stepped },
      transfer(RGB_CHANNELS, { type: 'linear', slope: -EDGE, intercept: EDGE * (1 - threshold) + 0.5 }),
    ),
    primitive('feComposite', { in: stepped, in2: 'SourceAlpha', operator: 'in' }),
  ])
}

const buildBand = (
  context: EffectContext,
  sourceId: string,
  index: number,
  count: number,
  cell: number,
  angle: number,
  color: string,
): Band => {
  const cutId = context.uid(`halftone-cut${index}`)
  const maskId = context.uid(`halftone-mask${index}`)
  const dotsId = context.uid(`halftone-dots${index}`)
  const threshold = (index + 0.5) / count
  const radius = cell * 0.72 * Math.sqrt((index + 1) / count)
  const region = maskRegion(context.viewport)
  return {
    cut: cutFilter(cutId, threshold),
    mask: mask(
      maskId,
      [group([use(sourceId)], { filter: `url(#${cutId})` })],
      { x: region.x, y: region.y, width: region.width, height: region.height },
    ),
    dots: pattern(
      dotsId,
      { width: cell, height: cell, patternTransform: `rotate(${formatNumber(angle)})` },
      [element('circle', { cx: cell / 2, cy: cell / 2, r: radius, fill: color })],
    ),
    layer: cover(context.viewport, { fill: `url(#${dotsId})`, mask: `url(#${maskId})` }),
  }
}

export const halftone = ({
  size = 6,
  angle = 45,
  levels = 4,
  color = '#111111',
  background = '#ffffff',
  keepSource = false,
  clip = 'shape',
}: HalftoneOptions = {}): Effect =>
  defineEffect('halftone', [
    layerStage((content, context) => {
      const sourceId = context.uid('halftone-source')
      const source = withAttributes(content, { id: sourceId })
      const cell = Math.max(size, 1)
      const count = Math.round(clamp(levels, 1, 8))
      const bands = Array.from({ length: count }, (_, index) =>
        buildBand(context, sourceId, index, count, cell, angle, color),
      )
      const shape = clipped(source, context, clip)
      const paper = shape?.content ?? source
      const backdrop =
        keepSource || background === null
          ? []
          : [
              cover(context.viewport, { fill: background, ...clipAttributes(shape) }),
            ]
      return {
        defs: [
          ...(shape?.defs ?? []),
          ...(keepSource ? [] : [paper]),
          ...bands.flatMap((band) => [band.cut, band.mask, band.dots]),
        ],
        content: group([
          ...(keepSource ? [paper] : []),
          ...backdrop,
          ...bands.map((band) => band.layer),
        ]),
      }
    }),
  ])
