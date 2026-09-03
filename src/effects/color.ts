import { channels, mixMatrix, parseColor } from '../core/color.ts'
import { defineEffect, filterStage } from '../core/effect.ts'
import {
  LUMINANCE_MATRIX,
  RGBA_CHANNELS,
  RGB_CHANNELS,
  componentTransfer,
  colorMatrix,
  primitive,
  series,
  transfer,
} from '../core/filter.ts'
import { clamp, formatNumber } from '../core/numbers.ts'
import type { Effect, FilterIO, SvgElement } from '../core/types.ts'

const IDENTITY_MATRIX = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]

const SEPIA_MATRIX = [
  0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131, 0, 0, 0, 0, 0, 1, 0,
]

const simpleFilter = (name: string, build: (io: FilterIO) => readonly SvgElement[], margin = 0): Effect =>
  defineEffect(name, [filterStage((io) => ({ primitives: build(io) }), { margin })])

export interface AmountOptions {
  readonly amount?: number
}

export const grayscale = ({ amount = 1 }: AmountOptions = {}): Effect =>
  simpleFilter('grayscale', (io) =>
    series(io, [{ name: 'feColorMatrix', attributes: { type: 'saturate', values: 1 - clamp(amount, 0, 1) } }]),
  )

export const saturate = ({ amount = 1.4 }: AmountOptions = {}): Effect =>
  simpleFilter('saturate', (io) =>
    series(io, [{ name: 'feColorMatrix', attributes: { type: 'saturate', values: Math.max(amount, 0) } }]),
  )

export interface HueRotateOptions {
  readonly angle?: number
}

export const hueRotate = ({ angle = 90 }: HueRotateOptions = {}): Effect =>
  simpleFilter('hueRotate', (io) =>
    series(io, [{ name: 'feColorMatrix', attributes: { type: 'hueRotate', values: angle } }]),
  )

export const invert = ({ amount = 1 }: AmountOptions = {}): Effect =>
  simpleFilter('invert', (io) => {
    const level = clamp(amount, 0, 1)
    return [
      componentTransfer(
        { in: io.input, result: io.output },
        transfer(RGB_CHANNELS, {
          type: 'table',
          tableValues: `${formatNumber(level)} ${formatNumber(1 - level)}`,
        }),
      ),
    ]
  })

export const brightness = ({ amount = 1.15 }: AmountOptions = {}): Effect =>
  simpleFilter('brightness', (io) => [
    componentTransfer(
      { in: io.input, result: io.output },
      transfer(RGB_CHANNELS, { type: 'linear', slope: Math.max(amount, 0) }),
    ),
  ])

export const contrast = ({ amount = 1.25 }: AmountOptions = {}): Effect =>
  simpleFilter('contrast', (io) => {
    const slope = Math.max(amount, 0)
    return [
      componentTransfer(
        { in: io.input, result: io.output },
        transfer(RGB_CHANNELS, { type: 'linear', slope, intercept: 0.5 - slope * 0.5 }),
      ),
    ]
  })

export const sepia = ({ amount = 1 }: AmountOptions = {}): Effect =>
  simpleFilter('sepia', (io) => [
    colorMatrix(mixMatrix(IDENTITY_MATRIX, SEPIA_MATRIX, amount), { in: io.input, result: io.output }),
  ])

export const fade = ({ amount = 0.7 }: AmountOptions = {}): Effect =>
  simpleFilter('fade', (io) => [
    componentTransfer(
      { in: io.input, result: io.output },
      transfer(['A'], { type: 'linear', slope: clamp(amount, 0, 1) }),
    ),
  ])

export interface PosterizeOptions {
  readonly steps?: number
  readonly includeAlpha?: boolean
}

