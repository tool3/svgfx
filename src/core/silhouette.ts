import { element, withAttributes } from './document.ts'
import { colorMatrix } from './filter.ts'
import { group, mask, use } from './layers.ts'
import type { EffectContext, SvgElement, Viewport } from './types.ts'

const OPAQUE_WHITE = ['0 0 0 0 1', '0 0 0 0 1', '0 0 0 0 1', '0 0 0 1 0'].join(' ')

export type ClipMode = 'shape' | 'viewport'

export interface Silhouette {
  readonly content: SvgElement
  readonly defs: readonly SvgElement[]
  readonly maskId: string
}

const region = (viewport: Viewport): Viewport => ({
  x: viewport.x - viewport.width * 0.2,
  y: viewport.y - viewport.height * 0.2,
  width: viewport.width * 1.4,
  height: viewport.height * 1.4,
})

export const silhouette = (content: SvgElement, context: EffectContext): Silhouette => {
  const sourceId = content.attributes.id ?? context.uid('shape')
  const filterId = context.uid('shape-alpha')
  const maskId = context.uid('shape-mask')
  const area = region(context.viewport)
  return {
    content: withAttributes(content, { id: sourceId }),
    maskId,
    defs: [
      element('filter', { id: filterId, 'color-interpolation-filters': 'sRGB' }, [
        colorMatrix(OPAQUE_WHITE, { in: 'SourceGraphic' }),
      ]),
      mask(maskId, [group([use(sourceId)], { filter: `url(#${filterId})` })], {
        x: area.x,
        y: area.y,
        width: area.width,
        height: area.height,
      }),
    ],
  }
}

export const clipped = (
  content: SvgElement,
  context: EffectContext,
  mode: ClipMode,
): Silhouette | null => (mode === 'shape' ? silhouette(content, context) : null)
