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
import type { BloomOptions } from '../effects/bloom.ts'
import type { ChromaticAberrationOptions } from '../effects/chromatic.ts'
import type {
  AmountOptions,
  DuotoneOptions,
  PosterizeOptions,
  ThresholdOptions,
} from '../effects/color.ts'
import type { GlitchOptions } from '../effects/glitch.ts'
import type { GlowOptions } from '../effects/glow.ts'
import type { GrainOptions } from '../effects/grain.ts'
import type { HalftoneOptions } from '../effects/halftone.ts'
import type { ScanlinesOptions } from '../effects/scanlines.ts'
import type { VignetteOptions } from '../effects/vignette.ts'
import type { WaveOptions } from '../effects/wave.ts'
import type { Effect } from '../core/types.ts'

export interface MotionOptions {
  readonly animate?: boolean
}

export interface CrtOptions extends MotionOptions {
  readonly chromaticAberration?: ChromaticAberrationOptions
  readonly bloom?: BloomOptions
  readonly scanlines?: ScanlinesOptions
  readonly vignette?: VignetteOptions
}

export const CRT_DEFAULTS = {
  chromaticAberration: { offset: 1.2 },
  bloom: { radius: 5, threshold: 0.5, intensity: 1.2 },
  scanlines: { gap: 3, thickness: 1.1, opacity: 0.35, speed: 4 },
  vignette: { amount: 0.55, radius: 0.55 },
} as const satisfies Omit<CrtOptions, 'animate'>

export const crt = (options: CrtOptions = {}): Effect =>
  compose('crt', [
    chromaticAberration({ ...CRT_DEFAULTS.chromaticAberration, ...options.chromaticAberration }),
    bloom({ ...CRT_DEFAULTS.bloom, ...options.bloom }),
    scanlines({ ...CRT_DEFAULTS.scanlines, animate: options.animate, ...options.scanlines }),
    vignette({ ...CRT_DEFAULTS.vignette, ...options.vignette }),
  ])

export interface VhsOptions extends MotionOptions {
  readonly chromaticAberration?: ChromaticAberrationOptions
  readonly wave?: WaveOptions
  readonly grain?: GrainOptions
  readonly scanlines?: ScanlinesOptions
  readonly vignette?: VignetteOptions
}

export const VHS_DEFAULTS = {
  chromaticAberration: { offset: 3 },
  wave: { amplitude: 2.5, frequency: 0.012, octaves: 1, speed: 0.35 },
  grain: { amount: 0.28, size: 1.1, speed: 14 },
  scanlines: { gap: 5, thickness: 2.2, opacity: 0.16, speed: 2 },
  vignette: { amount: 0.5, radius: 0.5 },
} as const satisfies Omit<VhsOptions, 'animate'>

export const vhs = (options: VhsOptions = {}): Effect =>
  compose('vhs', [
    chromaticAberration({ ...VHS_DEFAULTS.chromaticAberration, ...options.chromaticAberration }),
    wave({ ...VHS_DEFAULTS.wave, animate: options.animate, ...options.wave }),
    grain({ ...VHS_DEFAULTS.grain, animate: options.animate, ...options.grain }),
    scanlines({ ...VHS_DEFAULTS.scanlines, animate: options.animate, ...options.scanlines }),
    vignette({ ...VHS_DEFAULTS.vignette, ...options.vignette }),
  ])

export interface RisoOptions {
  readonly shadow?: string
  readonly highlight?: string
  readonly duotone?: DuotoneOptions
  readonly posterize?: PosterizeOptions
  readonly grain?: GrainOptions
}

export const RISO_DEFAULTS = {
  duotone: { shadow: '#2b3a67', highlight: '#ff5a5f' },
  posterize: { steps: 4 },
  grain: { amount: 0.4, size: 1.4 },
} as const satisfies Omit<RisoOptions, 'shadow' | 'highlight'>

export const riso = (options: RisoOptions = {}): Effect =>
  compose('riso', [
    duotone({
      ...RISO_DEFAULTS.duotone,
      ...(options.shadow === undefined ? {} : { shadow: options.shadow }),
      ...(options.highlight === undefined ? {} : { highlight: options.highlight }),
      ...options.duotone,
    }),
    posterize({ ...RISO_DEFAULTS.posterize, ...options.posterize }),
    grain({ ...RISO_DEFAULTS.grain, ...options.grain }),
  ])

