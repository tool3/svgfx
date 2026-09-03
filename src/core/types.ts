export type SvgNode = SvgElement | SvgText | SvgComment | SvgRaw

export type SvgAttributes = Readonly<Record<string, string>>

export interface SvgElement {
  readonly type: 'element'
  readonly name: string
  readonly attributes: SvgAttributes
  readonly children: readonly SvgNode[]
}

export interface SvgText {
  readonly type: 'text'
  readonly value: string
}

export interface SvgComment {
  readonly type: 'comment'
  readonly value: string
}

export interface SvgRaw {
  readonly type: 'raw'
  readonly value: string
}

export interface SvgDocument {
  readonly prologue: readonly SvgNode[]
  readonly root: SvgElement
  readonly epilogue: readonly SvgNode[]
}

export interface Viewport {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
}

export type AttributeValue = string | number | boolean | null | undefined

export type AttributeInput = Readonly<Record<string, AttributeValue>>

export type OutputFormat = 'preserve' | 'pretty' | 'minify'

export interface StouchSettings {
  readonly seed?: string | number
  readonly prefix?: string
  readonly scope?: string
  readonly animate?: boolean
  readonly format?: OutputFormat
}

export interface ResolvedSettings {
  readonly seed: string
  readonly prefix: string
  readonly scope: string
  readonly animate: boolean
  readonly format: OutputFormat
}

export interface EffectContext {
  readonly viewport: Viewport
  readonly settings: ResolvedSettings
  readonly motion: boolean
  readonly uid: (hint: string) => string
  readonly random: (key: string | number) => number
  readonly range: (minimum: number, maximum: number, key: string | number) => number
}

export interface FilterIO {
  readonly input: string
  readonly output: string
}

export interface StageContribution {
  readonly defs?: readonly SvgElement[]
  readonly styles?: readonly string[]
}

export interface FilterBuild extends StageContribution {
  readonly primitives: readonly SvgElement[]
}

export interface LayerBuild extends StageContribution {
  readonly content: SvgElement
}

export type FilterRegion = 'bounds' | 'viewport'

export interface FilterStage {
  readonly kind: 'filter'
  readonly margin?: number
  readonly region?: FilterRegion
  readonly build: (io: FilterIO, context: EffectContext) => FilterBuild
}

export interface LayerStage {
  readonly kind: 'layer'
  readonly build: (content: SvgElement, context: EffectContext) => LayerBuild
}

export type EffectStage = FilterStage | LayerStage

export interface Effect {
  readonly name: string
  readonly stages: readonly EffectStage[]
}

export interface Pipeline {
  readonly effects: readonly Effect[]
  readonly settings: ResolvedSettings
  readonly apply: (source: string) => string
}
