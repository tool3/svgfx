import { element } from './document.ts'
import type { SvgElement } from './types.ts'

export const seconds = (value: number | string | undefined, fallback: number): string =>
  typeof value === 'string' ? value : `${Number(((value ?? fallback) as number).toFixed(3))}s`

export interface AnimateSpec {
  readonly attributeName: string
  readonly values: string
  readonly dur: string
  readonly calcMode?: 'linear' | 'discrete' | 'paced' | 'spline'
  readonly keyTimes?: string
  readonly repeatCount?: string | number
}

export const animate = (spec: AnimateSpec): SvgElement =>
  element('animate', {
    attributeName: spec.attributeName,
    values: spec.values,
    dur: spec.dur,
    calcMode: spec.calcMode,
    keyTimes: spec.keyTimes,
    repeatCount: spec.repeatCount ?? 'indefinite',
  })

export const keyframes = (name: string, frames: readonly (readonly [string, string])[]): string =>
  `@keyframes ${name}{${frames.map(([offset, declaration]) => `${offset}{${declaration}}`).join('')}}`

export const rule = (selector: string, declarations: string): string => `${selector}{${declarations}}`

export const animationDeclaration = (name: string, duration: string, timing = 'linear'): string =>
  `animation:${name} ${duration} ${timing} infinite`