export const posterize = ({ steps = 5, includeAlpha = false }: PosterizeOptions = {}): Effect =>
  simpleFilter('posterize', (io) => {
    const count = Math.max(Math.round(steps), 2)
    const tableValues = Array.from({ length: count }, (_, index) => formatNumber(index / (count - 1))).join(' ')
    return [
      componentTransfer(
        { in: io.input, result: io.output },
        transfer(includeAlpha ? RGBA_CHANNELS : RGB_CHANNELS, { type: 'discrete', tableValues }),
      ),
    ]
  })

export interface ThresholdOptions {
  readonly level?: number
  readonly dark?: string
  readonly light?: string
}

export const threshold = ({
  level = 0.5,
  dark = '#000000',
  light = '#ffffff',
}: ThresholdOptions = {}): Effect =>
  defineEffect('threshold', [
    filterStage((io, context) => {
      const luminance = context.uid('threshold-luminance')
      const binary = context.uid('threshold-binary')
      const slope = 255
      const darkColor = channels(parseColor(dark))
      const lightColor = channels(parseColor(light, { red: 1, green: 1, blue: 1 }))
      return {
        primitives: [
          colorMatrix(LUMINANCE_MATRIX, { in: io.input, result: luminance }),
          componentTransfer(
            { in: luminance, result: binary },
            transfer(RGB_CHANNELS, { type: 'linear', slope, intercept: 0.5 - slope * clamp(level, 0, 1) }),
          ),
          componentTransfer(
            { in: binary, result: io.output },
            RGB_CHANNELS.map((channel, index) =>
              primitive(`feFunc${channel}`, {
                type: 'table',
                tableValues: `${formatNumber(darkColor[index] ?? 0)} ${formatNumber(lightColor[index] ?? 1)}`,
              }),
            ),
          ),
        ],
      }
    }),
  ])

export interface DuotoneOptions {
  readonly shadow?: string
  readonly highlight?: string
  readonly mix?: number
}

export const duotone = ({
  shadow = '#12263a',
  highlight = '#f4d35e',
  mix = 1,
}: DuotoneOptions = {}): Effect =>
  defineEffect('duotone', [
    filterStage((io, context) => {
      const luminance = context.uid('duotone-luminance')
      const mapped = context.uid('duotone-mapped')
      const shadowColor = channels(parseColor(shadow))
      const highlightColor = channels(parseColor(highlight, { red: 1, green: 1, blue: 1 }))
      const blend = clamp(mix, 0, 1)
      const toned = componentTransfer(
        { in: luminance, result: blend === 1 ? io.output : mapped },
        RGB_CHANNELS.map((channel, index) =>
          primitive(`feFunc${channel}`, {
            type: 'table',
            tableValues: `${formatNumber(shadowColor[index] ?? 0)} ${formatNumber(highlightColor[index] ?? 1)}`,
          }),
        ),
      )
      return {
        primitives: [
          colorMatrix(LUMINANCE_MATRIX, { in: io.input, result: luminance }),
          toned,
          ...(blend === 1
            ? []
            : [
                primitive('feComposite', {
                  in: mapped,
                  in2: io.input,
                  operator: 'arithmetic',
                  k1: 0,
                  k2: blend,
                  k3: 1 - blend,
                  k4: 0,
                  result: io.output,
                }),
              ]),
        ],
      }
    }),
  ])

export interface TintOptions {
  readonly color?: string
  readonly amount?: number
}

export const tint = ({ color = '#ff2d55', amount = 0.45 }: TintOptions = {}): Effect =>
  defineEffect('tint', [
    filterStage((io, context) => {
      const flood = context.uid('tint-flood')
      const clipped = context.uid('tint-clipped')
      const blend = clamp(amount, 0, 1)
      return {
        primitives: [
          primitive('feFlood', { 'flood-color': color, result: flood }),
          primitive('feComposite', { in: flood, in2: io.input, operator: 'in', result: clipped }),
          primitive('feComposite', {
            in: clipped,
            in2: io.input,
            operator: 'arithmetic',
            k1: 0,
            k2: blend,
            k3: 1 - blend,
            k4: 0,
            result: io.output,
          }),
        ],
      }
    }),
  ])
