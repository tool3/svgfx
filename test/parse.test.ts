import test from 'node:test'
import assert from 'node:assert/strict'
import { parse } from '../src/core/parse.ts'
import { serialize } from '../src/core/serialize.ts'
import { PstfxError } from '../src/core/errors.ts'
import type { SvgElement } from '../src/core/types.ts'

const roundTrip = (source: string): string => serialize(parse(source))

test('round-trips a minimal document', () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10"/></svg>'
  assert.equal(roundTrip(source), source)
})

test('round-trips the xml declaration, doctype and comments', () => {
  const source =
    '<?xml version="1.0" encoding="UTF-8"?>\n<!-- a note -->\n<svg xmlns="http://www.w3.org/2000/svg"><g/></svg>'
  assert.equal(roundTrip(source), source)
})

test('round-trips markup entities without double escaping', () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg"><text>a &amp; b &lt; c &nbsp;</text></svg>'
  assert.equal(roundTrip(source), source)
})

test('normalizes numeric entities to characters', () => {
  assert.match(roundTrip('<svg xmlns="http://www.w3.org/2000/svg"><text>&#169;</text></svg>'), /<text>©<\/text>/)
})

test('keeps style and script bodies verbatim', () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg"><style>.a > .b { fill: red }</style></svg>'
  assert.equal(roundTrip(source), source)
})

test('round-trips CDATA sections', () => {
  const source = '<svg xmlns="http://www.w3.org/2000/svg"><style><![CDATA[.a{fill:red}]]></style></svg>'
  assert.equal(roundTrip(source), source)
})

test('parses attributes containing slashes and quotes', () => {
  const document = parse('<svg xmlns="http://www.w3.org/2000/svg"><image href="a/b.png" alt=\'x "y"\'/></svg>')
  const image = document.root.children[0] as SvgElement
  assert.equal(image.attributes.href, 'a/b.png')
  assert.equal(image.attributes.alt, 'x "y"')
})

test('parses nested structures and preserves order', () => {
  const document = parse('<svg xmlns="http://www.w3.org/2000/svg"><g><a/><b/></g><c/></svg>')
  const [firstGroup, third] = document.root.children as readonly SvgElement[]
  assert.equal(firstGroup?.name, 'g')
  assert.deepEqual((firstGroup?.children as readonly SvgElement[]).map((node) => node.name), ['a', 'b'])
  assert.equal(third?.name, 'c')
})

test('recovers from an unclosed element', () => {
  const document = parse('<svg xmlns="http://www.w3.org/2000/svg"><g><rect/></svg>')
  const group = document.root.children[0] as SvgElement
  assert.equal(group.name, 'g')
  assert.equal((group.children[0] as SvgElement).name, 'rect')
})

test('rejects a non-string source', () => {
  assert.throws(() => parse(42 as unknown as string), (error: PstfxError) => error.code === 'INVALID_SOURCE')
})

test('rejects an empty source', () => {
  assert.throws(() => parse('   '), (error: PstfxError) => error.code === 'INVALID_SOURCE')
})

test('rejects markup whose root is not an svg', () => {
  assert.throws(() => parse('<div><span/></div>'), (error: PstfxError) => error.code === 'NOT_AN_SVG')
})
