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
| `sources/` | The three input drawings: `scene.svg` (full-bleed art), `mark.svg` (shapes on transparency) and `motion.svg` (already animated) |
| `effects/` | One script per effect |
| `presets/` | One script per preset |
| `animated/` | Effects applied to an SVG that already animates |
| `svgs/` | Output — `<name>.before.svg` and `<name>.after.svg` for every example |
| `support.ts` | `load` and `save` helpers, so each example stays about the effect |

Effects that reshape edges or cast light — `glow`, `shadow`, `outline`, `emboss`,
`pixelate`, `wave`, `fade`, `neon` — run against `mark.svg`, because they need
transparency around the artwork to show what they do. The rest run against `scene.svg`.

## Effects

| Example | Call |
| ------- | ---- |
| [blur](effects/blur.ts) | `blur({ radius: 4 })` |
| [bloom](effects/bloom.ts) | `bloom({ radius: 8, threshold: 0.5 })` |
| [glow](effects/glow.ts) | `glow({ color: '#ff2d55', radius: 8, intensity: 1.5 })` |
| [shadow](effects/shadow.ts) | `shadow({ x: 6, y: 8, blur: 6, opacity: 0.55 })` |
| [grayscale](effects/grayscale.ts) | `grayscale()` |
| [saturate](effects/saturate.ts) | `saturate({ amount: 2.2 })` |
| [hue-rotate](effects/hue-rotate.ts) | `hueRotate({ angle: 140 })` |
| [invert](effects/invert.ts) | `invert()` |
| [brightness](effects/brightness.ts) | `brightness({ amount: 1.35 })` |
| [contrast](effects/contrast.ts) | `contrast({ amount: 1.7 })` |
| [sepia](effects/sepia.ts) | `sepia()` |
| [fade](effects/fade.ts) | `fade({ amount: 0.45 })` |
| [posterize](effects/posterize.ts) | `posterize({ steps: 4 })` |
| [threshold](effects/threshold.ts) | `threshold({ level: 0.5, dark: '#101010', light: '#f6f4ef' })` |
| [duotone](effects/duotone.ts) | `duotone({ shadow: '#111d4a', highlight: '#ffd166' })` |
| [tint](effects/tint.ts) | `tint({ color: '#00f5d4', amount: 0.5 })` |
| [grain](effects/grain.ts) | `grain({ amount: 0.5 })` |
| [scanlines](effects/scanlines.ts) | `scanlines({ gap: 3, thickness: 1.2, opacity: 0.35 })` |
| [chromatic-aberration](effects/chromatic-aberration.ts) | `chromaticAberration({ offset: 4 })` |
| [glitch](effects/glitch.ts) | `glitch({ intensity: 0.8, slices: 10 })` |
| [pixelate](effects/pixelate.ts) | `pixelate({ size: 10 })` |
| [halftone](effects/halftone.ts) | `halftone({ size: 5, angle: 15 })` |
| [vignette](effects/vignette.ts) | `vignette({ amount: 0.8, radius: 0.5 })` |
| [outline](effects/outline.ts) | `outline({ width: 3, color: '#f7f7f2' })` |
| [wave](effects/wave.ts) | `wave({ amplitude: 16, frequency: 0.03 })` |
| [emboss](effects/emboss.ts) | `emboss({ depth: 1.4 })` |
| [sharpen](effects/sharpen.ts) | `sharpen({ amount: 4 })` |

## Presets

| Example | Call |
| ------- | ---- |
| [crt](presets/crt.ts) | `crt()` |
| [vhs](presets/vhs.ts) | `vhs()` |
| [riso](presets/riso.ts) | `riso({ shadow: '#2b3a67', highlight: '#ff5a5f' })` |
| [xerox](presets/xerox.ts) | `xerox()` |
| [neon](presets/neon.ts) | `neon({ color: '#4cc9f0' })` |
| [film](presets/film.ts) | `film()` |
| [newsprint](presets/newsprint.ts) | `newsprint()` |
| [cyberpunk](presets/cyberpunk.ts) | `cyberpunk()` |

## Already animated

`sources/motion.svg` loops on its own — a pulsing circle, a spinning square, a bar
sliding back and forth, a stroke dashing along a path, all in plain SMIL. Effects are
applied to it without disturbing any of that.

| Example | What it shows |
| ------- | ------------- |
| [preset-over-motion](animated/preset-over-motion.ts) | `crt()` over a moving drawing. The motion is untouched; the effect renders on every frame. |
| [layered-motion](animated/layered-motion.ts) | The drawing's own motion plus stouch's — animated glitch, rolling scanlines and shifting grain on top of it. |

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
