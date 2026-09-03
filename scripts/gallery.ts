import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as stouch from '../src/index.ts'
import type { Effect } from '../src/index.ts'

type Variant = readonly [string, readonly Effect[]]

const here = dirname(fileURLToPath(import.meta.url))

const sources = join(here, '..', 'examples', 'sources')

const read = (name: string): string => readFileSync(join(sources, name), 'utf8')

const scene = read('scene.svg')

const mark = read('mark.svg')

const motion = read('motion.svg')

const sceneVariants: readonly Variant[] = [
  ['original', []],
  ['blur', [stouch.blur({ radius: 2 })]],
  ['bloom', [stouch.bloom({ radius: 6, threshold: 0.5 })]],
  ['glow', [stouch.glow({ color: '#4cc9f0', radius: 8 })]],
  ['grayscale', [stouch.grayscale()]],
  ['saturate', [stouch.saturate({ amount: 2 })]],
  ['hueRotate', [stouch.hueRotate({ angle: 140 })]],
  ['invert', [stouch.invert()]],
  ['brightness', [stouch.brightness({ amount: 1.3 })]],
  ['contrast', [stouch.contrast({ amount: 1.6 })]],
  ['sepia', [stouch.sepia()]],
  ['posterize', [stouch.posterize({ steps: 4 })]],
  ['threshold', [stouch.threshold({ level: 0.5 })]],
  ['duotone', [stouch.duotone()]],
  ['tint', [stouch.tint({ color: '#00f5d4', amount: 0.5 })]],
  ['grain', [stouch.grain({ amount: 0.5 })]],
  ['scanlines', [stouch.scanlines()]],
  ['chromaticAberration', [stouch.chromaticAberration({ offset: 4 })]],
  ['glitch', [stouch.glitch({ intensity: 0.7 })]],
  ['halftone', [stouch.halftone({ size: 5 })]],
  ['vignette', [stouch.vignette()]],
  ['sharpen', [stouch.sharpen({ amount: 4 })]],
  ['preset: crt', [stouch.crt()]],
  ['preset: vhs', [stouch.vhs()]],
  ['preset: riso', [stouch.riso()]],
  ['preset: xerox', [stouch.xerox()]],
  ['preset: film', [stouch.film()]],
  ['preset: newsprint', [stouch.newsprint()]],
  ['preset: cyberpunk', [stouch.cyberpunk()]],
]

const markVariants: readonly Variant[] = [
  ['mark: original', []],
  ['mark: outline', [stouch.outline({ width: 3, color: '#f7f7f2' })]],
  ['mark: outline inside', [stouch.outline({ width: 2, color: '#0d0d10', position: 'inside' })]],
  ['mark: glow', [stouch.glow({ color: '#ff2d55', radius: 7, intensity: 1.6 })]],
  ['mark: shadow', [stouch.shadow({ x: 6, y: 8, blur: 6, opacity: 0.7 })]],
  ['mark: fade', [stouch.fade({ amount: 0.45 })]],
  ['mark: emboss', [stouch.emboss({ depth: 1.4 })]],
  ['mark: pixelate', [stouch.pixelate({ size: 10 })]],
  ['mark: wave', [stouch.wave({ amplitude: 16, frequency: 0.03 })]],
  ['mark: halftone keep', [stouch.halftone({ size: 5, keepSource: true })]],
  ['mark: neon', [stouch.neon({ color: '#4cc9f0' })]],
  ['mark: glitch', [stouch.glitch({ intensity: 0.8, slices: 10 })]],
]

const motionVariants: readonly Variant[] = [
  ['motion: original', []],
  ['motion: crt', [stouch.crt()]],
  ['motion: crt animated', [stouch.crt({ animate: true })]],
  ['motion: halftone', [stouch.halftone({ size: 5 })]],
  ['motion: riso', [stouch.riso()]],
  [
    'motion: layered',
    [
      stouch.bloom({ radius: 6, threshold: 0.45 }),
      stouch.glitch({ intensity: 0.6, slices: 8, animate: true }),
      stouch.scanlines({ gap: 3, opacity: 0.3, animate: true }),
      stouch.grain({ amount: 0.35, animate: true }),
    ],
  ],
]

const card = (base: string) => ([label, effects]: Variant): string =>
  `<figure><div class="frame">${stouch.stouch(base, effects, { seed: label })}</div><figcaption>${label}</figcaption></figure>`

const section = (title: string, cards: readonly string[]): string =>
  `<h2>${title}</h2>\n<div class="grid">\n${cards.join('\n')}\n</div>`

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>stouch gallery</title>
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
<h1>stouch — effect gallery</h1>
${section('Scene', sceneVariants.map(card(scene)))}
${section('Mark', markVariants.map(card(mark)))}
${section('Already animated', motionVariants.map(card(motion)))}
</body>
</html>
`

writeFileSync(join(here, '..', 'examples', 'gallery.html'), page)

console.log(
  `Wrote examples/gallery.html with ${sceneVariants.length + markVariants.length + motionVariants.length} variants.`,
)
