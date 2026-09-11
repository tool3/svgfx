export type PstfxErrorCode = 'INVALID_SOURCE' | 'NOT_AN_SVG' | 'MALFORMED_MARKUP' | 'INVALID_EFFECT'

export class PstfxError extends Error {
  readonly code: PstfxErrorCode

  constructor(code: PstfxErrorCode, message: string) {
    super(message)
    this.name = 'PstfxError'
    this.code = code
  }
}

export const invalidSource = (received: string): PstfxError =>
  new PstfxError('INVALID_SOURCE', `Expected an SVG string, received ${received}.`)

export const notAnSvg = (rootName: string | null): PstfxError =>
  new PstfxError(
    'NOT_AN_SVG',
    rootName === null
      ? 'No root element found. The source must contain an <svg> element.'
      : `Expected <svg> as the root element, found <${rootName}>.`,
  )

export const malformedMarkup = (detail: string): PstfxError =>
  new PstfxError('MALFORMED_MARKUP', `Could not parse the SVG: ${detail}.`)

export const invalidEffect = (position: number): PstfxError =>
  new PstfxError('INVALID_EFFECT', `Effect at index ${position} is not a valid effect.`)
