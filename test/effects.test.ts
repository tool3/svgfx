import test from 'node:test'
import assert from 'node:assert/strict'
import { svgfx } from '../src/core/api.ts'
import { blur } from '../src/effects/blur.ts'
import { bloom } from '../src/effects/bloom.ts'
import { glow } from '../src/effects/glow.ts'
import { shadow } from '../src/effects/shadow.ts'
import {
  brightness,
  contrast,
  duotone,
  fade,
  grayscale,
  hueRotate,
  invert,
  posterize,
  saturate,
  sepia,
  threshold,
  tint,
} from '../src/effects/color.ts'
import { grain } from '../src/effects/grain.ts'
import { scanlines } from '../src/effects/scanlines.ts'
import { chromaticAberration } from '../src/effects/chromatic.ts'
import { glitch } from '../src/effects/glitch.ts'
import { pixelate } from '../src/effects/pixelate.ts'
import { halftone } from '../src/effects/halftone.ts'
import { vignette } from '../src/effects/vignette.ts'
import { outline } from '../src/effects/outline.ts'
import { wave } from '../src/effects/wave.ts'
import { emboss, sharpen } from '../src/effects/relief.ts'
import { crt, cyberpunk, film, neon, newsprint, riso, vhs, xerox } from '../src/presets/index.ts'
import type { Effect } from '../src/core/types.ts'

const SOURCE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect width="100" height="60"/></svg>'

const apply = (effect: Effect): string => svgfx(SOURCE, [effect], { seed: 'test' })

const count = (haystack: string, needle: string): number => haystack.split(needle).length - 1

test('blur emits a gaussian blur with the requested radius', () => {
  assert.match(apply(blur({ radius: 5 })), /<feGaussianBlur[^>]*stdDeviation="5"/)
})

test('blur can be constrained to one axis', () => {
  assert.match(apply(blur({ radius: 4, axis: 'horizontal' })), /stdDeviation="4 0"/)
  assert.match(apply(blur({ radius: 4, axis: 'vertical' })), /stdDeviation="0 4"/)
})

test('bloom brightens through a threshold pass and screens it back', () => {
  const output = apply(bloom({ threshold: 0.5, radius: 3 }))
  assert.match(output, /<feFuncR type="linear" slope="2" intercept="-1"\/>/)
  assert.match(output, /mode="screen"/)
})

test('glow floods the requested colour', () => {
  assert.match(apply(glow({ color: '#ff0000' })), /flood-color="#ff0000"/)
})

test('glow dilates only when a spread is asked for', () => {
  assert.equal(count(apply(glow({ spread: 0 })), 'feMorphology'), 0)
  assert.equal(count(apply(glow({ spread: 2 })), 'feMorphology'), 1)
})

test('shadow emits a drop shadow', () => {
  assert.match(apply(shadow({ x: 1, y: 2, blur: 3 })), /<feDropShadow[^>]*dx="1" dy="2" stdDeviation="3"/)
})

test('grayscale desaturates fully by default', () => {
  assert.match(apply(grayscale()), /type="saturate" values="0"/)
})

test('grayscale honours a partial amount', () => {
  assert.match(apply(grayscale({ amount: 0.4 })), /type="saturate" values="0.6"/)
})

test('saturate and hueRotate emit their colour matrices', () => {
  assert.match(apply(saturate({ amount: 2 })), /type="saturate" values="2"/)
  assert.match(apply(hueRotate({ angle: 45 })), /type="hueRotate" values="45"/)
})

test('invert maps the transfer table end to end', () => {
  assert.match(apply(invert()), /type="table" tableValues="1 0"/)
})

test('brightness and contrast use linear transfer functions', () => {
  assert.match(apply(brightness({ amount: 2 })), /type="linear" slope="2"/)
  assert.match(apply(contrast({ amount: 2 })), /type="linear" slope="2" intercept="-0.5"/)
})

