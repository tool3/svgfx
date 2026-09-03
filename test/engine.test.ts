import test from 'node:test'
import assert from 'node:assert/strict'
import { stouch } from '../src/core/api.ts'
import { defineEffect, filterStage, layerStage } from '../src/core/effect.ts'
import { primitive, series } from '../src/core/filter.ts'
import { group } from '../src/core/layers.ts'
import { readViewport } from '../src/core/document.ts'
import { parse } from '../src/core/parse.ts'
import { blur } from '../src/effects/blur.ts'
import { grayscale, invert } from '../src/effects/color.ts'
import { scanlines } from '../src/effects/scanlines.ts'
import type { StouchError } from '../src/core/errors.ts'

const SOURCE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><rect width="100" height="50"/></svg>'

const count = (haystack: string, needle: string): number => haystack.split(needle).length - 1

test('returns the document untouched when no effects are given', () => {
  assert.equal(stouch(SOURCE, []), SOURCE)
})

test('adds the svg namespace when it is missing', () => {
  assert.match(stouch('<svg viewBox="0 0 4 4"><rect/></svg>', []), /xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)
})

test('is deterministic across identical calls', () => {
  const first = stouch(SOURCE, [scanlines({ animate: true })])
  const second = stouch(SOURCE, [scanlines({ animate: true })])
  assert.equal(first, second)
})

test('gives different documents different id namespaces', () => {
  const first = stouch(SOURCE, [blur()])
  const second = stouch(SOURCE.replace('100', '120'), [blur()])
  const idOf = (markup: string): string => /id="([^"]+)"/.exec(markup)?.[1] ?? ''
  assert.notEqual(idOf(first), idOf(second))
})

test('honours an explicit scope', () => {
  assert.match(stouch(SOURCE, [blur()], { scope: 'hero' }), /id="stouch-hero-filter-0"/)
})

test('honours a custom prefix', () => {
  assert.match(stouch(SOURCE, [blur()], { prefix: 'acme' }), /id="acme-/)
})

test('merges consecutive filter effects into a single filter element', () => {
  const output = stouch(SOURCE, [grayscale(), invert(), blur()])
  assert.equal(count(output, '<filter '), 1)
  assert.equal(count(output, 'filter="url('), 1)
})

test('splits filters that are separated by a layer effect', () => {
  const output = stouch(SOURCE, [grayscale(), scanlines(), blur()])
  assert.equal(count(output, '<filter '), 2)
})

test('chains filter primitives through the merged filter', () => {
  const output = stouch(SOURCE, [grayscale(), invert()])
  const passResult = /result="([^"]*pass-0)"/.exec(output)?.[1]
  assert.ok(passResult)
  assert.ok(output.includes(`in="${passResult}"`))
})

test('keeps non-rendering nodes outside the effect group', () => {
  const output = stouch(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4"><title>t</title><defs><g id="a"/></defs><rect/></svg>',
    [blur()],
  )
  assert.ok(output.indexOf('<title>t</title>') < output.indexOf('filter="url('))
})

test('disables motion globally through settings', () => {
  const output = stouch(SOURCE, [scanlines({ animate: true })], { animate: false })
  assert.equal(count(output, '@keyframes'), 0)
})

test('rejects values that are not effects', () => {
  assert.throws(
    () => stouch(SOURCE, [{ nope: true } as unknown as ReturnType<typeof blur>]),
    (error: StouchError) => error.code === 'INVALID_EFFECT',
  )
})

test('supports custom filter effects', () => {
  const sepiaish = defineEffect('custom', [
    filterStage((io) => ({
      primitives: series(io, [{ name: 'feColorMatrix', attributes: { type: 'saturate', values: 0.2 } }]),
    })),
  ])
  assert.match(stouch(SOURCE, [sepiaish]), /type="saturate" values="0.2"/)
})

test('supports custom layer effects that contribute defs and styles', () => {
  const badge = defineEffect('badge', [
    layerStage((content, context) => ({
      defs: [primitive('circle', { id: context.uid('dot'), r: 2 })],
      styles: ['.badge{opacity:.5}'],
      content: group([content, primitive('use', { href: `#${context.uid('dot')}` })]),
    })),
  ])
  const output = stouch(SOURCE, [badge])
  assert.match(output, /<defs><circle id="stouch-[^"]+-dot-0"/)
  assert.match(output, /<style><!\[CDATA\[\.badge\{opacity:\.5\}\]\]><\/style>/)
})

test('reads the viewport from a viewBox', () => {
  assert.deepEqual(readViewport(parse('<svg viewBox="2 3 40 20"/>').root), { x: 2, y: 3, width: 40, height: 20 })
})

test('falls back to width and height when there is no viewBox', () => {
  assert.deepEqual(readViewport(parse('<svg width="80" height="20"/>').root), { x: 0, y: 0, width: 80, height: 20 })
})

test('falls back to the default viewport when nothing is declared', () => {
  assert.deepEqual(readViewport(parse('<svg><rect/></svg>').root), { x: 0, y: 0, width: 300, height: 150 })
})
