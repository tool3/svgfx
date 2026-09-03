import test from 'node:test'
import assert from 'node:assert/strict'
import { parse } from '../src/core/parse.ts'
import { serialize } from '../src/core/serialize.ts'

const source = '<svg xmlns="http://www.w3.org/2000/svg">\n  <g>\n    <rect/>\n  </g>\n  <!-- note -->\n</svg>'

test('preserve keeps the original whitespace', () => {
  assert.equal(serialize(parse(source), 'preserve'), source)
})

test('pretty re-indents element children', () => {
  assert.equal(
    serialize(parse(source), 'pretty'),
    '<svg xmlns="http://www.w3.org/2000/svg">\n  <g>\n    <rect/>\n  </g>\n  <!-- note -->\n</svg>',
  )
})

test('minify drops comments and layout whitespace', () => {
  assert.equal(serialize(parse(source), 'minify'), '<svg xmlns="http://www.w3.org/2000/svg"><g><rect/></g></svg>')
})

test('minify keeps whitespace inside text elements', () => {
  const withText = '<svg xmlns="http://www.w3.org/2000/svg"><text>a  b</text></svg>'
  assert.equal(serialize(parse(withText), 'minify'), withText)
})

test('escapes attribute values that contain markup characters', () => {
  const escaped = serialize(parse('<svg xmlns="http://www.w3.org/2000/svg"><g data-x="a&quot;b"/></svg>'))
  assert.match(escaped, /data-x="a&quot;b"/)
})
