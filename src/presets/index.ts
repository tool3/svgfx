import { compose } from '../core/effect.ts'
import { bloom } from '../effects/bloom.ts'
import { chromaticAberration } from '../effects/chromatic.ts'
import { contrast, duotone, posterize, saturate, threshold } from '../effects/color.ts'
import { glitch } from '../effects/glitch.ts'
import { glow } from '../effects/glow.ts'
import { grain } from '../effects/grain.ts'
import { halftone } from '../effects/halftone.ts'
import { scanlines } from '../effects/scanlines.ts'
import { vignette } from '../effects/vignette.ts'
import { wave } from '../effects/wave.ts'
import type { Effect } from '../core/types.ts'

export interface MotionOptions {
  readonly animate?: boolean
}

export const crt = ({ animate = false }: MotionOptions = {}): Effect =>
  compose('crt', [
    chromaticAberration({ offset: 1.2 }),
    bloom({ radius: 5, threshold: 0.5, intensity: 1.2 }),
    scanlines({ gap: 3, thickness: 1.1, opacity: 0.35, animate, speed: 4 }),
    vignette({ amount: 0.55, radius: 0.55 }),
  ])

export const vhs = ({ animate = false }: MotionOptions = {}): Effect =>
  compose('vhs', [
    chromaticAberration({ offset: 3 }),
    wave({ amplitude: 2.5, frequency: 0.012, octaves: 1, animate, speed: 0.35 }),
    grain({ amount: 0.28, size: 1.1, animate, speed: 14 }),
    scanlines({ gap: 5, thickness: 2.2, opacity: 0.16, animate, speed: 2 }),
    vignette({ amount: 0.5, radius: 0.5 }),
  ])

export interface RisoOptions {
  readonly shadow?: string
  readonly highlight?: string
}

export const riso = ({ shadow = '#2b3a67', highlight = '#ff5a5f' }: RisoOptions = {}): Effect =>
  compose('riso', [
    duotone({ shadow, highlight }),
    posterize({ steps: 4 }),
    grain({ amount: 0.42, size: 1.4, blend: 'multiply' }),
  ])

export const xerox = (): Effect =>
  compose('xerox', [
    threshold({ level: 0.56, dark: '#101010', light: '#f6f4ef' }),
    grain({ amount: 0.5, size: 1.6, blend: 'multiply' }),
  ])

export interface NeonOptions {
  readonly color?: string
}

export const neon = ({ color = '#4cc9f0' }: NeonOptions = {}): Effect =>
  compose('neon', [
    saturate({ amount: 1.6 }),
    glow({ color, radius: 9, intensity: 1.4 }),
    bloom({ radius: 12, threshold: 0.35, intensity: 1.3 }),
  ])

export const film = (): Effect =>
  compose('film', [
    contrast({ amount: 1.12 }),
    bloom({ radius: 6, threshold: 0.68 }),
    grain({ amount: 0.26, size: 0.9 }),
    vignette({ amount: 0.5, radius: 0.62 }),
  ])

export const newsprint = (): Effect =>
  compose('newsprint', [
    halftone({ size: 5, levels: 4, color: '#1c1c1c', background: '#f2ede2' }),
    grain({ amount: 0.3, size: 1.5, blend: 'multiply' }),
  ])

export const cyberpunk = ({ animate = false }: MotionOptions = {}): Effect =>
  compose('cyberpunk', [
    saturate({ amount: 1.35 }),
    glitch({ intensity: 0.6, slices: 9, animate, colorShift: true }),
    bloom({ radius: 8, threshold: 0.45, intensity: 1.25 }),
    scanlines({ gap: 4, thickness: 1.4, opacity: 0.22, animate, speed: 5 }),
  ])
