import { escapeAttribute, escapeText } from './entities.ts'
import type { OutputFormat, SvgAttributes, SvgDocument, SvgElement, SvgNode } from './types.ts'

const WHITESPACE_SENSITIVE = new Set(['text', 'tspan', 'textPath', 'tref', 'style', 'script', 'title', 'desc'])

const INDENT = '  '

const isWhitespaceText = (node: SvgNode): boolean => node.type === 'text' && node.value.trim().length === 0

const hasMeaningfulText = (children: readonly SvgNode[]): boolean =>
  children.some((child) => child.type === 'text' && child.value.trim().length > 0)

const serializeAttributes = (attributes: SvgAttributes): string =>
  Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${escapeAttribute(value)}"`)
    .join('')

const visibleChildren = (children: readonly SvgNode[], format: OutputFormat): readonly SvgNode[] =>
  format === 'preserve'
    ? children
    : children.filter((child) => !isWhitespaceText(child) && !(format === 'minify' && child.type === 'comment'))

const isBlockLayout = (element: SvgElement, children: readonly SvgNode[], format: OutputFormat): boolean =>
  format === 'pretty' &&
  children.length > 0 &&
  !WHITESPACE_SENSITIVE.has(element.name) &&
  !hasMeaningfulText(children)

const serializeElement = (element: SvgElement, format: OutputFormat, depth: number): string => {
  const open = `<${element.name}${serializeAttributes(element.attributes)}`
  const children = visibleChildren(element.children, format)
  if (children.length === 0) return `${open}/>`

  const inner = isBlockLayout(element, children, format)
    ? `${children.map((child) => `\n${INDENT.repeat(depth + 1)}${serializeNode(child, format, depth + 1)}`).join('')}\n${INDENT.repeat(depth)}`
    : children.map((child) => serializeNode(child, format, depth)).join('')

  return `${open}>${inner}</${element.name}>`
}

export const serializeNode = (node: SvgNode, format: OutputFormat, depth: number): string =>
  node.type === 'element'
    ? serializeElement(node, format, depth)
    : node.type === 'text'
      ? escapeText(node.value)
      : node.type === 'comment'
        ? `<!--${node.value}-->`
        : node.value

export const serialize = (document: SvgDocument, format: OutputFormat = 'preserve'): string => {
  const nodes = [...document.prologue, document.root, ...document.epilogue]
  const visible = visibleChildren(nodes, format)
  const separator = format === 'preserve' ? '' : '\n'
  return visible.map((node) => serializeNode(node, format, 0)).join(separator)
}
