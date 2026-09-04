import { element, ensureNamespace, readViewport, splitContent, withAttributes, withChildren } from './document.ts'
import { isEffect } from './effect.ts'
import { invalidEffect } from './errors.ts'
import { SOURCE_GRAPHIC } from './filter.ts'
import { group } from './layers.ts'
import { createRandom } from './random.ts'
import type {
  AttributeInput,
  Effect,
  EffectContext,
  EffectStage,
  FilterRegion,
  FilterStage,
  LayerStage,
  ResolvedSettings,
  SvgDocument,
  SvgElement,
  SvgNode,
  Viewport,
} from './types.ts'

interface StageEntry {
  readonly stage: EffectStage
  readonly index: number
}

interface RenderState {
  readonly content: SvgElement
  readonly defs: readonly SvgElement[]
  readonly styles: readonly string[]
}

interface FilterState {
  readonly output: string
  readonly primitives: readonly SvgElement[]
  readonly defs: readonly SvgElement[]
  readonly styles: readonly string[]
}

const createContext = (
  viewport: Viewport,
  settings: ResolvedSettings,
  index: number,
  root: SvgElement,
  artwork: readonly SvgNode[],
): EffectContext => {
  const random = createRandom(settings.seed, index)
  return {
    viewport,
    root,
    artwork,
    settings,
    motion: settings.animate,
    uid: (hint) => `${settings.prefix}-${settings.scope}-${hint}-${index}`,
    sharedId: (hint) => `${settings.prefix}-${settings.scope}-${hint}`,
    random,
    range: (minimum, maximum, key) => minimum + (maximum - minimum) * random(key),
  }
}

const groupRuns = (entries: readonly StageEntry[]): readonly (readonly StageEntry[])[] =>
  entries.reduce<readonly (readonly StageEntry[])[]>((runs, entry) => {
    const last = runs.at(-1)
    const mergeable = last !== undefined && entry.stage.kind === 'filter' && last[0]?.stage.kind === 'filter'
    return mergeable ? [...runs.slice(0, -1), [...(last as readonly StageEntry[]), entry]] : [...runs, [entry]]
  }, [])

const regionAttributes = (region: FilterRegion, margin: number, viewport: Viewport): AttributeInput =>
  region === 'viewport'
    ? {
        filterUnits: 'userSpaceOnUse',
        x: viewport.x - (viewport.width * margin) / 100,
        y: viewport.y - (viewport.height * margin) / 100,
        width: viewport.width * (1 + (2 * margin) / 100),
        height: viewport.height * (1 + (2 * margin) / 100),
      }
    : margin > 0
      ? { x: `${-margin}%`, y: `${-margin}%`, width: `${100 + 2 * margin}%`, height: `${100 + 2 * margin}%` }
      : {}

const wireFilterRun = (
  run: readonly StageEntry[],
  viewport: Viewport,
  settings: ResolvedSettings,
  root: SvgElement,
  artwork: readonly SvgNode[],
): FilterState =>
  run.reduce<FilterState>(
    (current, entry, position) => {
      const io = {
        input: current.output,
        output:
          position === run.length - 1
            ? `${settings.prefix}-out-${entry.index}`
            : `${settings.prefix}-pass-${entry.index}`,
      }
      const build = (entry.stage as FilterStage).build(
        io,
        createContext(viewport, settings, entry.index, root, artwork),
      )
      return {
        output: io.output,
        primitives: [...current.primitives, ...build.primitives],
        defs: [...current.defs, ...(build.defs ?? [])],
        styles: [...current.styles, ...(build.styles ?? [])],
      }
    },
    { output: SOURCE_GRAPHIC, primitives: [], defs: [], styles: [] },
  )

const applyFilterRun = (
  run: readonly StageEntry[],
  state: RenderState,
  viewport: Viewport,
  settings: ResolvedSettings,
  root: SvgElement,
  artwork: readonly SvgNode[],
): RenderState => {
  const wired = wireFilterRun(run, viewport, settings, root, artwork)
  const filterId = `${settings.prefix}-${settings.scope}-filter-${run[0]?.index ?? 0}`
  const region: FilterRegion = run.some((entry) => (entry.stage as FilterStage).region === 'viewport')
    ? 'viewport'
    : 'bounds'
  const margin = Math.max(0, ...run.map((entry) => (entry.stage as FilterStage).margin ?? 0))
  const filter = element(
    'filter',
    { id: filterId, 'color-interpolation-filters': 'sRGB', ...regionAttributes(region, margin, viewport) },
    wired.primitives,
  )
  const isPlainGroup = state.content.name === 'g' && Object.keys(state.content.attributes).length === 0
  return {
    content: isPlainGroup
      ? withAttributes(state.content, { filter: `url(#${filterId})` })
      : group([state.content], { filter: `url(#${filterId})` }),
    defs: [...state.defs, ...wired.defs, filter],
    styles: [...state.styles, ...wired.styles],
  }
}

const applyLayerStage = (
  entry: StageEntry,
  state: RenderState,
  viewport: Viewport,
  settings: ResolvedSettings,
  root: SvgElement,
  artwork: readonly SvgNode[],
): RenderState => {
  const build = (entry.stage as LayerStage).build(
    state.content,
    createContext(viewport, settings, entry.index, root, artwork),
  )
  return {
    content: build.content,
    defs: [...state.defs, ...(build.defs ?? [])],
    styles: [...state.styles, ...(build.styles ?? [])],
  }
}

const styleNodes = (styles: readonly string[]): readonly SvgElement[] =>
  styles.length === 0
    ? []
    : [element('style', {}, [{ type: 'raw', value: `<![CDATA[${styles.join('')}]]>` }])]

const unique = (defs: readonly SvgElement[]): readonly SvgElement[] =>
  defs.filter((node, index) => {
    const id = node.attributes.id
    return id === undefined || defs.findIndex((other) => other.attributes.id === id) === index
  })

const defsNodes = (defs: readonly SvgElement[]): readonly SvgElement[] =>
  defs.length === 0 ? [] : [element('defs', {}, unique(defs))]

export const render = (
  document: SvgDocument,
  effects: readonly Effect[],
  settings: ResolvedSettings,
): SvgDocument => {
  effects.forEach((effect, index) => {
    if (!isEffect(effect)) throw invalidEffect(index)
  })

  const root = ensureNamespace(document.root)
  const entries = effects.flatMap((effect) => effect.stages).map((stage, index) => ({ stage, index }))
  if (entries.length === 0) return { ...document, root }

  const viewport = readViewport(root)
  const { fixed, renderable } = splitContent(root)
  const result = groupRuns(entries).reduce<RenderState>(
    (state, run) =>
      run[0]?.stage.kind === 'filter'
        ? applyFilterRun(run, state, viewport, settings, root, renderable)
        : applyLayerStage(run[0] as StageEntry, state, viewport, settings, root, renderable),
    { content: group(renderable), defs: [], styles: [] },
  )

  return {
    ...document,
    root: withChildren(root, [...fixed, ...defsNodes(result.defs), ...styleNodes(result.styles), result.content]),
  }
}
