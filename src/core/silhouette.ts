import { element, withAttributes } from './document.ts'
import { colorMatrix } from './filter.ts'
import { group, mask, use } from './layers.ts'
import { detectShape } from './shape.ts'
import type { AttributeInput, EffectContext, SvgElement, Viewport } from './types.ts'

const OPAQUE_WHITE = ['0 0 0 0 1', '0 0 0 0 1', '0 0 0 0 1', '0 0 0 1 0'].join(' ')

export type ClipMode = 'shape' | 'viewport'

export interface ShapeClip {
  readonly attribute: 'clip-path' | 'mask'
  readonly value: string
  readonly defs: readonly SvgElement[]
  readonly content: SvgElement
  readonly flush: boolean
}

const region = (viewport: Viewport): Viewport => ({
  x: viewport.x - viewport.width * 0.2,
  y: viewport.y - viewport.height * 0.2,
  width: viewport.width * 1.4,
  height: viewport.height * 1.4,
})

export const silhouette = (content: SvgElement, context: EffectContext): ShapeClip => {
  const sourceId = content.attributes.id ?? context.uid('shape')
  const filterId = context.uid('shape-alpha')
  const maskId = context.uid('shape-mask')
  const area = region(context.viewport)
  return {
    attribute: 'mask',
    value: `url(#${maskId})`,
    flush: false,
    content: withAttributes(content, { id: sourceId }),
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

export const clipped = (content: SvgElement, context: EffectContext, mode: ClipMode): ShapeClip | null => {
  if (mode !== 'shape') return null

  const detected = detectShape(context.root, context.artwork, context.viewport, context.sharedId('clip'))
  if (detected !== null) {
    return {
      attribute: 'clip-path',
      value: detected.reference as string,
      flush: true,
      content,
      defs: detected.definition === null ? [] : [detected.definition],
    }
  }

  return silhouette(content, context)
}

export const clipAttributes = (shape: ShapeClip | null): AttributeInput =>
  shape === null ? {} : { [shape.attribute]: shape.value }
