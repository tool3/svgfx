import { formatNumber } from './numbers.ts'
import type { AttributeInput, SvgAttributes, SvgElement, SvgNode, Viewport } from './types.ts'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

const DEFAULT_VIEWPORT: Viewport = { x: 0, y: 0, width: 300, height: 150 }

const NON_RENDERING = new Set([
  'defs',
  'style',
  'script',
  'title',
  'desc',
  'metadata',
  'symbol',
  'marker',
  'linearGradient',
  'radialGradient',
  'pattern',
  'clipPath',
  'mask',
  'filter',
  'animate',
  'animateMotion',
  'animateTransform',
  'set',
  'view',
  'font',
  'font-face',
  'hatch',
  'solidColor',
])

export const normalizeAttributes = (input: AttributeInput): SvgAttributes =>
  Object.fromEntries(
    Object.entries(input).flatMap(([name, value]) =>
      value === undefined || value === null || value === false
        ? []
        : [[name, value === true ? '' : typeof value === 'number' ? formatNumber(value) : value]],
    ),
  )

export const element = (
  name: string,
  attributes: AttributeInput = {},
  children: readonly SvgNode[] = [],
): SvgElement => ({ type: 'element', name, attributes: normalizeAttributes(attributes), children })

export const withAttributes = (target: SvgElement, attributes: AttributeInput): SvgElement => ({
  ...target,
  attributes: { ...target.attributes, ...normalizeAttributes(attributes) },
})

export const withChildren = (target: SvgElement, children: readonly SvgNode[]): SvgElement => ({
  ...target,
  children,
})

const parseViewBox = (value: string | undefined): Viewport | null => {
  const parts = (value ?? '').split(/[\s,]+/).filter((part) => part.length > 0).map(Number)
  const [x, y, width, height] = parts
  return parts.length === 4 && parts.every(Number.isFinite) && width !== undefined && height !== undefined && width > 0 && height > 0
    ? { x: x as number, y: y as number, width, height }
    : null
}

const parseSize = (width: string | undefined, height: string | undefined): Viewport | null => {
  const parsedWidth = Number.parseFloat(width ?? '')
  const parsedHeight = Number.parseFloat(height ?? '')
  return Number.isFinite(parsedWidth) && Number.isFinite(parsedHeight) && parsedWidth > 0 && parsedHeight > 0
    ? { x: 0, y: 0, width: parsedWidth, height: parsedHeight }
    : null
}

export const readViewport = (root: SvgElement): Viewport =>
  parseViewBox(root.attributes.viewBox) ??
  parseSize(root.attributes.width, root.attributes.height) ??
  DEFAULT_VIEWPORT

export const ensureNamespace = (root: SvgElement): SvgElement =>
  root.attributes.xmlns === undefined ? withAttributes(root, { xmlns: SVG_NAMESPACE }) : root

export const isNonRendering = (node: SvgNode): boolean =>
  node.type === 'element'
    ? NON_RENDERING.has(node.name)
    : node.type !== 'text' || node.value.trim().length === 0

export const splitContent = (
  root: SvgElement,
): { readonly fixed: readonly SvgNode[]; readonly renderable: readonly SvgNode[] } => ({
  fixed: root.children.filter(isNonRendering),
  renderable: root.children.filter((child) => !isNonRendering(child)),
})
