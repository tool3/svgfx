import type { Effect, EffectStage, FilterBuild, FilterIO, FilterRegion, LayerBuild, EffectContext, SvgElement } from './types.ts'

export const defineEffect = (name: string, stages: readonly EffectStage[]): Effect => ({ name, stages })

export interface FilterStageOptions {
  readonly margin?: number
  readonly region?: FilterRegion
}

export const filterStage = (
  build: (io: FilterIO, context: EffectContext) => FilterBuild,
  options: FilterStageOptions = {},
): EffectStage => ({ kind: 'filter', build, ...options })

export const layerStage = (
  build: (content: SvgElement, context: EffectContext) => LayerBuild,
): EffectStage => ({ kind: 'layer', build })

export const compose = (name: string, effects: readonly Effect[]): Effect =>
  defineEffect(
    name,
    effects.flatMap((effect) => effect.stages),
  )

export const isEffect = (value: unknown): value is Effect =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as Effect).name === 'string' &&
  Array.isArray((value as Effect).stages)
