export type SvgfxErrorCode = 'INVALID_SOURCE' | 'NOT_AN_SVG' | 'MALFORMED_MARKUP' | 'INVALID_EFFECT'

export class SvgfxError extends Error {
  readonly code: SvgfxErrorCode

  constructor(code: SvgfxErrorCode, message: string) {
    super(message)
    this.name = 'SvgfxError'
    this.code = code
  }
}

export const invalidSource = (received: string): SvgfxError =>
  new SvgfxError('INVALID_SOURCE', `Expected an SVG string, received ${received}.`)

export const notAnSvg = (rootName: string | null): SvgfxError =>
  new SvgfxError(
    'NOT_AN_SVG',
    rootName === null
      ? 'No root element found. The source must contain an <svg> element.'
      : `Expected <svg> as the root element, found <${rootName}>.`,
  )

export const malformedMarkup = (detail: string): SvgfxError =>
  new SvgfxError('MALFORMED_MARKUP', `Could not parse the SVG: ${detail}.`)

export const invalidEffect = (position: number): SvgfxError =>
  new SvgfxError('INVALID_EFFECT', `Effect at index ${position} is not a valid effect.`)