test('sepia interpolates towards the sepia matrix', () => {
  assert.match(apply(sepia({ amount: 1 })), /values="0.393 0.769 0.189 0 0/)
  assert.match(apply(sepia({ amount: 0 })), /values="1 0 0 0 0 0 1 0 0 0/)
})

test('fade scales the alpha channel only', () => {
  const output = apply(fade({ amount: 0.5 }))
  assert.match(output, /<feFuncA type="linear" slope="0.5"\/>/)
  assert.equal(count(output, '<feFuncR'), 0)
})

test('posterize builds an evenly spaced discrete table', () => {
  assert.match(apply(posterize({ steps: 3 })), /type="discrete" tableValues="0 0.5 1"/)
})

test('threshold maps luminance onto two colours', () => {
  const output = apply(threshold({ level: 0.5, dark: '#000000', light: '#ffffff' }))
  assert.match(output, /type="linear" slope="255" intercept="-127"/)
  assert.match(output, /type="table" tableValues="0 1"/)
})

test('duotone maps luminance onto a shadow and highlight pair', () => {
  const output = apply(duotone({ shadow: '#000000', highlight: '#ff8800' }))
  assert.match(output, /<feFuncR type="table" tableValues="0 1"\/>/)
  assert.match(output, /<feFuncG type="table" tableValues="0 0.5333"\/>/)
})

test('duotone blends with the source when mix is partial', () => {
  assert.match(apply(duotone({ mix: 0.5 })), /operator="arithmetic" k1="0" k2="0.5" k3="0.5"/)
})

test('tint floods a colour and mixes it back', () => {
  assert.match(apply(tint({ color: '#00ff00', amount: 0.25 })), /flood-color="#00ff00"/)
})

test('grain generates fractal noise clipped to the artwork', () => {
  const output = apply(grain())
  assert.match(output, /<feTurbulence type="fractalNoise"/)
  assert.match(output, /<feComposite[^>]*operator="in"/)
})

test('grain animates its seed only when asked', () => {
  assert.equal(count(apply(grain()), '<animate'), 0)
  assert.match(apply(grain({ animate: true })), /<animate attributeName="seed"[^>]*calcMode="discrete"/)
})

test('scanlines adds a tiled pattern overlay', () => {
  const output = apply(scanlines({ gap: 6, thickness: 2 }))
  assert.match(output, /<pattern[^>]*patternUnits="userSpaceOnUse" width="6" height="6"/)
  assert.match(output, /<rect x="0" y="0" width="6" height="2"/)
  assert.match(output, /mix-blend-mode:multiply/)
})

test('scanlines rolls with a self contained keyframe animation', () => {
  const output = apply(scanlines({ animate: true, gap: 4 }))
  assert.match(output, /@keyframes svgfx-[^{]+\{from\{transform:translateY\(0\)\}to\{transform:translateY\(4px\)\}\}/)
})

test('scanlines rotates the pattern for angled lines', () => {
  assert.match(apply(scanlines({ angle: 30 })), /patternTransform="rotate\(30\)"/)
})

test('chromatic aberration splits and recombines the channels', () => {
  const output = apply(chromaticAberration({ offset: 3 }))
  assert.match(output, /<feOffset[^>]*dx="3" dy="0"/)
  assert.match(output, /<feOffset[^>]*dx="-3" dy="0"/)
  assert.equal(count(output, 'mode="screen"'), 2)
})

test('glitch slices the artwork into clipped bands', () => {
  const output = apply(glitch({ intensity: 1, slices: 8 }))
  assert.ok(count(output, '<clipPath') > 0)
  assert.ok(count(output, '<use href="#svgfx') > 0)
})

test('glitch can drop the colour shift', () => {
  assert.equal(count(apply(glitch({ colorShift: false })), '<feOffset'), 0)
})

test('glitch animates each band on its own timeline', () => {
  const output = apply(glitch({ animate: true, intensity: 1 }))
  assert.ok(count(output, '@keyframes') > 1)
  assert.match(output, /steps\(1, end\)/)
})

test('pixelate tiles a sampling grid in user space', () => {
  const output = apply(pixelate({ size: 10 }))
  assert.match(output, /filterUnits="userSpaceOnUse"/)
  assert.match(output, /<feTile/)
  assert.match(output, /<feMorphology[^>]*operator="dilate" radius="5"/)
})

test('halftone builds one mask, cut filter and dot pattern per level', () => {
  const output = apply(halftone({ levels: 3, size: 4 }))
  assert.equal(output.match(/<mask id="[^"]*halftone-mask/g)?.length, 3)
  assert.equal(output.match(/<filter id="[^"]*halftone-cut/g)?.length, 3)
  assert.equal(count(output, '<pattern '), 3)
  assert.equal(count(output, '<circle '), 3)
})

test('halftone dots grow with each darker level', () => {
  const radii = Array.from(apply(halftone({ levels: 3, size: 10 })).matchAll(/<circle[^>]*r="([\d.]+)"/g), (match) =>
    Number(match[1]),
  )
  assert.deepEqual(radii, [...radii].sort((first, second) => first - second))
})

test('halftone keeps the source artwork when asked', () => {
  const output = apply(halftone({ keepSource: true }))
  assert.equal(count(output, '<g><rect width="100" height="60"/></g>'), 0)
  assert.match(output, /id="svgfx-[^"]*halftone-source[^"]*"><rect width="100" height="60"\/>/)
})

test('vignette overlays a radial gradient', () => {
  const output = apply(vignette({ color: '#001122' }))
  assert.match(output, /<radialGradient/)
  assert.match(output, /stop-color="#001122"/)
})

test('outline dilates for an outside stroke and erodes for an inside one', () => {
  assert.match(apply(outline({ width: 3 })), /operator="dilate" radius="3"/)
  assert.match(apply(outline({ width: 3, position: 'inside' })), /operator="erode" radius="3"/)
})

test('wave displaces through turbulence', () => {
  const output = apply(wave({ amplitude: 9 }))
  assert.match(output, /<feDisplacementMap[^>]*scale="9"/)
})

test('emboss convolves with a directional kernel and a mid bias', () => {
  const output = apply(emboss({ depth: 1, angle: 0 }))
  assert.match(output, /<feConvolveMatrix[^>]*bias="0.5"/)
  assert.match(output, /kernelMatrix="-1 0 1 -1 0 1 -1 0 1"/)
})

test('sharpen convolves with a centre weighted kernel', () => {
  assert.match(apply(sharpen({ amount: 1 })), /kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/)
})

const presets: readonly (readonly [string, Effect])[] = [
  ['crt', crt()],
  ['vhs', vhs()],
  ['riso', riso()],
  ['xerox', xerox()],
  ['neon', neon()],
  ['film', film()],
  ['newsprint', newsprint()],
  ['cyberpunk', cyberpunk()],
]

presets.forEach(([name, preset]) => {
  test(`preset ${name} produces a document with effects applied`, () => {
    const output = apply(preset)
    assert.ok(output.startsWith('<svg'))
    assert.ok(output.includes('<defs>'))
    assert.ok(output.length > SOURCE.length)
  })
})

test('every effect leaves the source artwork present in the output', () => {
  const effects: readonly Effect[] = [blur(), bloom(), glow(), grain(), scanlines(), glitch(), pixelate(), vignette()]
  effects.forEach((effect) => {
    assert.match(apply(effect), /<rect width="100" height="60"\/>/)
  })
})

const NO_BACKDROP =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><circle cx="30" cy="30" r="10"/><circle cx="70" cy="30" r="10"/></svg>'

const ROUNDED =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><g transform="translate(0,0)"><rect width="100" height="60" rx="8" fill="#111"/><circle cx="50" cy="30" r="8" fill="#fff"/></g></svg>'

const onNoBackdrop = (effect: Effect): string => svgfx(NO_BACKDROP, [effect], { seed: 'test' })

test('overlays share one clip definition instead of repeating it', () => {
  const output = svgfx(SOURCE, [scanlines(), vignette()], { seed: 'test' })
  assert.equal(count(output, '<clipPath'), 1)
  assert.equal(count(output, 'clip-path="url('), 2)
})

test('overlays clip flush to a detected backdrop rect', () => {
  const output = apply(scanlines())
  assert.match(output, /<clipPath id="svgfx-[^"]*-clip" clipPathUnits="userSpaceOnUse"><rect width="100" height="60"\/><\/clipPath>/)
  assert.match(output, /<rect[^>]*clip-path="url\(#svgfx-[^"]*-clip\)"/)
  assert.equal(count(output, 'shape-mask'), 0)
})

