import { element } from './document.ts'
import type { AttributeInput, SvgElement, SvgNode, Viewport } from './types.ts'

export const group = (children: readonly SvgNode[], attributes: AttributeInput = {}): SvgElement =>
  element('g', attributes, children)

export const rect = (attributes: AttributeInput): SvgElement => element('rect', attributes)

export const use = (id: string, attributes: AttributeInput = {}): SvgElement =>
  element('use', { href: `#${id}`, ...attributes })

export const cover = (viewport: Viewport, attributes: AttributeInput = {}): SvgElement =>
  rect({ x: viewport.x, y: viewport.y, width: viewport.width, height: viewport.height, ...attributes })

export const expanded = (viewport: Viewport, factor: number): Viewport => ({
  x: viewport.x - (viewport.width * (factor - 1)) / 2,
  y: viewport.y - (viewport.height * (factor - 1)) / 2,
  width: viewport.width * factor,
  height: viewport.height * factor,
})

export const stop = (offset: number, color: string, opacity: number): SvgElement =>
  element('stop', { offset, 'stop-color': color, 'stop-opacity': opacity })

export const radialGradient = (
  id: string,
  stops: readonly SvgElement[],
  attributes: AttributeInput = {},
): SvgElement => element('radialGradient', { id, ...attributes }, stops)

export const linearGradient = (
  id: string,
  stops: readonly SvgElement[],
  attributes: AttributeInput = {},
): SvgElement => element('linearGradient', { id, ...attributes }, stops)

export const pattern = (id: string, attributes: AttributeInput, children: readonly SvgNode[]): SvgElement =>
  element('pattern', { id, patternUnits: 'userSpaceOnUse', ...attributes }, children)

export const mask = (id: string, children: readonly SvgNode[], attributes: AttributeInput = {}): SvgElement =>
  element('mask', { id, maskUnits: 'userSpaceOnUse', ...attributes }, children)

export const clipPath = (id: string, children: readonly SvgNode[], attributes: AttributeInput = {}): SvgElement =>
  element('clipPath', { id, clipPathUnits: 'userSpaceOnUse', ...attributes }, children)

export const filtered = (children: readonly SvgNode[], filterId: string): SvgElement =>
  group(children, { filter: `url(#${filterId})` })
