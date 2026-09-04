# stouch

**Post-processing effects for any SVG.** Give it an SVG, get back an SVG — now with
scanlines, bloom, glitch, halftone, duotone or a dozen other looks baked in.

```ts
import { stouch, scanlines, bloom } from 'stouch'

const output = stouch(input, [bloom({ radius: 6 }), scanlines({ gap: 3 })])
```

- **Vector in, vector out.** No canvas, no rasterizing, no `<image>` payloads. The
  result is a real SVG that still scales, still has your paths in it, and still opens
  in a design tool.
- **Runs anywhere.** Zero runtime dependencies and no DOM. Node, Bun, Deno, edge
  functions, build scripts, browsers.
- **Deterministic.** Same input and settings produce byte-identical output, so it
  drops into a build pipeline and a snapshot test without surprises.
- **14 KB gzipped**, fully tree-shakeable. Import one effect, ship one effect.
- **Self-contained motion.** Opt into `animate` and the output loops on its own —
  inside an `<img>` tag, with no JavaScript attached.

---

## Install

```bash
npm install stouch
```

## Quick start

```ts
import { readFileSync, writeFileSync } from 'node:fs'
import { stouch, crt } from 'stouch'

const source = readFileSync('logo.svg', 'utf8')

writeFileSync('logo-crt.svg', stouch(source, [crt()]))
```

Effects are applied in order, exactly as you would stack them in an editor:

```ts
import { stouch, duotone, halftone, grain } from 'stouch'

const poster = stouch(source, [
  duotone({ shadow: '#111d4a', highlight: '#ff6b6b' }),
  halftone({ size: 5, angle: 15 }),
  grain({ amount: 0.4 }),
])
```

## API

### `stouch(source, effects?, settings?)`

Takes an SVG string, returns an SVG string.

```ts
const output = stouch(source, [bloom()], { seed: 'hero', format: 'pretty' })
```

### `createPipeline(effects, settings?)`

A reusable, named stack of effects. Build it once, apply it to many files.

```ts
import { createPipeline, duotone, grain } from 'stouch'

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
element.style.backgroundImage = `url("${toDataUri(stouch(source, [crt()]))}")`
```

URI-encoded by default (smaller and readable); pass `{ base64: true }` if you need it.

### Settings

| Setting   | Default      | What it does |
| --------- | ------------ | ------------ |
| `seed`    | `'stouch'`   | Seeds every random decision. Change it to reroll a glitch or a grain field; keep it to get the same output forever. |
| `prefix`  | `'stouch'`   | Prefix for every generated id and class. |
| `scope`   | auto         | Id namespace. Derived from the source, seed and effects so several stouch outputs can be inlined in one page without colliding. Set it yourself for stable, readable ids. |
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
| `scanlines` | `gap` `4`, `thickness` `1.5`, `opacity` `0.28`, `color` `'#000000'`, `angle` `0`, `blend` `'multiply'`, `animate` `false`, `speed` `6` |
| `chromaticAberration` | `offset` `2`, `angle` `0` |
| `glitch` | `intensity` `0.5`, `slices` `7`, `colorShift` `true`, `animate` `false`, `speed` `1` |
| `pixelate` | `size` `8` |
| `halftone` | `size` `6`, `angle` `45`, `levels` `4`, `color` `'#111111'`, `background` `'#ffffff'`, `keepSource` `false` |
| `vignette` | `amount` `0.65`, `radius` `0.6`, `softness` `0.7`, `color` `'#000000'` |
| `outline` | `width` `2`, `color` `'#000000'`, `position` `'outside' \| 'inside'` |
| `wave` | `amplitude` `12`, `frequency` `0.02`, `octaves` `2`, `animate` `false`, `speed` `0.15` |
| `emboss` | `depth` `1`, `angle` `135`, `desaturate` `true` |
| `sharpen` | `amount` `1` |

Every option is optional. `bloom()` on its own is tuned to look right.

### Presets

Finished looks, each one a `compose` of the effects above.

