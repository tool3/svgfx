import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as pstfx from '../src/index.ts'
import type { Effect } from '../src/index.ts'

type Variant = readonly [string, readonly Effect[]]

const here = dirname(fileURLToPath(import.meta.url))

const sources = join(here, '..', 'examples', 'sources')

const read = (name: string): string => readFileSync(join(sources, name), 'utf8')

const scene = read('scene.svg')

const mark = read('mark.svg')

const motion = read('motion.svg')

const tetra = read('tetrahedron.svg')

const tones = read('tones.svg')

const sceneVariants: readonly Variant[] = [
  ['original', []],
  ['blur', [pstfx.blur({ radius: 2 })]],
  ['bloom', [pstfx.bloom({ radius: 6, threshold: 0.5 })]],
  ['glow', [pstfx.glow({ color: '#4cc9f0', radius: 8 })]],
  ['grayscale', [pstfx.grayscale()]],
  ['saturate', [pstfx.saturate({ amount: 2 })]],
  ['hueRotate', [pstfx.hueRotate({ angle: 140 })]],
  ['invert', [pstfx.invert()]],
  ['brightness', [pstfx.brightness({ amount: 1.3 })]],
  ['contrast', [pstfx.contrast({ amount: 1.6 })]],
  ['sepia', [pstfx.sepia()]],
  ['posterize', [pstfx.posterize({ steps: 4 })]],
  ['threshold', [pstfx.threshold({ level: 0.5 })]],
  ['duotone', [pstfx.duotone()]],
  ['tint', [pstfx.tint({ color: '#00f5d4', amount: 0.5 })]],
  ['grain', [pstfx.grain({ amount: 0.5 })]],
  ['scanlines', [pstfx.scanlines()]],
  ['chromaticAberration', [pstfx.chromaticAberration({ offset: 4 })]],
  ['glitch', [pstfx.glitch({ intensity: 0.7 })]],
  ['halftone', [pstfx.halftone({ size: 5 })]],
  ['vignette', [pstfx.vignette()]],
  ['sharpen', [pstfx.sharpen({ amount: 4 })]],
  ['preset: crt', [pstfx.crt()]],
  ['preset: vhs', [pstfx.vhs()]],
  ['preset: riso', [pstfx.riso()]],
  ['preset: xerox', [pstfx.xerox()]],
  ['preset: film', [pstfx.film()]],
  ['preset: newsprint', [pstfx.newsprint()]],
  ['preset: cyberpunk', [pstfx.cyberpunk()]],
]

const markVariants: readonly Variant[] = [
  ['mark: original', []],
  ['mark: outline', [pstfx.outline({ width: 3, color: '#f7f7f2' })]],
  ['mark: outline inside', [pstfx.outline({ width: 2, color: '#0d0d10', position: 'inside' })]],
  ['mark: glow', [pstfx.glow({ color: '#ff2d55', radius: 7, intensity: 1.6 })]],
  ['mark: shadow', [pstfx.shadow({ x: 6, y: 8, blur: 6, opacity: 0.7 })]],
  ['mark: fade', [pstfx.fade({ amount: 0.45 })]],
  ['mark: emboss', [pstfx.emboss({ depth: 1.4 })]],
  ['mark: pixelate', [pstfx.pixelate({ size: 10 })]],
  ['mark: wave', [pstfx.wave({ amplitude: 16, frequency: 0.03 })]],
  ['mark: halftone keep', [pstfx.halftone({ size: 5, keepSource: true })]],
  ['mark: neon', [pstfx.neon({ color: '#4cc9f0' })]],
  ['mark: glitch', [pstfx.glitch({ intensity: 0.8, slices: 10 })]],
]

const toneVariants: readonly Variant[] = [
  ['tones: original', []],
  ['tones: threshold', [pstfx.threshold({ level: 0.62 })]],
  ['tones: posterize', [pstfx.posterize({ steps: 4 })]],
  ['tones: duotone', [pstfx.duotone()]],
  ['tones: halftone', [pstfx.halftone({ size: 5, angle: 15 })]],
  ['tones: preset xerox', [pstfx.xerox()]],
  ['tones: preset newsprint', [pstfx.newsprint()]],
  ['tones: preset riso', [pstfx.riso()]],
]

const tetraVariants: readonly Variant[] = [
  ['3d: original', []],
  ['3d: crt', [pstfx.crt()]],
  ['3d: neon', [pstfx.neon()]],
  ['3d: riso', [pstfx.riso()]],
  ['3d: halftone', [pstfx.halftone({ size: 5 })]],
  ['3d: film tuned', [pstfx.film({ grain: { size: 1.2 } })]],
]

const motionVariants: readonly Variant[] = [
  ['motion: original', []],
  ['motion: crt', [pstfx.crt()]],
  ['motion: crt animated', [pstfx.crt({ animate: true })]],
  ['motion: halftone', [pstfx.halftone({ size: 5 })]],
  ['motion: riso', [pstfx.riso()]],
  [
    'motion: layered',
    [
      pstfx.bloom({ radius: 6, threshold: 0.45 }),
      pstfx.glitch({ intensity: 0.6, slices: 8, animate: true }),
      pstfx.scanlines({ gap: 3, opacity: 0.3, animate: true }),
      pstfx.grain({ amount: 0.35, animate: true }),
    ],
  ],
]

const card = (base: string) => ([label, effects]: Variant): string =>
  `<figure><div class="frame">${pstfx.pstfx(base, effects, { seed: label })}</div><figcaption>${label}</figcaption></figure>`

const section = (title: string, cards: readonly string[]): string =>
  `<h2>${title}</h2>\n<div class="grid">\n${cards.join('\n')}\n</div>`

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>pstfx gallery</title>
<style>
  :root { color-scheme: dark }
  body { margin: 0; padding: 32px; background: #0d0d10; color: #e9e9ec; font: 13px/1.5 ui-sans-serif, system-ui, sans-serif }
  h1 { font-size: 15px; letter-spacing: .18em; text-transform: uppercase; color: #8a8a94; margin: 0 0 28px }
  h2 { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: #6a6a74; margin: 36px 0 16px; font-weight: 500 }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px }
  figure { margin: 0 }
  .frame { background: #141419; border: 1px solid #24242c; border-radius: 10px; overflow: hidden; line-height: 0 }
  .frame svg { width: 100%; height: auto; display: block }
  figcaption { margin-top: 8px; color: #8a8a94; font-family: ui-monospace, SFMono-Regular, monospace; font-size: 11px }
</style>
</head>
<body>
<h1>pstfx — effect gallery</h1>
${section('Scene', sceneVariants.map(card(scene)))}
${section('Mark', markVariants.map(card(mark)))}
${section('Tones', toneVariants.map(card(tones)))}
${section('Spinning solid', tetraVariants.map(card(tetra)))}
${section('Already animated', motionVariants.map(card(motion)))}
</body>
</html>
`

writeFileSync(join(here, '..', 'examples', 'gallery.html'), page)

console.log(
  `Wrote examples/gallery.html with ${sceneVariants.length + markVariants.length + toneVariants.length + tetraVariants.length + motionVariants.length} variants.`,
)
