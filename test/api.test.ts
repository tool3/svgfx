import test from 'node:test'
import assert from 'node:assert/strict'
import { createPipeline, resolveSettings, pstfx } from '../src/core/api.ts'
import { toDataUri } from '../src/core/data-uri.ts'
import { compose } from '../src/core/effect.ts'
import { blur } from '../src/effects/blur.ts'
import { grayscale } from '../src/effects/color.ts'
import { scanlines } from '../src/effects/scanlines.ts'

const SOURCE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'

test('resolves settings with documented defaults', () => {
  assert.deepEqual(resolveSettings(), {
    seed: 'pstfx',
    prefix: 'pstfx',
    scope: '',
    clip: 'shape',
    animate: true,
    format: 'preserve',
  })
})

test('sanitizes a prefix that would produce invalid ids', () => {
  assert.equal(resolveSettings({ prefix: '9 my prefix!' }).prefix, 'pstfx9myprefix')
})

test('a pipeline applies the same effects to many documents', () => {
  const pipeline = createPipeline([grayscale(), scanlines()], { seed: 'brand' })
  const first = pipeline.apply(SOURCE)
  const second = pipeline.apply(SOURCE.replace('10 10"', '20 20"'))
  assert.match(first, /type="saturate"/)
  assert.match(second, /type="saturate"/)
  assert.notEqual(first, second)
})

test('a pipeline is idempotent for the same input', () => {
  const pipeline = createPipeline([blur()])
  assert.equal(pipeline.apply(SOURCE), pipeline.apply(SOURCE))
})

test('a pipeline exposes what it was built from', () => {
  const pipeline = createPipeline([blur()], { seed: 7 })
  assert.equal(pipeline.effects.length, 1)
  assert.equal(pipeline.settings.seed, '7')
})

test('compose merges effects into one named effect', () => {
  const stack = compose('house-style', [grayscale(), blur(), scanlines()])
  assert.equal(stack.name, 'house-style')
  assert.equal(stack.stages.length, 3)
  assert.match(pstfx(SOURCE, [stack]), /type="saturate"/)
})

test('formats the output on request', () => {
  assert.match(pstfx(SOURCE, [blur()], { format: 'pretty' }), /\n {2}<defs>/)
  assert.equal(pstfx(SOURCE, [blur()], { format: 'minify' }).includes('\n'), false)
})

test('encodes a uri data url by default', () => {
  const uri = toDataUri('<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#fff"/></svg>')
  assert.ok(uri.startsWith('data:image/svg+xml,'))
  assert.ok(uri.includes('%3Csvg'))
  assert.equal(uri.includes('#'), false)
})

test('encodes a base64 data url on request', () => {
  const uri = toDataUri('<svg/>', { base64: true })
  assert.equal(uri, `data:image/svg+xml;base64,${Buffer.from('<svg/>').toString('base64')}`)
})

test('the seed changes generated randomness but not structure', () => {
  const first = pstfx(SOURCE, [scanlines()], { seed: 'a' })
  const second = pstfx(SOURCE, [scanlines()], { seed: 'b' })
  assert.notEqual(first, second)
  assert.equal(first.split('<').length, second.split('<').length)
})
