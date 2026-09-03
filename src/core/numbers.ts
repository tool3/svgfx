const PRECISION = 4

export const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(Math.max(value, minimum), maximum)

export const formatNumber = (value: number): string =>
  Number.isFinite(value) ? String(Number(value.toFixed(PRECISION)) + 0) : '0'

export const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number.parseFloat(value ?? '')
  return Number.isFinite(parsed) ? parsed : fallback
}
