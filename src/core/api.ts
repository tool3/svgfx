import { parse } from './parse.ts'
import { shortHash } from './random.ts'
import { render } from './engine.ts'
import { serialize } from './serialize.ts'
import type { Effect, Pipeline, ResolvedSettings, SvgfxSettings } from './types.ts'

const DEFAULT_PREFIX = 'svgfx'

const sanitizePrefix = (prefix: string): string => {
  const cleaned = prefix.replace(/[^A-Za-z0-9_-]/g, '')
  return /^[A-Za-z]/.test(cleaned) ? cleaned : `${DEFAULT_PREFIX}${cleaned}`
}

export const resolveSettings = (settings: SvgfxSettings = {}): ResolvedSettings => ({
  seed: String(settings.seed ?? DEFAULT_PREFIX),
  prefix: sanitizePrefix(settings.prefix ?? DEFAULT_PREFIX),
  scope: settings.scope === undefined ? '' : sanitizePrefix(settings.scope),
  clip: settings.clip ?? 'shape',
  animate: settings.animate ?? true,
  format: settings.format ?? 'preserve',
})

const signature = (source: string, effects: readonly Effect[], settings: ResolvedSettings): string =>
  shortHash(`${settings.seed}|${effects.map((effect) => effect.name).join()}|${source}`)

const scoped = (source: string, effects: readonly Effect[], settings: ResolvedSettings): ResolvedSettings =>
  settings.scope.length > 0 ? settings : { ...settings, scope: signature(source, effects, settings) }

const run = (source: string, effects: readonly Effect[], settings: ResolvedSettings): string => {
  const resolved = scoped(source, effects, settings)
  return serialize(render(parse(source), effects, resolved), resolved.format)
}

export const svgfx = (
  source: string,
  effects: readonly Effect[] = [],
  settings: SvgfxSettings = {},
): string => run(source, effects, resolveSettings(settings))

export const createPipeline = (
  effects: readonly Effect[],
  settings: SvgfxSettings = {},
): Pipeline => {
  const resolved = resolveSettings(settings)
  return {
    effects,
    settings: resolved,
    apply: (source: string) => run(source, effects, resolved),
  }
}
