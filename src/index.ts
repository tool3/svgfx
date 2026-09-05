export { svgfx, createPipeline, resolveSettings } from './core/api.ts'
export { toDataUri } from './core/data-uri.ts'
export type { DataUriOptions } from './core/data-uri.ts'
export { SvgfxError } from './core/errors.ts'
export type { SvgfxErrorCode } from './core/errors.ts'
export { parse } from './core/parse.ts'
export { serialize } from './core/serialize.ts'
export { compose, defineEffect, filterStage, layerStage, isEffect } from './core/effect.ts'
export type { FilterStageOptions } from './core/effect.ts'
export { element, readViewport, withAttributes, withChildren } from './core/document.ts'
export {
  LUMINANCE_MATRIX,
  RGBA_CHANNELS,
  RGB_CHANNELS,
  SOURCE_ALPHA,
  SOURCE_GRAPHIC,
  clipTo,
  colorMatrix,
  componentTransfer,
  merge,
  primitive,
  series,
  transfer,
} from './core/filter.ts'
export type { PrimitiveSpec } from './core/filter.ts'
export {
  clipPath,
  cover,
  expanded,
  filtered,
  group,
  linearGradient,
  mask,
  pattern,
  radialGradient,
  rect,
  stop,
  use,
} from './core/layers.ts'
export { animate, animationDeclaration, keyframes, rule, seconds } from './core/animation.ts'
export type { AnimateSpec } from './core/animation.ts'
export { clipAttributes, clipped, silhouette } from './core/silhouette.ts'
export type { ClipMode, ShapeClip } from './core/silhouette.ts'
export { detectShape } from './core/shape.ts'
export type { DetectedShape } from './core/shape.ts'
export { parseColor } from './core/color.ts'
export type { Rgb } from './core/color.ts'

export type {
  AttributeInput,
  AttributeValue,
  Effect,
  EffectContext,
  EffectStage,
  FilterBuild,
  FilterIO,
  FilterRegion,
  FilterStage,
  LayerBuild,
  LayerStage,
  OutputFormat,
  Pipeline,
  ResolvedSettings,
  SvgfxSettings,
  SvgAttributes,
  SvgComment,
  SvgDocument,
  SvgElement,
  SvgNode,
  SvgRaw,
  SvgText,
  Viewport,
} from './core/types.ts'

export { blur } from './effects/blur.ts'
export type { BlurAxis, BlurOptions } from './effects/blur.ts'
export { bloom } from './effects/bloom.ts'
export type { BloomOptions } from './effects/bloom.ts'
export { glow } from './effects/glow.ts'
export type { GlowOptions } from './effects/glow.ts'
export { shadow } from './effects/shadow.ts'
export type { ShadowOptions } from './effects/shadow.ts'
export {
  brightness,
  contrast,
  duotone,
  fade,
  grayscale,
  hueRotate,
  invert,
  posterize,
  saturate,
  sepia,
  threshold,
  tint,
} from './effects/color.ts'
export type {
  AmountOptions,
  DuotoneOptions,
  HueRotateOptions,
  PosterizeOptions,
  ThresholdOptions,
  TintOptions,
} from './effects/color.ts'
export { grain } from './effects/grain.ts'
export type { GrainBlend, GrainOptions } from './effects/grain.ts'
export { scanlines } from './effects/scanlines.ts'
export type { ScanlineBlend, ScanlinesOptions } from './effects/scanlines.ts'
export { chromaticAberration } from './effects/chromatic.ts'
export type { ChromaticAberrationOptions } from './effects/chromatic.ts'
export { glitch } from './effects/glitch.ts'
export type { GlitchOptions } from './effects/glitch.ts'
export { pixelate } from './effects/pixelate.ts'
export type { PixelateOptions } from './effects/pixelate.ts'
export { halftone } from './effects/halftone.ts'
export type { HalftoneOptions } from './effects/halftone.ts'
export { vignette } from './effects/vignette.ts'
export type { VignetteOptions } from './effects/vignette.ts'
export { outline } from './effects/outline.ts'
export type { OutlineOptions, OutlinePosition } from './effects/outline.ts'
export { wave } from './effects/wave.ts'
export type { WaveOptions } from './effects/wave.ts'
export { emboss, sharpen } from './effects/relief.ts'
export type { EmbossOptions, SharpenOptions } from './effects/relief.ts'

export { crt, cyberpunk, film, neon, newsprint, riso, vhs, xerox } from './presets/index.ts'
export {
  CRT_DEFAULTS,
  CYBERPUNK_DEFAULTS,
  FILM_DEFAULTS,
  NEON_DEFAULTS,
  NEWSPRINT_DEFAULTS,
  RISO_DEFAULTS,
  VHS_DEFAULTS,
  XEROX_DEFAULTS,
} from './presets/index.ts'
export type {
  CrtOptions,
  CyberpunkOptions,
  FilmOptions,
  MotionOptions,
  NeonOptions,
  NewsprintOptions,
  RisoOptions,
  VhsOptions,
  XeroxOptions,
} from './presets/index.ts'
