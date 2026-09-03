import { animationDeclaration, keyframes } from '../core/animation.ts'
import { withAttributes } from '../core/document.ts'
import { defineEffect, layerStage } from '../core/effect.ts'
import { clipPath, group, rect, use } from '../core/layers.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import type { Effect, EffectContext, SvgElement } from '../core/types.ts'
import { chromaticAberration } from './chromatic.ts'

export interface GlitchOptions {
  readonly intensity?: number
  readonly slices?: number
  readonly colorShift?: boolean
  readonly animate?: boolean
  readonly speed?: number
}

interface Band {
  readonly index: number
  readonly y: number
  readonly height: number
  readonly shift: number
}

const activeBands = (context: EffectContext, count: number, intensity: number): readonly Band[] => {
  const height = context.viewport.height / count
  const reach = context.viewport.width * 0.12 * intensity
  return Array.from({ length: count }, (_, index) => ({
    index,
    y: context.viewport.y + index * height,
    height,
    shift: context.range(-reach, reach, `shift${index}`),
  })).filter((band) => context.random(`active${band.index}`) < 0.3 + 0.45 * intensity)
}

const bandKeyframes = (context: EffectContext, band: Band, name: string): string => {
  const start = Math.round(context.range(0, 70, `phase${band.index}`))
  const width = Math.round(context.range(4, 12, `width${band.index}`))
  return keyframes(name, [
    [`0%,${start}%`, 'transform:translate(0,0)'],
    [`${start + 1}%,${start + width}%`, `transform:translate(${formatNumber(band.shift)}px,0)`],
    [`${start + width + 1}%,100%`, 'transform:translate(0,0)'],
  ])
}

const bandLayer = (
  context: EffectContext,
  band: Band,
  sourceId: string,
  motion: boolean,
  speed: number,
): { readonly node: SvgElement; readonly clip: SvgElement; readonly style: string | null } => {
  const clipId = context.uid(`glitch-clip${band.index}`)
  const animationName = context.uid(`glitch-band${band.index}`)
  const duration = formatNumber((2.4 / Math.max(speed, 0.05)) * context.range(0.7, 1.5, `pace${band.index}`))
  return {
    clip: clipPath(clipId, [
      rect({ x: context.viewport.x, y: band.y, width: context.viewport.width, height: band.height }),
    ]),
    node: group([use(sourceId)], {
      'clip-path': `url(#${clipId})`,
      transform: motion ? undefined : `translate(${formatNumber(band.shift)} 0)`,
      style: motion ? animationDeclaration(animationName, `${duration}s`, 'steps(1, end)') : undefined,
    }),
    style: motion ? bandKeyframes(context, band, animationName) : null,
  }
}

export const glitch = ({
  intensity = 0.5,
  slices = 7,
  colorShift = true,
  animate: animated = false,
  speed = 1,
}: GlitchOptions = {}): Effect => {
  const strength = clamp(intensity, 0, 2)
  const slicing = layerStage((content, context) => {
    const sourceId = context.uid('glitch-source')
    const motion = animated && context.motion
    const bands = activeBands(context, Math.max(Math.round(slices), 1), strength).map((band) =>
      bandLayer(context, band, sourceId, motion, speed),
    )
    return {
      defs: bands.map((band) => band.clip),
      styles: bands.flatMap((band) => (band.style === null ? [] : [band.style])),
      content: group([
        withAttributes(content, { id: sourceId }),
        ...bands.map((band) => band.node),
      ]),
    }
  })

  return defineEffect('glitch', [
    slicing,
    ...(colorShift ? chromaticAberration({ offset: 1 + strength * 2.5 }).stages : []),
  ])
}
