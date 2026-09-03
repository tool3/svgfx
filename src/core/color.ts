import { clamp } from './numbers.ts'

export interface Rgb {
  readonly red: number
  readonly green: number
  readonly blue: number
}

export const BLACK: Rgb = { red: 0, green: 0, blue: 0 }

export const WHITE: Rgb = { red: 1, green: 1, blue: 1 }

const HEX_PATTERN = /^#?([0-9a-f]{3,8})$/i

const FUNCTIONAL_PATTERN = /^rgba?\(([^)]+)\)$/i

const expandShorthand = (hex: string): string =>
  hex.length === 3 || hex.length === 4
    ? Array.from(hex.slice(0, 3), (character) => character.repeat(2)).join('')
    : hex.slice(0, 6)

const fromHex = (hex: string): Rgb | null => {
  const expanded = expandShorthand(hex)
  return expanded.length === 6
    ? {
        red: Number.parseInt(expanded.slice(0, 2), 16) / 255,
        green: Number.parseInt(expanded.slice(2, 4), 16) / 255,
        blue: Number.parseInt(expanded.slice(4, 6), 16) / 255,
      }
    : null
}

const channelValue = (raw: string): number =>
  raw.trim().endsWith('%')
    ? clamp(Number.parseFloat(raw) / 100, 0, 1)
    : clamp(Number.parseFloat(raw) / 255, 0, 1)

const fromFunctional = (body: string): Rgb | null => {
  const parts = body.split(/[\s,/]+/).filter((part) => part.length > 0)
  const [red, green, blue] = parts.map(channelValue)
  return red !== undefined && green !== undefined && blue !== undefined && [red, green, blue].every(Number.isFinite)
    ? { red, green, blue }
    : null
}

export const parseColor = (value: string, fallback: Rgb = BLACK): Rgb => {
  const hexMatch = HEX_PATTERN.exec(value.trim())
  const functionalMatch = FUNCTIONAL_PATTERN.exec(value.trim())
  return (
    (hexMatch?.[1] !== undefined ? fromHex(hexMatch[1]) : null) ??
    (functionalMatch?.[1] !== undefined ? fromFunctional(functionalMatch[1]) : null) ??
    fallback
  )
}

export const channels = (color: Rgb): readonly number[] => [color.red, color.green, color.blue]

export const mixMatrix = (identity: readonly number[], target: readonly number[], amount: number): string =>
  identity.map((value, index) => value + ((target[index] ?? 0) - value) * clamp(amount, 0, 1)).join(' ')