test('a rounded backdrop is carried into the clip path with its corner radius', () => {
  const output = svgfx(ROUNDED, [scanlines()], { seed: 'test' })
  assert.match(output, /<clipPath[^>]*><rect width="100" height="60" rx="8"\/><\/clipPath>/)
})

test('detection sees through wrapping groups and identity translates', () => {
  const wrapped = ROUNDED.replace('translate(0,0)', 'translate(0, 0)')
  assert.match(svgfx(wrapped, [scanlines()], { seed: 'test' }), /<rect width="100" height="60" rx="8"\/>/)
})

test('a real translate is folded into the clip shape', () => {
  const shifted =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><g transform="translate(0,0)"><rect width="100" height="60" rx="4"/></g></svg>'
  assert.match(svgfx(shifted, [scanlines()], { seed: 'test' }), /<rect width="100" height="60" rx="4"\/>/)
})

test('artwork with no backdrop falls back to an alpha silhouette mask', () => {
  const output = onNoBackdrop(scanlines())
  assert.equal(count(output, '<clipPath'), 0)
  assert.match(output, /<mask id="svgfx-[^"]*shape-mask/)
  assert.match(output, /<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"/)
  assert.match(output, /mask="url\(#svgfx-[^"]*shape-mask[^"]*\)"/)
})

test('an unpainted backdrop rect is not mistaken for the silhouette', () => {
  const outlineOnly =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><rect width="100" height="60" fill="none" stroke="#000"/><circle cx="50" cy="30" r="9"/></svg>'
  assert.equal(count(svgfx(outlineOnly, [scanlines()], { seed: 'test' }), '<clipPath'), 0)
})

test('clip viewport opts out of following the shape entirely', () => {
  const output = apply(scanlines({ clip: 'viewport' }))
  assert.equal(count(output, '<clipPath'), 0)
  assert.equal(count(output, 'shape-mask'), 0)
})

test('vignette and halftone follow the shape the same way', () => {
  assert.match(apply(vignette()), /clip-path="url\(#svgfx-[^"]*-clip\)/)
  assert.match(apply(halftone({ background: '#ffffff' })), /<rect[^>]*fill="#ffffff"[^>]*clip-path="url\(#svgfx/)
  assert.match(onNoBackdrop(vignette()), /mask="url\(#svgfx-[^"]*shape-mask/)
})

test('the root clip-path is reused when the artwork declares one', () => {
  const rootClipped =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" clip-path="url(#frame)"><defs><clipPath id="frame"><rect width="100" height="60" rx="6"/></clipPath></defs><circle cx="50" cy="30" r="9"/></svg>'
  const output = svgfx(rootClipped, [scanlines()], { seed: 'test' })
  assert.match(output, /<rect[^>]*clip-path="url\(#frame\)"/)
  assert.equal(count(output, 'shape-mask'), 0)
})
