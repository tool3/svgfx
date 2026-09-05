import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

interface Vector {
  readonly x: number
  readonly y: number
  readonly z: number
}

const FRAMES = 60
const DURATION = 7
const SIZE = 360
const CENTER = SIZE / 2
const SCALE = 96
const CAMERA = 6.2
const TILT = 11
const LIGHT: Vector = { x: -0.38, y: 0.52, z: 0.76 }

const HEIGHT = Math.SQRT2
const BASE_Y = HEIGHT / 4
const APEX_Y = -(3 * HEIGHT) / 4

const radians = (degrees: number): number => (degrees * Math.PI) / 180

const baseVertex = (degrees: number): Vector => ({
  x: Math.cos(radians(degrees)),
  y: BASE_Y,
  z: Math.sin(radians(degrees)),
})

const VERTICES: readonly Vector[] = [
  baseVertex(90),
  baseVertex(210),
  baseVertex(330),
  { x: 0, y: APEX_Y, z: 0 },
]

const FACES: readonly (readonly number[])[] = [
  [0, 1, 2],
  [0, 1, 3],
  [1, 2, 3],
  [2, 0, 3],
]

const MATERIAL = '#f0a13c'
const EDGE = '#2a1a08'
const POOL = '#f0a13c'

const subtract = (a: Vector, b: Vector): Vector => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z })

const cross = (a: Vector, b: Vector): Vector => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
})

const dot = (a: Vector, b: Vector): number => a.x * b.x + a.y * b.y + a.z * b.z

const length = (v: Vector): number => Math.sqrt(dot(v, v))

const normalize = (v: Vector): Vector => {
  const size = length(v) || 1
  return { x: v.x / size, y: v.y / size, z: v.z / size }
}

const average = (points: readonly Vector[]): Vector => ({
  x: points.reduce((total, p) => total + p.x, 0) / points.length,
  y: points.reduce((total, p) => total + p.y, 0) / points.length,
  z: points.reduce((total, p) => total + p.z, 0) / points.length,
})

const spinY = (v: Vector, angle: number): Vector => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: v.x * cos + v.z * sin, y: v.y, z: -v.x * sin + v.z * cos }
}

const tiltX = (v: Vector, angle: number): Vector => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: v.x, y: v.y * cos - v.z * sin, z: v.y * sin + v.z * cos }
}

const transform = (v: Vector, spin: number): Vector => tiltX(spinY(v, spin), radians(TILT))

const project = (v: Vector): readonly [number, number] => {
  const depth = CAMERA - v.z
  const factor = (CAMERA / depth) * SCALE
  return [CENTER + v.x * factor, CENTER - v.y * factor]
}

const round = (value: number): string => String(Number(value.toFixed(2)))

const orient = (face: readonly number[]): readonly number[] => {
  const [a, b, c] = face.map((index) => VERTICES[index] as Vector)
  const normal = cross(subtract(b as Vector, a as Vector), subtract(c as Vector, a as Vector))
  return dot(normal, average([a as Vector, b as Vector, c as Vector])) < 0
    ? [face[0] as number, face[2] as number, face[1] as number]
    : face
}

const ORIENTED = FACES.map(orient)

const shade = (hex: string, intensity: number): string => {
  const value = Number.parseInt(hex.slice(1), 16)
  const channel = (shift: number): string => {
    const raw = (value >> shift) & 0xff
    const lit = Math.round(Math.min(255, Math.max(0, raw * intensity)))
    return lit.toString(16).padStart(2, '0')
  }
  return `#${channel(16)}${channel(8)}${channel(0)}`
}

interface FaceFrame {
  readonly points: string
  readonly fill: string
  readonly opacity: string
}

const frameFor = (face: readonly number[], spin: number): FaceFrame => {
  const world = face.map((index) => transform(VERTICES[index] as Vector, spin))
  const [a, b, c] = world as [Vector, Vector, Vector]
  const normal = normalize(cross(subtract(b, a), subtract(c, a)))
  const middle = average(world)
  const toCamera = normalize(subtract({ x: 0, y: 0, z: CAMERA }, middle))
  const facing = dot(normal, toCamera)
  const lambert = Math.max(0, dot(normal, normalize(LIGHT)))
  return {
    points: world.map((v) => project(v).map(round).join(',')).join(' '),
    fill: shade(MATERIAL, 0.46 + lambert * 0.82),
    opacity: facing > 0 ? '1' : '0',
  }
}

const loop = <T,>(build: (spin: number) => T): T[] =>
  Array.from({ length: FRAMES + 1 }, (_, index) =>
    build((index / FRAMES) * Math.PI * 2),
  )

const animate = (attribute: string, values: readonly string[]): string =>
  `      <animate attributeName="${attribute}" values="${values.join(';')}" dur="${DURATION}s" repeatCount="indefinite" calcMode="linear"/>`

const polygon = (face: readonly number[]): string => {
  const frames = loop((spin) => frameFor(face, spin))
  const first = frames[0] as FaceFrame
  return [
    `    <polygon points="${first.points}" fill="${first.fill}" opacity="${first.opacity}" stroke="${EDGE}" stroke-width="1.1" stroke-linejoin="round">`,
    animate('points', frames.map((frame) => frame.points)),
    animate('fill', frames.map((frame) => frame.fill)),
    animate('opacity', frames.map((frame) => frame.opacity)),
    '    </polygon>',
  ].join('\n')
}

const document = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <title>Spinning tetrahedron</title>
  <defs>
    <linearGradient id="backdrop" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0" stop-color="#141a2e"/>
      <stop offset="1" stop-color="#070912"/>
    </linearGradient>
    <radialGradient id="pool" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${POOL}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="${POOL}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${SIZE}" height="${SIZE}" rx="28" fill="url(#backdrop)"/>
  <ellipse cx="${CENTER}" cy="286" rx="104" ry="26" fill="url(#pool)"/>

  <g stroke-linejoin="round">
${ORIENTED.map(polygon).join('\n')}
  </g>
</svg>
`

const here = dirname(fileURLToPath(import.meta.url))
const target = join(here, '..', 'examples', 'sources', 'tetrahedron.svg')
writeFileSync(target, document)

console.log(
  `Wrote examples/sources/tetrahedron.svg — ${FRAMES} frames, ${DURATION}s loop, ${(document.length / 1024).toFixed(1)} KB`,
)
