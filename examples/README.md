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
import { svgfx, halftone } from '../../src/index.ts'
import { load, save } from '../support.ts'

const source = load('scene.svg')

const output = svgfx(source, [halftone({ size: 5, angle: 15 })])

save('halftone', source, output)
```

In your own project that first import is `from '@svgfx/postprocessing'`; here it points at the source
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

| Example | Before | After | Before (animated) | After (animated) |
| ------- | ------ | ----- | ----------------- | ---------------- |
| [`blur`](effects/blur.ts) | <img src="svgs/blur.before.svg" width="180" alt="blur before"> | <img src="svgs/blur.after.svg" width="180" alt="blur after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/blur.motion.after.svg" width="140" alt="blur on the tetrahedron"> |
| [`bloom`](effects/bloom.ts) | <img src="svgs/bloom.before.svg" width="180" alt="bloom before"> | <img src="svgs/bloom.after.svg" width="180" alt="bloom after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/bloom.motion.after.svg" width="140" alt="bloom on the tetrahedron"> |
| [`glow`](effects/glow.ts) | <img src="svgs/glow.before.svg" width="180" alt="glow before"> | <img src="svgs/glow.after.svg" width="180" alt="glow after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/glow.motion.after.svg" width="140" alt="glow on the tetrahedron"> |
| [`shadow`](effects/shadow.ts) | <img src="svgs/shadow.before.svg" width="180" alt="shadow before"> | <img src="svgs/shadow.after.svg" width="180" alt="shadow after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/shadow.motion.after.svg" width="140" alt="shadow on the tetrahedron"> |
| [`grayscale`](effects/grayscale.ts) | <img src="svgs/grayscale.before.svg" width="180" alt="grayscale before"> | <img src="svgs/grayscale.after.svg" width="180" alt="grayscale after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/grayscale.motion.after.svg" width="140" alt="grayscale on the tetrahedron"> |
| [`saturate`](effects/saturate.ts) | <img src="svgs/saturate.before.svg" width="180" alt="saturate before"> | <img src="svgs/saturate.after.svg" width="180" alt="saturate after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/saturate.motion.after.svg" width="140" alt="saturate on the tetrahedron"> |
| [`hue-rotate`](effects/hue-rotate.ts) | <img src="svgs/hue-rotate.before.svg" width="180" alt="hue-rotate before"> | <img src="svgs/hue-rotate.after.svg" width="180" alt="hue-rotate after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/hue-rotate.motion.after.svg" width="140" alt="hue-rotate on the tetrahedron"> |
| [`invert`](effects/invert.ts) | <img src="svgs/invert.before.svg" width="180" alt="invert before"> | <img src="svgs/invert.after.svg" width="180" alt="invert after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/invert.motion.after.svg" width="140" alt="invert on the tetrahedron"> |
| [`brightness`](effects/brightness.ts) | <img src="svgs/brightness.before.svg" width="180" alt="brightness before"> | <img src="svgs/brightness.after.svg" width="180" alt="brightness after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/brightness.motion.after.svg" width="140" alt="brightness on the tetrahedron"> |
| [`contrast`](effects/contrast.ts) | <img src="svgs/contrast.before.svg" width="180" alt="contrast before"> | <img src="svgs/contrast.after.svg" width="180" alt="contrast after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/contrast.motion.after.svg" width="140" alt="contrast on the tetrahedron"> |
| [`sepia`](effects/sepia.ts) | <img src="svgs/sepia.before.svg" width="180" alt="sepia before"> | <img src="svgs/sepia.after.svg" width="180" alt="sepia after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/sepia.motion.after.svg" width="140" alt="sepia on the tetrahedron"> |
| [`fade`](effects/fade.ts) | <img src="svgs/fade.before.svg" width="180" alt="fade before"> | <img src="svgs/fade.after.svg" width="180" alt="fade after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/fade.motion.after.svg" width="140" alt="fade on the tetrahedron"> |
| [`posterize`](effects/posterize.ts) | <img src="svgs/posterize.before.svg" width="180" alt="posterize before"> | <img src="svgs/posterize.after.svg" width="180" alt="posterize after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/posterize.motion.after.svg" width="140" alt="posterize on the tetrahedron"> |
| [`threshold`](effects/threshold.ts) | <img src="svgs/threshold.before.svg" width="180" alt="threshold before"> | <img src="svgs/threshold.after.svg" width="180" alt="threshold after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/threshold.motion.after.svg" width="140" alt="threshold on the tetrahedron"> |
| [`duotone`](effects/duotone.ts) | <img src="svgs/duotone.before.svg" width="180" alt="duotone before"> | <img src="svgs/duotone.after.svg" width="180" alt="duotone after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/duotone.motion.after.svg" width="140" alt="duotone on the tetrahedron"> |
| [`tint`](effects/tint.ts) | <img src="svgs/tint.before.svg" width="180" alt="tint before"> | <img src="svgs/tint.after.svg" width="180" alt="tint after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/tint.motion.after.svg" width="140" alt="tint on the tetrahedron"> |
| [`grain`](effects/grain.ts) | <img src="svgs/grain.before.svg" width="180" alt="grain before"> | <img src="svgs/grain.after.svg" width="180" alt="grain after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/grain.motion.after.svg" width="140" alt="grain on the tetrahedron"> |
| [`scanlines`](effects/scanlines.ts) | <img src="svgs/scanlines.before.svg" width="180" alt="scanlines before"> | <img src="svgs/scanlines.after.svg" width="180" alt="scanlines after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/scanlines.motion.after.svg" width="140" alt="scanlines on the tetrahedron"> |
| [`chromatic-aberration`](effects/chromatic-aberration.ts) | <img src="svgs/chromatic-aberration.before.svg" width="180" alt="chromatic-aberration before"> | <img src="svgs/chromatic-aberration.after.svg" width="180" alt="chromatic-aberration after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/chromatic-aberration.motion.after.svg" width="140" alt="chromatic-aberration on the tetrahedron"> |
| [`glitch`](effects/glitch.ts) | <img src="svgs/glitch.before.svg" width="180" alt="glitch before"> | <img src="svgs/glitch.after.svg" width="180" alt="glitch after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/glitch.motion.after.svg" width="140" alt="glitch on the tetrahedron"> |
| [`pixelate`](effects/pixelate.ts) | <img src="svgs/pixelate.before.svg" width="180" alt="pixelate before"> | <img src="svgs/pixelate.after.svg" width="180" alt="pixelate after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/pixelate.motion.after.svg" width="140" alt="pixelate on the tetrahedron"> |
| [`halftone`](effects/halftone.ts) | <img src="svgs/halftone.before.svg" width="180" alt="halftone before"> | <img src="svgs/halftone.after.svg" width="180" alt="halftone after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/halftone.motion.after.svg" width="140" alt="halftone on the tetrahedron"> |
| [`vignette`](effects/vignette.ts) | <img src="svgs/vignette.before.svg" width="180" alt="vignette before"> | <img src="svgs/vignette.after.svg" width="180" alt="vignette after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/vignette.motion.after.svg" width="140" alt="vignette on the tetrahedron"> |
| [`outline`](effects/outline.ts) | <img src="svgs/outline.before.svg" width="180" alt="outline before"> | <img src="svgs/outline.after.svg" width="180" alt="outline after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/outline.motion.after.svg" width="140" alt="outline on the tetrahedron"> |
| [`wave`](effects/wave.ts) | <img src="svgs/wave.before.svg" width="180" alt="wave before"> | <img src="svgs/wave.after.svg" width="180" alt="wave after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/wave.motion.after.svg" width="140" alt="wave on the tetrahedron"> |
| [`emboss`](effects/emboss.ts) | <img src="svgs/emboss.before.svg" width="180" alt="emboss before"> | <img src="svgs/emboss.after.svg" width="180" alt="emboss after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/emboss.motion.after.svg" width="140" alt="emboss on the tetrahedron"> |
| [`sharpen`](effects/sharpen.ts) | <img src="svgs/sharpen.before.svg" width="180" alt="sharpen before"> | <img src="svgs/sharpen.after.svg" width="180" alt="sharpen after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/sharpen.motion.after.svg" width="140" alt="sharpen on the tetrahedron"> |

## Presets

| Example | Before | After | Before (animated) | After (animated) |
| ------- | ------ | ----- | ----------------- | ---------------- |
| [`crt`](presets/crt.ts) | <img src="svgs/crt.before.svg" width="180" alt="crt before"> | <img src="svgs/crt.after.svg" width="180" alt="crt after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/crt.motion.after.svg" width="140" alt="crt on the tetrahedron"> |
| [`cyberpunk`](presets/cyberpunk.ts) | <img src="svgs/cyberpunk.before.svg" width="180" alt="cyberpunk before"> | <img src="svgs/cyberpunk.after.svg" width="180" alt="cyberpunk after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/cyberpunk.motion.after.svg" width="140" alt="cyberpunk on the tetrahedron"> |
| [`film-3d`](presets/film-3d.ts) | <img src="svgs/film-3d.before.svg" width="180" alt="film-3d before"> | <img src="svgs/film-3d.after.svg" width="180" alt="film-3d after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/film-3d.motion.after.svg" width="140" alt="film-3d on the tetrahedron"> |
| [`film`](presets/film.ts) | <img src="svgs/film.before.svg" width="180" alt="film before"> | <img src="svgs/film.after.svg" width="180" alt="film after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/film.motion.after.svg" width="140" alt="film on the tetrahedron"> |
| [`neon`](presets/neon.ts) | <img src="svgs/neon.before.svg" width="180" alt="neon before"> | <img src="svgs/neon.after.svg" width="180" alt="neon after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/neon.motion.after.svg" width="140" alt="neon on the tetrahedron"> |
| [`newsprint`](presets/newsprint.ts) | <img src="svgs/newsprint.before.svg" width="180" alt="newsprint before"> | <img src="svgs/newsprint.after.svg" width="180" alt="newsprint after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/newsprint.motion.after.svg" width="140" alt="newsprint on the tetrahedron"> |
| [`riso`](presets/riso.ts) | <img src="svgs/riso.before.svg" width="180" alt="riso before"> | <img src="svgs/riso.after.svg" width="180" alt="riso after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/riso.motion.after.svg" width="140" alt="riso on the tetrahedron"> |
| [`vhs`](presets/vhs.ts) | <img src="svgs/vhs.before.svg" width="180" alt="vhs before"> | <img src="svgs/vhs.after.svg" width="180" alt="vhs after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/vhs.motion.after.svg" width="140" alt="vhs on the tetrahedron"> |
| [`xerox`](presets/xerox.ts) | <img src="svgs/xerox.before.svg" width="180" alt="xerox before"> | <img src="svgs/xerox.after.svg" width="180" alt="xerox after"> | <img src="sources/tetrahedron.svg" width="140" alt="tetrahedron before"> | <img src="svgs/xerox.motion.after.svg" width="140" alt="xerox on the tetrahedron"> |

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
svgfx(source, [scanlines({ animate: true, speed: 4 }), grain({ animate: true })])
```

`npm run gallery` renders every effect and preset side by side into
`examples/gallery.html` for a single-page overview, including the animated ones.
