# Examples

Every effect and preset, as a script you can run.

```bash
npm run examples                    # render all 37
node examples/effects/halftone.ts   # or just one
```

Every example is TypeScript and runs as-is — Node 26 strips types natively, and ts-node
or tsx work too. No build step, nothing to compile first.

Each script reads a source from `sources/`, applies one effect, and writes a
before/after pair into `svgs/`:

```ts
import { stouch, halftone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = stouch(source, [halftone({ size: 5, angle: 15 })])

save('halftone', source, output)
```

In your own project that first import is `from 'stouch'`; here it points at the source
so the examples run against your working copy without a build.

## Layout

| Path | Contents |
| ---- | -------- |
| `sources/` | The four input drawings: `scene.svg` (full-bleed art), `mark.svg` (shapes on transparency), `tones.svg` (a full tonal range) and `motion.svg` (already animated) |
| `effects/` | One script per effect |
| `presets/` | One script per preset |
| `animated/` | Effects applied to an SVG that already animates |
| `svgs/` | Output — `<name>.before.svg` and `<name>.after.svg` for every example |
| `support.ts` | `load` and `save` helpers, so each example stays about the effect |

Each example runs against the source that shows it best:

- `mark.svg` for effects that reshape edges or cast light — `glow`, `shadow`, `outline`,
  `emboss`, `pixelate`, `wave`, `fade`, `neon` — because they need transparency around
  the artwork to have somewhere to go.
- `tones.svg` for effects that remap tone — `threshold`, `duotone`, `halftone`, `xerox`,
  `newsprint` — because a white-to-black ramp and a shaded sphere show the mapping.
- `scene.svg` for everything else.

### Effects

| Example | Before | After |
| ------- | ------ | ----- |
| [`blur`](effects/blur.ts) | <img src="svgs/blur.before.svg" width="240" alt="blur before"> | <img src="svgs/blur.after.svg" width="240" alt="blur after"> |
| [`bloom`](effects/bloom.ts) | <img src="svgs/bloom.before.svg" width="240" alt="bloom before"> | <img src="svgs/bloom.after.svg" width="240" alt="bloom after"> |
| [`glow`](effects/glow.ts) | <img src="svgs/glow.before.svg" width="240" alt="glow before"> | <img src="svgs/glow.after.svg" width="240" alt="glow after"> |
| [`shadow`](effects/shadow.ts) | <img src="svgs/shadow.before.svg" width="240" alt="shadow before"> | <img src="svgs/shadow.after.svg" width="240" alt="shadow after"> |
| [`grayscale`](effects/grayscale.ts) | <img src="svgs/grayscale.before.svg" width="240" alt="grayscale before"> | <img src="svgs/grayscale.after.svg" width="240" alt="grayscale after"> |
| [`saturate`](effects/saturate.ts) | <img src="svgs/saturate.before.svg" width="240" alt="saturate before"> | <img src="svgs/saturate.after.svg" width="240" alt="saturate after"> |
| [`hue-rotate`](effects/hue-rotate.ts) | <img src="svgs/hue-rotate.before.svg" width="240" alt="hue-rotate before"> | <img src="svgs/hue-rotate.after.svg" width="240" alt="hue-rotate after"> |
| [`invert`](effects/invert.ts) | <img src="svgs/invert.before.svg" width="240" alt="invert before"> | <img src="svgs/invert.after.svg" width="240" alt="invert after"> |
| [`brightness`](effects/brightness.ts) | <img src="svgs/brightness.before.svg" width="240" alt="brightness before"> | <img src="svgs/brightness.after.svg" width="240" alt="brightness after"> |
| [`contrast`](effects/contrast.ts) | <img src="svgs/contrast.before.svg" width="240" alt="contrast before"> | <img src="svgs/contrast.after.svg" width="240" alt="contrast after"> |
| [`sepia`](effects/sepia.ts) | <img src="svgs/sepia.before.svg" width="240" alt="sepia before"> | <img src="svgs/sepia.after.svg" width="240" alt="sepia after"> |
| [`fade`](effects/fade.ts) | <img src="svgs/fade.before.svg" width="240" alt="fade before"> | <img src="svgs/fade.after.svg" width="240" alt="fade after"> |
| [`posterize`](effects/posterize.ts) | <img src="svgs/posterize.before.svg" width="240" alt="posterize before"> | <img src="svgs/posterize.after.svg" width="240" alt="posterize after"> |
| [`threshold`](effects/threshold.ts) | <img src="svgs/threshold.before.svg" width="240" alt="threshold before"> | <img src="svgs/threshold.after.svg" width="240" alt="threshold after"> |
| [`duotone`](effects/duotone.ts) | <img src="svgs/duotone.before.svg" width="240" alt="duotone before"> | <img src="svgs/duotone.after.svg" width="240" alt="duotone after"> |
| [`tint`](effects/tint.ts) | <img src="svgs/tint.before.svg" width="240" alt="tint before"> | <img src="svgs/tint.after.svg" width="240" alt="tint after"> |
| [`grain`](effects/grain.ts) | <img src="svgs/grain.before.svg" width="240" alt="grain before"> | <img src="svgs/grain.after.svg" width="240" alt="grain after"> |
| [`scanlines`](effects/scanlines.ts) | <img src="svgs/scanlines.before.svg" width="240" alt="scanlines before"> | <img src="svgs/scanlines.after.svg" width="240" alt="scanlines after"> |
| [`chromatic-aberration`](effects/chromatic-aberration.ts) | <img src="svgs/chromatic-aberration.before.svg" width="240" alt="chromatic-aberration before"> | <img src="svgs/chromatic-aberration.after.svg" width="240" alt="chromatic-aberration after"> |
| [`glitch`](effects/glitch.ts) | <img src="svgs/glitch.before.svg" width="240" alt="glitch before"> | <img src="svgs/glitch.after.svg" width="240" alt="glitch after"> |
| [`pixelate`](effects/pixelate.ts) | <img src="svgs/pixelate.before.svg" width="240" alt="pixelate before"> | <img src="svgs/pixelate.after.svg" width="240" alt="pixelate after"> |
| [`halftone`](effects/halftone.ts) | <img src="svgs/halftone.before.svg" width="240" alt="halftone before"> | <img src="svgs/halftone.after.svg" width="240" alt="halftone after"> |
| [`vignette`](effects/vignette.ts) | <img src="svgs/vignette.before.svg" width="240" alt="vignette before"> | <img src="svgs/vignette.after.svg" width="240" alt="vignette after"> |
| [`outline`](effects/outline.ts) | <img src="svgs/outline.before.svg" width="240" alt="outline before"> | <img src="svgs/outline.after.svg" width="240" alt="outline after"> |
| [`wave`](effects/wave.ts) | <img src="svgs/wave.before.svg" width="240" alt="wave before"> | <img src="svgs/wave.after.svg" width="240" alt="wave after"> |
| [`emboss`](effects/emboss.ts) | <img src="svgs/emboss.before.svg" width="240" alt="emboss before"> | <img src="svgs/emboss.after.svg" width="240" alt="emboss after"> |
| [`sharpen`](effects/sharpen.ts) | <img src="svgs/sharpen.before.svg" width="240" alt="sharpen before"> | <img src="svgs/sharpen.after.svg" width="240" alt="sharpen after"> |

