import { element } from './document.ts'
import type { SvgElement, SvgNode, Viewport } from './types.ts'

const GEOMETRY: Readonly<Record<string, readonly string[]>> = {
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  polygon: ['points'],
  polyline: ['points'],
  path: ['d'],
}

const CONTAINERS = new Set(['g', 'a', 'switch'])

const TRANSPARENT = new Set(['none', 'transparent'])

const TRANSLATE = /translate\(\s*(-?[\d.]+)(?:[\s,]+(-?[\d.]+))?\s*\)/g

const OTHER_TRANSFORM = /(matrix|rotate|scale|skewX|skewY)\s*\(/

interface Candidate {
  readonly element: SvgElement
  readonly offsetX: number
  readonly offsetY: number
  readonly translatable: boolean
}

const translation = (transform: string): { readonly x: number; readonly y: number; readonly pure: boolean } => {
  const pure = !OTHER_TRANSFORM.test(transform)
  const moves = Array.from(transform.matchAll(TRANSLATE))
  return {
    x: moves.reduce((total, move) => total + Number(move[1] ?? 0), 0),
    y: moves.reduce((total, move) => total + Number(move[2] ?? 0), 0),
    pure,
  }
}

const isElement = (node: SvgNode): node is SvgElement => node.type === 'element'

const collect = (nodes: readonly SvgNode[], offsetX: number, offsetY: number, pure: boolean): readonly Candidate[] =>
  nodes.filter(isElement).flatMap((node) => {
    if (GEOMETRY[node.name] !== undefined) {
      const own = translation(node.attributes.transform ?? '')
      return [
        {
          element: node,
          offsetX: offsetX + own.x,
          offsetY: offsetY + own.y,
          translatable: pure && own.pure,
        },
      ]
    }
    if (!CONTAINERS.has(node.name)) return [{ element: node, offsetX, offsetY, translatable: false }]
    const own = translation(node.attributes.transform ?? '')
    return collect(node.children, offsetX + own.x, offsetY + own.y, pure && own.pure)
  })

const length = (value: string | undefined, fallback: number, basis: number): number => {
  if (value === undefined) return fallback
  const trimmed = value.trim()
  if (trimmed.endsWith('%')) return (Number.parseFloat(trimmed) / 100) * basis
  const parsed = Number.parseFloat(trimmed)
  return Number.isFinite(parsed) ? parsed : fallback
}

const near = (a: number, b: number): boolean => Math.abs(a - b) <= Math.max(1, Math.abs(b) * 0.01)

const isPainted = (target: SvgElement): boolean => {
  const fill = target.attributes.fill
  return fill === undefined || !TRANSPARENT.has(fill.trim().toLowerCase())
}

const coversViewport = (candidate: Candidate, viewport: Viewport): boolean => {
  const { element: target } = candidate
  if (target.name !== 'rect' || !candidate.translatable || !isPainted(target)) return false
  const x = length(target.attributes.x, 0, viewport.width) + candidate.offsetX
  const y = length(target.attributes.y, 0, viewport.height) + candidate.offsetY
  const width = length(target.attributes.width, 0, viewport.width)
  const height = length(target.attributes.height, 0, viewport.height)
  return near(x, viewport.x) && near(y, viewport.y) && near(width, viewport.width) && near(height, viewport.height)
}

const asClipShape = (candidate: Candidate): SvgElement => {
  const keys = GEOMETRY[candidate.element.name] ?? []
  const geometry = Object.fromEntries(
    keys
      .filter((key) => candidate.element.attributes[key] !== undefined)
      .map((key) => [key, candidate.element.attributes[key] as string]),
  )
  const shift =
    candidate.offsetX === 0 && candidate.offsetY === 0
      ? {}
      : { transform: `translate(${candidate.offsetX} ${candidate.offsetY})` }
  return element(candidate.element.name, { ...geometry, ...shift })
}

export interface DetectedShape {
  readonly reference: string
  readonly definition: SvgElement | null
  readonly covers: boolean
}

export const detectShape = (
  root: SvgElement,
  content: readonly SvgNode[],
  viewport: Viewport,
  clipId: string,
): DetectedShape | null => {
  const rootClip = root.attributes['clip-path']
  if (rootClip !== undefined && rootClip.startsWith('url(')) {
    return { reference: rootClip, definition: null, covers: true }
  }

  const candidates = collect(content, 0, 0, true)
  const backdrop = candidates.find((candidate) => coversViewport(candidate, viewport))
  const only =
    candidates.length === 1 && candidates[0] !== undefined && GEOMETRY[candidates[0].element.name] !== undefined
      ? candidates[0]
      : undefined
  const chosen = backdrop ?? only
  if (chosen === undefined || !chosen.translatable) return null

  return {
    reference: `url(#${clipId})`,
    definition: element('clipPath', { id: clipId, clipPathUnits: 'userSpaceOnUse' }, [asClipShape(chosen)]),
    covers: backdrop !== undefined,
  }
}
