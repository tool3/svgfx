const OFFSET_BASIS = 2166261
const PRIME = 16777619

const hash = (value: string): number =>
  Array.from(value).reduce(
    (accumulator, character) => Math.imul(accumulator ^ character.charCodeAt(0), PRIME) >>> 0,
    OFFSET_BASIS,
  )

const scramble = (value: number): number => {
  const first = Math.imul(value ^ (value >>> 16), 2246822507) >>> 0
  const second = Math.imul(first ^ (first >>> 13), 3266489909) >>> 0
  return (second ^ (second >>> 16)) >>> 0
}

export const createRandom =
  (seed: string, salt: number) =>
  (key: string | number): number =>
    scramble(hash(`${seed}:${salt}:${key}`)) / 4294967296

export const shortHash = (value: string): string => scramble(hash(value)).toString(36).padStart(6, '0').slice(0, 6)
