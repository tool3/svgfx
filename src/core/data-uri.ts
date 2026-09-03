const URI_REPLACEMENTS: readonly (readonly [RegExp, string])[] = [
  [/"/g, "'"],
  [/%/g, '%25'],
  [/#/g, '%23'],
  [/</g, '%3C'],
  [/>/g, '%3E'],
  [/\{/g, '%7B'],
  [/\}/g, '%7D'],
  [/\s+/g, ' '],
]

const encodeUri = (svg: string): string =>
  URI_REPLACEMENTS.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), svg.trim())

const encodeBase64 = (svg: string): string => {
  const bytes = new TextEncoder().encode(svg)
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return globalThis.btoa(binary)
}

export interface DataUriOptions {
  readonly base64?: boolean
}

export const toDataUri = (svg: string, options: DataUriOptions = {}): string =>
  options.base64 === true
    ? `data:image/svg+xml;base64,${encodeBase64(svg)}`
    : `data:image/svg+xml,${encodeUri(svg)}`
