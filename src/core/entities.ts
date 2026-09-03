const NAMED_ENTITIES: Readonly<Record<string, string>> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
}

const ENTITY_PATTERN = /&(?:#x([0-9a-fA-F]+)|#(\d+)|([a-zA-Z][a-zA-Z0-9]*));/g

const LOOSE_AMPERSAND = /&(?![a-zA-Z][a-zA-Z0-9]*;|#\d+;|#x[0-9a-fA-F]+;)/g

const fromCodePoint = (codePoint: number, fallback: string): string =>
  Number.isFinite(codePoint) && codePoint >= 0 && codePoint <= 0x10ffff
    ? String.fromCodePoint(codePoint)
    : fallback

export const decodeEntities = (value: string): string =>
  value.replace(ENTITY_PATTERN, (match, hex?: string, decimal?: string, name?: string) =>
    hex !== undefined
      ? fromCodePoint(Number.parseInt(hex, 16), match)
      : decimal !== undefined
        ? fromCodePoint(Number.parseInt(decimal, 10), match)
        : (NAMED_ENTITIES[name ?? ''] ?? match),
  )

const escapeShared = (value: string): string =>
  value.replace(LOOSE_AMPERSAND, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export const escapeText = (value: string): string => escapeShared(value)

export const escapeAttribute = (value: string): string =>
  escapeShared(value).replace(/"/g, '&quot;').replace(/\n/g, '&#10;')