## Presets

| Example | Before | After |
| ------- | ------ | ----- |
| [`crt`](presets/crt.ts) | <img src="svgs/crt.before.svg" width="240" alt="crt before"> | <img src="svgs/crt.after.svg" width="240" alt="crt after"> |
| [`cyberpunk`](presets/cyberpunk.ts) | <img src="svgs/cyberpunk.before.svg" width="240" alt="cyberpunk before"> | <img src="svgs/cyberpunk.after.svg" width="240" alt="cyberpunk after"> |
| [`film`](presets/film.ts) | <img src="svgs/film.before.svg" width="240" alt="film before"> | <img src="svgs/film.after.svg" width="240" alt="film after"> |
| [`neon`](presets/neon.ts) | <img src="svgs/neon.before.svg" width="240" alt="neon before"> | <img src="svgs/neon.after.svg" width="240" alt="neon after"> |
| [`newsprint`](presets/newsprint.ts) | <img src="svgs/newsprint.before.svg" width="240" alt="newsprint before"> | <img src="svgs/newsprint.after.svg" width="240" alt="newsprint after"> |
| [`riso`](presets/riso.ts) | <img src="svgs/riso.before.svg" width="240" alt="riso before"> | <img src="svgs/riso.after.svg" width="240" alt="riso after"> |
| [`vhs`](presets/vhs.ts) | <img src="svgs/vhs.before.svg" width="240" alt="vhs before"> | <img src="svgs/vhs.after.svg" width="240" alt="vhs after"> |
| [`xerox`](presets/xerox.ts) | <img src="svgs/xerox.before.svg" width="240" alt="xerox before"> | <img src="svgs/xerox.after.svg" width="240" alt="xerox after"> |

## Already animated

`sources/motion.svg` loops on its own — a pulsing circle, a spinning square, a bar
sliding back and forth, a stroke dashing along a path, all in plain SMIL. Effects are
applied to it without disturbing any of that.

| Example | Before | After |
| ------- | ------ | ----- |
| [`motion-crt`](animated/preset-over-motion.ts) | <img src="svgs/motion-crt.before.svg" width="240" alt="motion-crt before"> | <img src="svgs/motion-crt.after.svg" width="240" alt="motion-crt after"> |
| [`motion-layered`](animated/layered-motion.ts) | <img src="svgs/motion-layered.before.svg" width="240" alt="motion-layered before"> | <img src="svgs/motion-layered.after.svg" width="240" alt="motion-layered after"> |

Open `svgs/motion-crt.after.svg` or `svgs/motion-layered.after.svg` in a browser: one
file, no JavaScript, everything moving.

## Going further

The examples are deliberately one effect each. In real use they stack, and effects that
take an `animate` option will loop on their own once you turn it on:

```ts
stouch(source, [scanlines({ animate: true, speed: 4 }), grain({ animate: true })])
```

`npm run gallery` renders every effect and preset side by side into
`examples/gallery.html` for a single-page overview, including the animated ones.
