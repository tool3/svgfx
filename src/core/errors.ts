export type StouchErrorCode = 'INVALID_SOURCE' | 'NOT_AN_SVG' | 'MALFORMED_MARKUP' | 'INVALID_EFFECT'

export class StouchError extends Error {
  readonly code: StouchErrorCode

  constructor(code: StouchErrorCode, message: string) {
    super(message)
    this.name = 'StouchError'
    this.code = code
  }
}

export const invalidSource = (received: string): StouchError =>
  new StouchError('INVALID_SOURCE', `Expected an SVG string, received ${received}.`)

export const notAnSvg = (rootName: string | null): StouchError =>
  new StouchError(
    'NOT_AN_SVG',
    rootName === null
      ? 'No root element found. The source must contain an <svg> element.'
      : `Expected <svg> as the root element, found <${rootName}>.`,
  )

export const malformedMarkup = (detail: string): StouchError =>
  new StouchError('MALFORMED_MARKUP', `Could not parse the SVG: ${detail}.`)

export const invalidEffect = (position: number): StouchError =>
  new StouchError('INVALID_EFFECT', `Effect at index ${position} is not a valid effect.`)