export interface XeroxOptions {
  readonly threshold?: ThresholdOptions
  readonly grain?: GrainOptions
}

export const XEROX_DEFAULTS = {
  threshold: { level: 0.56, dark: '#101010', light: '#f6f4ef' },
  grain: { amount: 0.44, size: 1.7 },
} as const satisfies XeroxOptions

export const xerox = (options: XeroxOptions = {}): Effect =>
  compose('xerox', [
    threshold({ ...XEROX_DEFAULTS.threshold, ...options.threshold }),
    grain({ ...XEROX_DEFAULTS.grain, ...options.grain }),
  ])

export interface NeonOptions {
  readonly color?: string
  readonly saturate?: AmountOptions
  readonly glow?: GlowOptions
  readonly bloom?: BloomOptions
}

export const NEON_DEFAULTS = {
  saturate: { amount: 1.6 },
  glow: { color: '#4cc9f0', radius: 9, intensity: 1.4 },
  bloom: { radius: 12, threshold: 0.35, intensity: 1.3 },
} as const satisfies Omit<NeonOptions, 'color'>

export const neon = (options: NeonOptions = {}): Effect =>
  compose('neon', [
    saturate({ ...NEON_DEFAULTS.saturate, ...options.saturate }),
    glow({
      ...NEON_DEFAULTS.glow,
      ...(options.color === undefined ? {} : { color: options.color }),
      ...options.glow,
    }),
    bloom({ ...NEON_DEFAULTS.bloom, ...options.bloom }),
  ])

export interface FilmOptions {
  readonly contrast?: AmountOptions
  readonly bloom?: BloomOptions
  readonly grain?: GrainOptions
  readonly vignette?: VignetteOptions
}

export const FILM_DEFAULTS = {
  contrast: { amount: 1.12 },
  bloom: { radius: 6, threshold: 0.68 },
  grain: { amount: 0.26, size: 0.9 },
  vignette: { amount: 0.5, radius: 0.62 },
} as const satisfies FilmOptions

export const film = (options: FilmOptions = {}): Effect =>
  compose('film', [
    contrast({ ...FILM_DEFAULTS.contrast, ...options.contrast }),
    bloom({ ...FILM_DEFAULTS.bloom, ...options.bloom }),
    grain({ ...FILM_DEFAULTS.grain, ...options.grain }),
    vignette({ ...FILM_DEFAULTS.vignette, ...options.vignette }),
  ])

export interface NewsprintOptions {
  readonly halftone?: HalftoneOptions
  readonly grain?: GrainOptions
}

export const NEWSPRINT_DEFAULTS = {
  halftone: { size: 5, levels: 4, color: '#1c1c1c', background: '#f2ede2' },
  grain: { amount: 0.28, size: 1.5 },
} as const satisfies NewsprintOptions

export const newsprint = (options: NewsprintOptions = {}): Effect =>
  compose('newsprint', [
    halftone({ ...NEWSPRINT_DEFAULTS.halftone, ...options.halftone }),
    grain({ ...NEWSPRINT_DEFAULTS.grain, ...options.grain }),
  ])

export interface CyberpunkOptions extends MotionOptions {
  readonly saturate?: AmountOptions
  readonly glitch?: GlitchOptions
  readonly bloom?: BloomOptions
  readonly scanlines?: ScanlinesOptions
}

export const CYBERPUNK_DEFAULTS = {
  saturate: { amount: 1.35 },
  glitch: { intensity: 0.6, slices: 9, colorShift: true },
  bloom: { radius: 8, threshold: 0.45, intensity: 1.25 },
  scanlines: { gap: 4, thickness: 1.4, opacity: 0.22, speed: 5 },
} as const satisfies Omit<CyberpunkOptions, 'animate'>

export const cyberpunk = (options: CyberpunkOptions = {}): Effect =>
  compose('cyberpunk', [
    saturate({ ...CYBERPUNK_DEFAULTS.saturate, ...options.saturate }),
    glitch({ ...CYBERPUNK_DEFAULTS.glitch, animate: options.animate, ...options.glitch }),
    bloom({ ...CYBERPUNK_DEFAULTS.bloom, ...options.bloom }),
    scanlines({ ...CYBERPUNK_DEFAULTS.scanlines, animate: options.animate, ...options.scanlines }),
  ])
