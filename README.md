<div align="center">

# @svgfx/postprocessing

`svgfx(logo, [crt()])`

<!-- <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/matrix-layered.after.svg" width="420" alt="crt preset"> -->
<!-- <img src="https://shellfied.vercel.app/s/lLOmfrJ.svg" width="420" alt="crt preset"> -->
<!-- <img src="https://shellfied.vercel.app/s/G0RAVq1.svg" width="420" alt="crt preset"> -->
<img src="https://shellfied.vercel.app/s/wYoZ1Sb.svg" width="420" alt="crt preset">

### Post-processing effects for any SVG.

Give it an SVG, get back an SVG — now with scanlines, bloom, glitch, halftone or a
dozen other looks baked in. Still vector, still editable, no rasterizing, no DOM.

[![npm](https://img.shields.io/npm/v/@svgfx/postprocessing)](https://www.npmjs.com/package/@svgfx/postprocessing)
[![license](https://img.shields.io/badge/license-MIT-orange)](./LICENSE)

</div>

---

## Highlights

- ✅ **Vector in, vector out** — no canvas, no rasterizing, no `<image>` payloads. The result still scales and still has your paths in it.
- ✅ **Runs anywhere** — zero runtime dependencies, no DOM. Node, Bun, Deno, edge functions, build scripts, browsers.
- ✅ **27 effects + 8 presets** — every one tuned to look right with no arguments.
- ✅ **Follows your artwork's shape** — overlays clip flush to a rounded frame or any silhouette, never over it.
- ✅ **Deterministic** — same input and settings give byte-identical output, so it drops into a build pipeline and a snapshot test.
- ✅ **14 KB gzipped**, fully tree-shakeable. Import one effect, ship one effect.
- ✅ **Self-contained motion** — opt into `animate` and the output loops on its own inside an `<img>`, no JavaScript attached.
- ✅ **Keeps existing animation** — an SVG that already animates keeps animating.

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [API](#api)
- [Effects](#effects)
- [Examples](#examples)
- [Shape](#the-output-keeps-your-artworks-shape)
- [Motion](#motion)
- [Writing your own effect](#writing-your-own-effect)
- [Recipes](#recipes)
- [Notes](#notes)

---

## Installation

```bash
npm install @svgfx/postprocessing
```

## Quick start

```ts
import { readFileSync, writeFileSync } from 'node:fs'
import { svgfx, crt } from '@svgfx/postprocessing'

const source = readFileSync('logo.svg', 'utf8')

writeFileSync('logo-crt.svg', svgfx(source, [crt()]))
```

Effects are applied in order, exactly as you would stack them in an editor:

```ts
import { svgfx, duotone, halftone, grain } from '@svgfx/postprocessing'

const poster = svgfx(source, [
  duotone({ shadow: '#111d4a', highlight: '#ff6b6b' }),
  halftone({ size: 5, angle: 15 }),
  grain({ amount: 0.4 }),
])
```

## API

### `svgfx(source, effects?, settings?)`

Takes an SVG string, returns an SVG string.

```ts
const output = svgfx(source, [bloom()], { seed: 'hero', format: 'pretty' })
```

### `createPipeline(effects, settings?)`

A reusable, named stack of effects. Build it once, apply it to many files.

```ts
import { createPipeline, duotone, grain } from '@svgfx/postprocessing'

const brand = createPipeline([duotone({ shadow: '#001427' }), grain()], { seed: 'brand' })

icons.map(brand.apply)
```

### `compose(name, effects)`

Collapses several effects into one, so a house style becomes a single effect that can
be passed around, exported, and stacked with others.

```ts
export const houseStyle = compose('house-style', [contrast({ amount: 1.1 }), grain(), vignette()])
```

### `toDataUri(svg, options?)`

```ts
element.style.backgroundImage = `url("${toDataUri(svgfx(source, [crt()]))}")`
```

URI-encoded by default (smaller and readable); pass `{ base64: true }` if you need it.

### Settings

| Setting   | Default      | What it does |
| --------- | ------------ | ------------ |
| `seed`    | `'svgfx'`   | Seeds every random decision. Change it to reroll a glitch or a grain field; keep it to get the same output forever. |
| `prefix`  | `'svgfx'`   | Prefix for every generated id and class. |
| `scope`   | auto         | Id namespace. Derived from the source, seed and effects so several svgfx outputs can be inlined in one page without colliding. Set it yourself for stable, readable ids. |
| `clip`    | `'shape'`    | Trim the finished result to the artwork's own frame, so the output silhouette matches the input exactly. `'none'` lets effects spill past it. |
| `animate` | `true`       | Global switch for motion. `false` strips animation from every effect that asked for it — useful for print, PDF or snapshot tests. |
| `format`  | `'preserve'` | `'preserve'` keeps the input's whitespace, `'pretty'` re-indents, `'minify'` drops comments and layout whitespace. |

## Effects

### Light

| Effect | Options |
| ------ | ------- |
| `blur` | `radius` `3`, `axis` `'both' \| 'horizontal' \| 'vertical'` |
| `bloom` | `radius` `8`, `threshold` `0.55`, `intensity` `1.1` |
| `glow` | `color` `'#ffffff'`, `radius` `6`, `spread` `0`, `intensity` `1` |
| `shadow` | `x` `3`, `y` `4`, `blur` `4`, `color` `'#000000'`, `opacity` `0.4` |

### Colour

| Effect | Options |
| ------ | ------- |
| `grayscale` | `amount` `1` |
| `saturate` | `amount` `1.4` |
| `hueRotate` | `angle` `90` |
| `invert` | `amount` `1` |
| `brightness` | `amount` `1.15` |
| `contrast` | `amount` `1.25` |
| `sepia` | `amount` `1` |
| `fade` | `amount` `0.7` |
| `posterize` | `steps` `5`, `includeAlpha` `false` |
| `threshold` | `level` `0.5`, `dark` `'#000000'`, `light` `'#ffffff'` |
| `duotone` | `shadow` `'#12263a'`, `highlight` `'#f4d35e'`, `mix` `1` |
| `tint` | `color` `'#ff2d55'`, `amount` `0.45` |

### Texture and distortion

| Effect | Options |
| ------ | ------- |
| `grain` | `amount` `0.32`, `size` `0.8`, `monochrome` `true`, `blend` `'overlay'`, `animate` `false`, `speed` `12` |
| `scanlines` | `gap` `4`, `thickness` `1.5`, `opacity` `0.28`, `color` `'#000000'`, `angle` `0`, `blend` `'multiply'`, `animate` `false`, `speed` `6`, `clip` `'shape'` |
| `chromaticAberration` | `offset` `2`, `angle` `0` |
| `glitch` | `intensity` `0.5`, `slices` `7`, `colorShift` `true`, `animate` `false`, `speed` `1` |
| `pixelate` | `size` `8` |
| `halftone` | `size` `6`, `angle` `45`, `levels` `4`, `color` `'#111111'`, `background` `'#ffffff'`, `keepSource` `false`, `clip` `'shape'` |
| `vignette` | `amount` `0.65`, `radius` `0.6`, `softness` `0.7`, `color` `'#000000'`, `clip` `'shape'` |
| `outline` | `width` `2`, `color` `'#000000'`, `position` `'outside' \| 'inside'` |
| `wave` | `amplitude` `12`, `frequency` `0.02`, `octaves` `2`, `animate` `false`, `speed` `0.15` |
| `emboss` | `depth` `1`, `angle` `135`, `desaturate` `true` |
| `sharpen` | `amount` `1` |

Every option is optional. `bloom()` on its own is tuned to look right.

### Presets

Finished looks, each one a `compose` of the effects above.

```ts
import { crt, vhs, riso, xerox, neon, film, newsprint, cyberpunk } from '@svgfx/postprocessing'

svgfx(source, [crt({ animate: true })])
svgfx(source, [riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })])
svgfx(source, [neon({ color: '#4cc9f0' })])
```

| Preset | Look |
| ------ | ---- |
| `crt` | Phosphor glow, scanlines, colour fringing, vignette |
| `vhs` | Tape wobble, heavy fringing, rolling lines, noise |
| `riso` | Two-colour risograph with paper grain |
| `xerox` | Blown-out photocopy |
| `neon` | Saturated sign glow |
| `film` | Halation, grain and a soft vignette |
| `newsprint` | Halftone dots on off-white stock |
| `cyberpunk` | Sliced, shifted, bloomed, scanned |

### Tuning a preset

A preset is a stack of effects, and every one of them is reachable by name. Override the
effect you want to move and the rest of the recipe stays put:

```ts
svgfx(source, [film({ grain: { amount: 0.5 } })])
```

Overrides merge over the preset's values rather than replacing the effect, so changing
one knob keeps the others. `film` runs bloom at `radius: 6, threshold: 0.68` — this moves
the radius and keeps the threshold:

```ts
svgfx(source, [film({ bloom: { radius: 14 } })])
```

Each preset's options type lists exactly the effects it contains, so editors autocomplete
them and `film({ scanlines: ... })` is a type error — film has no scanlines in it.

```ts
crt({
  animate: true,
  scanlines: { gap: 6, blend: 'overlay' },
  vignette: { amount: 0.9 },
})
```

The shorthands stay: `animate` on `crt`, `vhs` and `cyberpunk`, `shadow`/`highlight` on
`riso`, `color` on `neon`. A per-effect override wins when both are given.

Every preset's own values are exported, so you can read what you are overriding, build a
variant from them, or drive a UI off them:

```ts
import { film, FILM_DEFAULTS } from '@svgfx/postprocessing'

FILM_DEFAULTS.bloom              // { radius: 6, threshold: 0.68 }
film({ bloom: { ...FILM_DEFAULTS.bloom, radius: 20 } })
```

`CRT_DEFAULTS`, `VHS_DEFAULTS`, `RISO_DEFAULTS`, `XEROX_DEFAULTS`, `NEON_DEFAULTS`,
`FILM_DEFAULTS`, `NEWSPRINT_DEFAULTS` and `CYBERPUNK_DEFAULTS` are all exported.

## Examples

Every effect and preset ships as a runnable TypeScript script under
[`examples/`](https://github.com/tool3/svgfx/tree/master/examples) — the linked name opens the code, which shows the exact
options used. Each script writes its results into `examples/svgs`, and runs as-is with no
build step.

```bash
npm run examples                    # render all 39
node examples/effects/halftone.ts   # or just one
npm run gallery                     # side-by-side overview page
```

Every example runs twice: on still artwork, and on [`tetrahedron.svg`](https://github.com/tool3/svgfx/blob/master/examples/sources/tetrahedron.svg) —
a spinning 3D solid — so you can see each effect hold up on something that moves. The
animated columns play in place.

### Effect examples

| Example | Before | After | Before (animated) | After (animated) |
| ------- | ------ | ----- | ----------------- | ---------------- |
| [`blur`](https://github.com/tool3/svgfx/blob/master/examples/effects/blur.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/blur.before.svg" width="180" alt="blur before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/blur.after.svg" width="180" alt="blur after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/blur.motion.after.svg" width="140" alt="blur on the tetrahedron"> |
| [`bloom`](https://github.com/tool3/svgfx/blob/master/examples/effects/bloom.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/bloom.before.svg" width="180" alt="bloom before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/bloom.after.svg" width="180" alt="bloom after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/bloom.motion.after.svg" width="140" alt="bloom on the tetrahedron"> |
| [`glow`](https://github.com/tool3/svgfx/blob/master/examples/effects/glow.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glow.before.svg" width="180" alt="glow before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glow.after.svg" width="180" alt="glow after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glow.motion.after.svg" width="140" alt="glow on the tetrahedron"> |
| [`shadow`](https://github.com/tool3/svgfx/blob/master/examples/effects/shadow.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/shadow.before.svg" width="180" alt="shadow before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/shadow.after.svg" width="180" alt="shadow after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/shadow.motion.after.svg" width="140" alt="shadow on the tetrahedron"> |
| [`grayscale`](https://github.com/tool3/svgfx/blob/master/examples/effects/grayscale.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grayscale.before.svg" width="180" alt="grayscale before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grayscale.after.svg" width="180" alt="grayscale after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grayscale.motion.after.svg" width="140" alt="grayscale on the tetrahedron"> |
| [`saturate`](https://github.com/tool3/svgfx/blob/master/examples/effects/saturate.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/saturate.before.svg" width="180" alt="saturate before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/saturate.after.svg" width="180" alt="saturate after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/saturate.motion.after.svg" width="140" alt="saturate on the tetrahedron"> |
| [`hue-rotate`](https://github.com/tool3/svgfx/blob/master/examples/effects/hue-rotate.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/hue-rotate.before.svg" width="180" alt="hue-rotate before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/hue-rotate.after.svg" width="180" alt="hue-rotate after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/hue-rotate.motion.after.svg" width="140" alt="hue-rotate on the tetrahedron"> |
| [`invert`](https://github.com/tool3/svgfx/blob/master/examples/effects/invert.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/invert.before.svg" width="180" alt="invert before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/invert.after.svg" width="180" alt="invert after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/invert.motion.after.svg" width="140" alt="invert on the tetrahedron"> |
| [`brightness`](https://github.com/tool3/svgfx/blob/master/examples/effects/brightness.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/brightness.before.svg" width="180" alt="brightness before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/brightness.after.svg" width="180" alt="brightness after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/brightness.motion.after.svg" width="140" alt="brightness on the tetrahedron"> |
| [`contrast`](https://github.com/tool3/svgfx/blob/master/examples/effects/contrast.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/contrast.before.svg" width="180" alt="contrast before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/contrast.after.svg" width="180" alt="contrast after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/contrast.motion.after.svg" width="140" alt="contrast on the tetrahedron"> |
| [`sepia`](https://github.com/tool3/svgfx/blob/master/examples/effects/sepia.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sepia.before.svg" width="180" alt="sepia before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sepia.after.svg" width="180" alt="sepia after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sepia.motion.after.svg" width="140" alt="sepia on the tetrahedron"> |
| [`fade`](https://github.com/tool3/svgfx/blob/master/examples/effects/fade.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/fade.before.svg" width="180" alt="fade before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/fade.after.svg" width="180" alt="fade after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/fade.motion.after.svg" width="140" alt="fade on the tetrahedron"> |
| [`posterize`](https://github.com/tool3/svgfx/blob/master/examples/effects/posterize.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/posterize.before.svg" width="180" alt="posterize before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/posterize.after.svg" width="180" alt="posterize after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/posterize.motion.after.svg" width="140" alt="posterize on the tetrahedron"> |
| [`threshold`](https://github.com/tool3/svgfx/blob/master/examples/effects/threshold.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/threshold.before.svg" width="180" alt="threshold before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/threshold.after.svg" width="180" alt="threshold after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/threshold.motion.after.svg" width="140" alt="threshold on the tetrahedron"> |
| [`duotone`](https://github.com/tool3/svgfx/blob/master/examples/effects/duotone.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/duotone.before.svg" width="180" alt="duotone before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/duotone.after.svg" width="180" alt="duotone after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/duotone.motion.after.svg" width="140" alt="duotone on the tetrahedron"> |
| [`tint`](https://github.com/tool3/svgfx/blob/master/examples/effects/tint.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/tint.before.svg" width="180" alt="tint before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/tint.after.svg" width="180" alt="tint after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/tint.motion.after.svg" width="140" alt="tint on the tetrahedron"> |
| [`grain`](https://github.com/tool3/svgfx/blob/master/examples/effects/grain.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grain.before.svg" width="180" alt="grain before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grain.after.svg" width="180" alt="grain after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/grain.motion.after.svg" width="140" alt="grain on the tetrahedron"> |
| [`scanlines`](https://github.com/tool3/svgfx/blob/master/examples/effects/scanlines.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/scanlines.before.svg" width="180" alt="scanlines before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/scanlines.after.svg" width="180" alt="scanlines after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/scanlines.motion.after.svg" width="140" alt="scanlines on the tetrahedron"> |
| [`chromatic-aberration`](https://github.com/tool3/svgfx/blob/master/examples/effects/chromatic-aberration.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/chromatic-aberration.before.svg" width="180" alt="chromatic-aberration before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/chromatic-aberration.after.svg" width="180" alt="chromatic-aberration after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/chromatic-aberration.motion.after.svg" width="140" alt="chromatic-aberration on the tetrahedron"> |
| [`glitch`](https://github.com/tool3/svgfx/blob/master/examples/effects/glitch.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glitch.before.svg" width="180" alt="glitch before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glitch.after.svg" width="180" alt="glitch after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/glitch.motion.after.svg" width="140" alt="glitch on the tetrahedron"> |
| [`pixelate`](https://github.com/tool3/svgfx/blob/master/examples/effects/pixelate.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/pixelate.before.svg" width="180" alt="pixelate before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/pixelate.after.svg" width="180" alt="pixelate after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/pixelate.motion.after.svg" width="140" alt="pixelate on the tetrahedron"> |
| [`halftone`](https://github.com/tool3/svgfx/blob/master/examples/effects/halftone.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/halftone.before.svg" width="180" alt="halftone before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/halftone.after.svg" width="180" alt="halftone after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/halftone.motion.after.svg" width="140" alt="halftone on the tetrahedron"> |
| [`vignette`](https://github.com/tool3/svgfx/blob/master/examples/effects/vignette.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vignette.before.svg" width="180" alt="vignette before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vignette.after.svg" width="180" alt="vignette after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vignette.motion.after.svg" width="140" alt="vignette on the tetrahedron"> |
| [`outline`](https://github.com/tool3/svgfx/blob/master/examples/effects/outline.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/outline.before.svg" width="180" alt="outline before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/outline.after.svg" width="180" alt="outline after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/outline.motion.after.svg" width="140" alt="outline on the tetrahedron"> |
| [`wave`](https://github.com/tool3/svgfx/blob/master/examples/effects/wave.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/wave.before.svg" width="180" alt="wave before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/wave.after.svg" width="180" alt="wave after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/wave.motion.after.svg" width="140" alt="wave on the tetrahedron"> |
| [`emboss`](https://github.com/tool3/svgfx/blob/master/examples/effects/emboss.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/emboss.before.svg" width="180" alt="emboss before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/emboss.after.svg" width="180" alt="emboss after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/emboss.motion.after.svg" width="140" alt="emboss on the tetrahedron"> |
| [`sharpen`](https://github.com/tool3/svgfx/blob/master/examples/effects/sharpen.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sharpen.before.svg" width="180" alt="sharpen before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sharpen.after.svg" width="180" alt="sharpen after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/sharpen.motion.after.svg" width="140" alt="sharpen on the tetrahedron"> |

### Preset examples

| Example | Before | After | Before (animated) | After (animated) |
| ------- | ------ | ----- | ----------------- | ---------------- |
| [`crt`](https://github.com/tool3/svgfx/blob/master/examples/presets/crt.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/crt.before.svg" width="180" alt="crt before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/crt.after.svg" width="180" alt="crt after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/crt.motion.after.svg" width="140" alt="crt on the tetrahedron"> |
| [`cyberpunk`](https://github.com/tool3/svgfx/blob/master/examples/presets/cyberpunk.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/cyberpunk.before.svg" width="180" alt="cyberpunk before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/cyberpunk.after.svg" width="180" alt="cyberpunk after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/cyberpunk.motion.after.svg" width="140" alt="cyberpunk on the tetrahedron"> |
| [`film-3d`](https://github.com/tool3/svgfx/blob/master/examples/presets/film-3d.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film-3d.before.svg" width="180" alt="film-3d before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film-3d.after.svg" width="180" alt="film-3d after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film-3d.motion.after.svg" width="140" alt="film-3d on the tetrahedron"> |
| [`film`](https://github.com/tool3/svgfx/blob/master/examples/presets/film.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film.before.svg" width="180" alt="film before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film.after.svg" width="180" alt="film after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/film.motion.after.svg" width="140" alt="film on the tetrahedron"> |
| [`neon`](https://github.com/tool3/svgfx/blob/master/examples/presets/neon.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/neon.before.svg" width="180" alt="neon before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/neon.after.svg" width="180" alt="neon after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/neon.motion.after.svg" width="140" alt="neon on the tetrahedron"> |
| [`newsprint`](https://github.com/tool3/svgfx/blob/master/examples/presets/newsprint.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/newsprint.before.svg" width="180" alt="newsprint before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/newsprint.after.svg" width="180" alt="newsprint after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/newsprint.motion.after.svg" width="140" alt="newsprint on the tetrahedron"> |
| [`riso`](https://github.com/tool3/svgfx/blob/master/examples/presets/riso.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/riso.before.svg" width="180" alt="riso before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/riso.after.svg" width="180" alt="riso after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/riso.motion.after.svg" width="140" alt="riso on the tetrahedron"> |
| [`vhs`](https://github.com/tool3/svgfx/blob/master/examples/presets/vhs.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vhs.before.svg" width="180" alt="vhs before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vhs.after.svg" width="180" alt="vhs after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/vhs.motion.after.svg" width="140" alt="vhs on the tetrahedron"> |
| [`xerox`](https://github.com/tool3/svgfx/blob/master/examples/presets/xerox.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/xerox.before.svg" width="180" alt="xerox before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/xerox.after.svg" width="180" alt="xerox after"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/xerox.motion.after.svg" width="140" alt="xerox on the tetrahedron"> |

### Animated examples

Applied to `examples/sources/motion.svg`, which loops on its own in plain SMIL. Both
columns are playing: the source keeps its motion, and the second adds svgfx's on top.

| Example | Before | After |
| ------- | ------ | ----- |
| [`motion-crt`](https://github.com/tool3/svgfx/blob/master/examples/animated/preset-over-motion.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/motion-crt.before.svg" width="240" alt="motion-crt before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/motion-crt.after.svg" width="240" alt="motion-crt after"> |
| [`motion-layered`](https://github.com/tool3/svgfx/blob/master/examples/animated/layered-motion.ts) | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/motion-layered.before.svg" width="240" alt="motion-layered before"> | <img src="https://raw.githubusercontent.com/tool3/svgfx/master/examples/svgs/motion-layered.after.svg" width="240" alt="motion-layered after"> |

## The output keeps your artwork's shape

An SVG with rounded corners should come back with the same rounded corners. Two things
would otherwise break that, and svgfx handles both.

**Overlays.** `scanlines`, `vignette` and `halftone` lay something *over* the drawing,
and a naive overlay is a rectangle that paints straight over your corners.

**Filters.** `bloom`, `glow`, `chromaticAberration` and friends bleed *outward* by
design. On a rounded card that bleed lands outside the corner arc as a soft halo and
colour fringing, so the silhouette stops being yours.

So svgfx works out the shape your artwork actually has, and holds everything to it:

1. **A frame it can measure.** If your artwork sits on a full-bleed backdrop — a
   `<rect>` filling the viewBox, rounded or not, however deeply nested in groups — that
   rect's geometry becomes a `clipPath`, corner radius included. Overlays clip to it,
   and so does the finished result, so filter bleed is trimmed at the same arc.
2. **A clip you already declared.** A `clip-path` on the root `<svg>` is reused as-is.
3. **Anything else.** For artwork with no frame, overlays fall back to a mask built from
   the drawing's own alpha, and nothing is clipped globally — a glow on a logo still
   glows outward, which is the point of it.

Measured on a rounded terminal card with the `crt` preset: without this, 1853 pixels of
the silhouette differ from the input. With it, 2 — both antialiasing on the arc.

```ts
svgfx(roundedCard, [crt()])
```

Two escape hatches, at different levels:

```ts
svgfx(source, [scanlines({ clip: 'viewport' })])   // this overlay fills the frame
svgfx(source, [glow()], { clip: 'none' })          // let everything spill past the frame
```

The measured-frame path is free — one `clipPath`, shared by every effect that needs it.
The alpha fallback costs one extra render of the artwork per overlay effect.

## Motion

Effects with an `animate` option emit their own `<animate>` elements and CSS
keyframes into the output. Nothing is attached at runtime, so the file animates on its
own — as an `<img src>`, a CSS `background-image`, or inlined in a page.

```ts
const banner = svgfx(source, [scanlines({ animate: true, speed: 4 }), grain({ animate: true })])
```

Turn all of it off in one place when you need a still frame:

```ts
svgfx(source, [crt({ animate: true })], { animate: false })
```

### Animated SVGs go in, animated SVGs come out

An input that already animates keeps animating. `<animate>`, `<animateTransform>`,
`<set>` and CSS keyframes in the source are carried through untouched — the artwork is
wrapped, never rewritten — and the effect is applied to every frame as it plays.

```ts
const styled = svgfx(spinner, [crt()])
```

Your motion and svgfx's motion compose, in one self-contained file:

```ts
const banner = svgfx(spinner, [
  bloom({ radius: 6, threshold: 0.45 }),
  glitch({ intensity: 0.6, animate: true }),
  scanlines({ gap: 3, animate: true }),
  grain({ amount: 0.35, animate: true }),
])
```

Both are in the [animated examples](#animated-examples) above, rendered from a looping source.

## Writing your own effect

An effect is a name plus a list of stages, and there are two kinds of stage. A
**filter stage** contributes SVG filter primitives; consecutive filter stages are merged
into a single `<filter>` element automatically. A **layer stage** restructures the
artwork — wrapping it, duplicating it, or laying something over it.

```ts
import { defineEffect, filterStage, series } from '@svgfx/postprocessing'

export const solarize = ({ level = 0.5 } = {}) =>
  defineEffect('solarize', [
    filterStage(
      (io) => ({
        primitives: series(io, [
          { name: 'feComponentTransfer', children: [/* ... */] },
          { name: 'feColorMatrix', attributes: { type: 'saturate', values: 1.4 } },
        ]),
      }),
      { margin: 10 },
    ),
  ])
```

`series` wires `in` and `result` down the chain for you. Reach for `io.input` and
`io.output` directly when an effect needs to branch — `bloom` and `chromaticAberration`
are worked examples.

A layer stage receives the current artwork and returns the new artwork, plus anything
it needs in `<defs>` or in a `<style>` block:

```ts
import { cover, defineEffect, group, layerStage } from '@svgfx/postprocessing'

export const wash = ({ color = '#ff2d55' } = {}) =>
  defineEffect('wash', [
    layerStage((content, context) => ({
      content: group([content, cover(context.viewport, { fill: color, opacity: 0.2 })]),
    })),
  ])
```

The `context` handed to every stage carries the resolved `viewport`, a seeded
`random(key)` and `range(min, max, key)`, and `uid(hint)` for collision-free ids.
Randomness is keyed rather than sequential, which is what keeps output byte-stable.

## Recipes

**React**

```tsx
import { useMemo } from 'react'
import { svgfx, crt } from '@svgfx/postprocessing'

const Poster = ({ svg }: { svg: string }) => {
  const html = useMemo(() => svgfx(svg, [crt()]), [svg])
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Build step**

```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createPipeline, duotone, grain } from '@svgfx/postprocessing'

const brand = createPipeline([duotone(), grain()], { format: 'minify' })

readdirSync('icons').forEach((file) => {
  writeFileSync(`dist/${file}`, brand.apply(readFileSync(`icons/${file}`, 'utf8')))
})
```

**In the browser**

```ts
const styled = svgfx(await fetch('/logo.svg').then((response) => response.text()), [neon()])
document.querySelector('#logo')!.innerHTML = styled
```

## Notes

- **Browser support.** Everything is standard SVG 1.1 filters plus `mix-blend-mode`,
  which covers every current browser. `pixelate` leans on `feTile` and renders slightly
  differently in Safari.
- **Resolution.** Browsers rasterize filter regions at the SVG's own coordinate scale.
  If a filtered SVG is displayed much larger than its `viewBox`, the filtered parts can
  soften. Author at the size you intend to display, or scale the `viewBox` up.
- **Ids.** Generated ids are namespaced per document, so several svgfx outputs can live
  in one page. Pass `scope` if you want to name that namespace yourself.
- **Structure.** Non-rendering nodes — `<title>`, `<desc>`, `<defs>`, `<style>`,
  `<metadata>` — are left where they are. Only the drawn content is wrapped.

## Development

```bash
npm test           # 89 tests, no test framework needed
npm run typecheck
npm run build      # ESM + CJS + types
npm run examples   # renders examples/svgs
npm run gallery    # renders examples/gallery.html
```

The repo is TypeScript end to end — source, tests, examples and build scripts. Nothing
is written in JavaScript, and Node runs all of it directly.

## License

MIT © Tal Hayut