```ts
import { crt, vhs, riso, xerox, neon, film, newsprint, cyberpunk } from 'stouch'

stouch(source, [crt({ animate: true })])
stouch(source, [riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })])
stouch(source, [neon({ color: '#4cc9f0' })])
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

## Examples

Every effect and preset ships as a runnable TypeScript script under
[`examples/`](examples) — the linked name opens the code, which shows the exact options
used. Each script writes a before/after pair into `examples/svgs`, and runs as-is with
no build step.

```bash
npm run examples                    # render all 37
node examples/effects/halftone.ts   # or just one
npm run gallery                     # side-by-side overview page
```

### Effect examples

| Example | Before | After |
| ------- | ------ | ----- |
| [`blur`](examples/effects/blur.ts) | <img src="examples/svgs/blur.before.svg" width="240" alt="blur before"> | <img src="examples/svgs/blur.after.svg" width="240" alt="blur after"> |
| [`bloom`](examples/effects/bloom.ts) | <img src="examples/svgs/bloom.before.svg" width="240" alt="bloom before"> | <img src="examples/svgs/bloom.after.svg" width="240" alt="bloom after"> |
| [`glow`](examples/effects/glow.ts) | <img src="examples/svgs/glow.before.svg" width="240" alt="glow before"> | <img src="examples/svgs/glow.after.svg" width="240" alt="glow after"> |
| [`shadow`](examples/effects/shadow.ts) | <img src="examples/svgs/shadow.before.svg" width="240" alt="shadow before"> | <img src="examples/svgs/shadow.after.svg" width="240" alt="shadow after"> |
| [`grayscale`](examples/effects/grayscale.ts) | <img src="examples/svgs/grayscale.before.svg" width="240" alt="grayscale before"> | <img src="examples/svgs/grayscale.after.svg" width="240" alt="grayscale after"> |
| [`saturate`](examples/effects/saturate.ts) | <img src="examples/svgs/saturate.before.svg" width="240" alt="saturate before"> | <img src="examples/svgs/saturate.after.svg" width="240" alt="saturate after"> |
| [`hue-rotate`](examples/effects/hue-rotate.ts) | <img src="examples/svgs/hue-rotate.before.svg" width="240" alt="hue-rotate before"> | <img src="examples/svgs/hue-rotate.after.svg" width="240" alt="hue-rotate after"> |
| [`invert`](examples/effects/invert.ts) | <img src="examples/svgs/invert.before.svg" width="240" alt="invert before"> | <img src="examples/svgs/invert.after.svg" width="240" alt="invert after"> |
| [`brightness`](examples/effects/brightness.ts) | <img src="examples/svgs/brightness.before.svg" width="240" alt="brightness before"> | <img src="examples/svgs/brightness.after.svg" width="240" alt="brightness after"> |
| [`contrast`](examples/effects/contrast.ts) | <img src="examples/svgs/contrast.before.svg" width="240" alt="contrast before"> | <img src="examples/svgs/contrast.after.svg" width="240" alt="contrast after"> |
| [`sepia`](examples/effects/sepia.ts) | <img src="examples/svgs/sepia.before.svg" width="240" alt="sepia before"> | <img src="examples/svgs/sepia.after.svg" width="240" alt="sepia after"> |
| [`fade`](examples/effects/fade.ts) | <img src="examples/svgs/fade.before.svg" width="240" alt="fade before"> | <img src="examples/svgs/fade.after.svg" width="240" alt="fade after"> |
| [`posterize`](examples/effects/posterize.ts) | <img src="examples/svgs/posterize.before.svg" width="240" alt="posterize before"> | <img src="examples/svgs/posterize.after.svg" width="240" alt="posterize after"> |
| [`threshold`](examples/effects/threshold.ts) | <img src="examples/svgs/threshold.before.svg" width="240" alt="threshold before"> | <img src="examples/svgs/threshold.after.svg" width="240" alt="threshold after"> |
| [`duotone`](examples/effects/duotone.ts) | <img src="examples/svgs/duotone.before.svg" width="240" alt="duotone before"> | <img src="examples/svgs/duotone.after.svg" width="240" alt="duotone after"> |
| [`tint`](examples/effects/tint.ts) | <img src="examples/svgs/tint.before.svg" width="240" alt="tint before"> | <img src="examples/svgs/tint.after.svg" width="240" alt="tint after"> |
| [`grain`](examples/effects/grain.ts) | <img src="examples/svgs/grain.before.svg" width="240" alt="grain before"> | <img src="examples/svgs/grain.after.svg" width="240" alt="grain after"> |
| [`scanlines`](examples/effects/scanlines.ts) | <img src="examples/svgs/scanlines.before.svg" width="240" alt="scanlines before"> | <img src="examples/svgs/scanlines.after.svg" width="240" alt="scanlines after"> |
| [`chromatic-aberration`](examples/effects/chromatic-aberration.ts) | <img src="examples/svgs/chromatic-aberration.before.svg" width="240" alt="chromatic-aberration before"> | <img src="examples/svgs/chromatic-aberration.after.svg" width="240" alt="chromatic-aberration after"> |
| [`glitch`](examples/effects/glitch.ts) | <img src="examples/svgs/glitch.before.svg" width="240" alt="glitch before"> | <img src="examples/svgs/glitch.after.svg" width="240" alt="glitch after"> |
| [`pixelate`](examples/effects/pixelate.ts) | <img src="examples/svgs/pixelate.before.svg" width="240" alt="pixelate before"> | <img src="examples/svgs/pixelate.after.svg" width="240" alt="pixelate after"> |
| [`halftone`](examples/effects/halftone.ts) | <img src="examples/svgs/halftone.before.svg" width="240" alt="halftone before"> | <img src="examples/svgs/halftone.after.svg" width="240" alt="halftone after"> |
| [`vignette`](examples/effects/vignette.ts) | <img src="examples/svgs/vignette.before.svg" width="240" alt="vignette before"> | <img src="examples/svgs/vignette.after.svg" width="240" alt="vignette after"> |
| [`outline`](examples/effects/outline.ts) | <img src="examples/svgs/outline.before.svg" width="240" alt="outline before"> | <img src="examples/svgs/outline.after.svg" width="240" alt="outline after"> |
| [`wave`](examples/effects/wave.ts) | <img src="examples/svgs/wave.before.svg" width="240" alt="wave before"> | <img src="examples/svgs/wave.after.svg" width="240" alt="wave after"> |
| [`emboss`](examples/effects/emboss.ts) | <img src="examples/svgs/emboss.before.svg" width="240" alt="emboss before"> | <img src="examples/svgs/emboss.after.svg" width="240" alt="emboss after"> |
| [`sharpen`](examples/effects/sharpen.ts) | <img src="examples/svgs/sharpen.before.svg" width="240" alt="sharpen before"> | <img src="examples/svgs/sharpen.after.svg" width="240" alt="sharpen after"> |

### Preset examples

| Example | Before | After |
| ------- | ------ | ----- |
| [`crt`](examples/presets/crt.ts) | <img src="examples/svgs/crt.before.svg" width="240" alt="crt before"> | <img src="examples/svgs/crt.after.svg" width="240" alt="crt after"> |
| [`cyberpunk`](examples/presets/cyberpunk.ts) | <img src="examples/svgs/cyberpunk.before.svg" width="240" alt="cyberpunk before"> | <img src="examples/svgs/cyberpunk.after.svg" width="240" alt="cyberpunk after"> |
| [`film`](examples/presets/film.ts) | <img src="examples/svgs/film.before.svg" width="240" alt="film before"> | <img src="examples/svgs/film.after.svg" width="240" alt="film after"> |
| [`neon`](examples/presets/neon.ts) | <img src="examples/svgs/neon.before.svg" width="240" alt="neon before"> | <img src="examples/svgs/neon.after.svg" width="240" alt="neon after"> |
| [`newsprint`](examples/presets/newsprint.ts) | <img src="examples/svgs/newsprint.before.svg" width="240" alt="newsprint before"> | <img src="examples/svgs/newsprint.after.svg" width="240" alt="newsprint after"> |
| [`riso`](examples/presets/riso.ts) | <img src="examples/svgs/riso.before.svg" width="240" alt="riso before"> | <img src="examples/svgs/riso.after.svg" width="240" alt="riso after"> |
| [`vhs`](examples/presets/vhs.ts) | <img src="examples/svgs/vhs.before.svg" width="240" alt="vhs before"> | <img src="examples/svgs/vhs.after.svg" width="240" alt="vhs after"> |
| [`xerox`](examples/presets/xerox.ts) | <img src="examples/svgs/xerox.before.svg" width="240" alt="xerox before"> | <img src="examples/svgs/xerox.after.svg" width="240" alt="xerox after"> |

### Animated examples

Applied to `examples/sources/motion.svg`, which loops on its own in plain SMIL. Both
columns are playing: the source keeps its motion, and the second adds stouch's on top.

| Example | Before | After |
| ------- | ------ | ----- |
| [`motion-crt`](examples/animated/preset-over-motion.ts) | <img src="examples/svgs/motion-crt.before.svg" width="240" alt="motion-crt before"> | <img src="examples/svgs/motion-crt.after.svg" width="240" alt="motion-crt after"> |
| [`motion-layered`](examples/animated/layered-motion.ts) | <img src="examples/svgs/motion-layered.before.svg" width="240" alt="motion-layered before"> | <img src="examples/svgs/motion-layered.after.svg" width="240" alt="motion-layered after"> |

## Motion

Effects with an `animate` option emit their own `<animate>` elements and CSS
keyframes into the output. Nothing is attached at runtime, so the file animates on its
own — as an `<img src>`, a CSS `background-image`, or inlined in a page.

```ts
const banner = stouch(source, [scanlines({ animate: true, speed: 4 }), grain({ animate: true })])
```

Turn all of it off in one place when you need a still frame:

```ts
stouch(source, [crt({ animate: true })], { animate: false })
```

### Animated SVGs go in, animated SVGs come out

An input that already animates keeps animating. `<animate>`, `<animateTransform>`,
`<set>` and CSS keyframes in the source are carried through untouched — the artwork is
wrapped, never rewritten — and the effect is applied to every frame as it plays.

```ts
const styled = stouch(spinner, [crt()])
```

Your motion and stouch's motion compose, in one self-contained file:

```ts
const banner = stouch(spinner, [
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
import { defineEffect, filterStage, series } from 'stouch'

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
import { cover, defineEffect, group, layerStage } from 'stouch'

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
import { stouch, crt } from 'stouch'

const Poster = ({ svg }: { svg: string }) => {
  const html = useMemo(() => stouch(svg, [crt()]), [svg])
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

**Build step**

```js
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createPipeline, duotone, grain } from 'stouch'

const brand = createPipeline([duotone(), grain()], { format: 'minify' })

readdirSync('icons').forEach((file) => {
  writeFileSync(`dist/${file}`, brand.apply(readFileSync(`icons/${file}`, 'utf8')))
})
```

**In the browser**

```ts
const styled = stouch(await fetch('/logo.svg').then((response) => response.text()), [neon()])
document.querySelector('#logo')!.innerHTML = styled
```

## Notes

- **Browser support.** Everything is standard SVG 1.1 filters plus `mix-blend-mode`,
  which covers every current browser. `pixelate` leans on `feTile` and renders slightly
  differently in Safari.
- **Resolution.** Browsers rasterize filter regions at the SVG's own coordinate scale.
  If a filtered SVG is displayed much larger than its `viewBox`, the filtered parts can
  soften. Author at the size you intend to display, or scale the `viewBox` up.
- **Ids.** Generated ids are namespaced per document, so several stouch outputs can live
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
