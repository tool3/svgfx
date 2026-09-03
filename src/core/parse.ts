import { decodeEntities } from './entities.ts'
import { invalidSource, malformedMarkup, notAnSvg } from './errors.ts'
import type { SvgAttributes, SvgDocument, SvgElement, SvgNode } from './types.ts'

const TOKEN_PATTERN = new RegExp(
  [
    '(?<comment><!--[\\s\\S]*?-->)',
    '(?<cdata><!\\[CDATA\\[[\\s\\S]*?\\]\\]>)',
    '(?<declaration><[?!][^>]*>)',
    '(?<raw><(?<rawName>style|script)(?<rawAttributes>(?:"[^"]*"|\'[^\']*\'|[^>"\'])*?)>(?<rawBody>[\\s\\S]*?)</\\s*\\k<rawName>\\s*>)',
    '(?<close></\\s*(?<closeName>[^\\s>/]+)\\s*>)',
    '(?<open><(?<openName>[^\\s/>!?]+)(?<openAttributes>(?:"[^"]*"|\'[^\']*\'|[^>"\'])*?)(?<selfClosing>/?)>)',
  ].join('|'),
  'g',
)

const ATTRIBUTE_PATTERN = /([^\s=/>]+)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

type Token =
  | { readonly type: 'open'; readonly name: string; readonly attributes: SvgAttributes; readonly selfClosing: boolean }
  | { readonly type: 'close'; readonly name: string }
  | { readonly type: 'node'; readonly node: SvgNode }

export const parseAttributes = (source: string): SvgAttributes =>
  Object.fromEntries(
    Array.from(source.matchAll(ATTRIBUTE_PATTERN), (match) => [
      match[1] ?? '',
      decodeEntities(match[2] ?? match[3] ?? match[4] ?? ''),
    ]),
  )

const rawElement = (name: string, attributes: string, body: string): SvgElement => ({
  type: 'element',
  name,
  attributes: parseAttributes(attributes),
  children: body.length === 0 ? [] : [{ type: 'raw', value: body }],
})

const toToken = (groups: Readonly<Record<string, string | undefined>>): Token =>
  groups.comment !== undefined
    ? { type: 'node', node: { type: 'comment', value: groups.comment.slice(4, -3) } }
    : groups.cdata !== undefined || groups.declaration !== undefined
      ? { type: 'node', node: { type: 'raw', value: groups.cdata ?? groups.declaration ?? '' } }
      : groups.raw !== undefined
        ? {
            type: 'node',
            node: rawElement(groups.rawName ?? '', groups.rawAttributes ?? '', groups.rawBody ?? ''),
          }
        : groups.close !== undefined
          ? { type: 'close', name: groups.closeName ?? '' }
          : {
              type: 'open',
              name: groups.openName ?? '',
              attributes: parseAttributes(groups.openAttributes ?? ''),
              selfClosing: groups.selfClosing === '/',
            }

const textToken = (value: string): Token => ({ type: 'node', node: { type: 'text', value: decodeEntities(value) } })

const tokenize = (source: string): readonly Token[] => {
  const matches = Array.from(source.matchAll(TOKEN_PATTERN))
  const tokens = matches.flatMap((match, index) => {
    const previous = matches[index - 1]
    const previousEnd = previous === undefined ? 0 : previous.index + (previous[0] ?? '').length
    const gap = source.slice(previousEnd, match.index)
    const token = toToken(match.groups ?? {})
    return gap.length === 0 ? [token] : [textToken(gap), token]
  })
  const last = matches.at(-1)
  const trailing = last === undefined ? source : source.slice(last.index + (last[0] ?? '').length)
  return trailing.length === 0 ? tokens : [...tokens, textToken(trailing)]
}

interface Frame {
  readonly name: string
  readonly attributes: SvgAttributes
  readonly children: SvgNode[]
}

const buildTree = (tokens: readonly Token[]): readonly SvgNode[] => {
  const roots: SvgNode[] = []
  const stack: Frame[] = []
  const target = (): SvgNode[] => stack.at(-1)?.children ?? roots
  const collapse = (depth: number): void => {
    const closed = stack.splice(depth)
    const node = closed.reduceRight<SvgNode | null>(
      (child, frame) => ({
        type: 'element',
        name: frame.name,
        attributes: frame.attributes,
        children: child === null ? frame.children : [...frame.children, child],
      }),
      null,
    )
    if (node !== null) target().push(node)
  }

  tokens.forEach((token) => {
    if (token.type === 'node') target().push(token.node)
    else if (token.type === 'open' && token.selfClosing)
      target().push({ type: 'element', name: token.name, attributes: token.attributes, children: [] })
    else if (token.type === 'open') stack.push({ name: token.name, attributes: token.attributes, children: [] })
    else {
      const openIndex = stack.findLastIndex((frame) => frame.name === token.name)
      if (openIndex !== -1) collapse(openIndex)
    }
  })

  collapse(0)
  return roots
}

const isElement = (node: SvgNode): node is SvgElement => node.type === 'element'

export const parse = (source: string): SvgDocument => {
  if (typeof source !== 'string') throw invalidSource(typeof source)
  if (source.trim().length === 0) throw invalidSource('an empty string')

  const nodes = buildTree(tokenize(source))
  const rootIndex = nodes.findIndex((node) => isElement(node) && node.name === 'svg')

  if (rootIndex === -1) {
    const firstElement = nodes.find(isElement)
    if (firstElement === undefined && source.includes('<svg')) throw malformedMarkup('no complete <svg> tag was found')
    throw notAnSvg(firstElement?.name ?? null)
  }

  return {
    prologue: nodes.slice(0, rootIndex),
    root: nodes[rootIndex] as SvgElement,
    epilogue: nodes.slice(rootIndex + 1),
  }
}
