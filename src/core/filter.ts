import { element } from './document.ts'
import type { AttributeInput, FilterIO, SvgElement, SvgNode } from './types.ts'

export interface PrimitiveSpec {
  readonly name: string
  readonly attributes?: AttributeInput
  readonly children?: readonly SvgNode[]
}

export const SOURCE_GRAPHIC = 'SourceGraphic'

export const SOURCE_ALPHA = 'SourceAlpha'

export const local = (io: FilterIO, name: string): string => `${io.output}-${name}`

export const primitive = (
  name: string,
  attributes: AttributeInput = {},
  children: readonly SvgNode[] = [],
): SvgElement => element(name, attributes, children)

export const series = (io: FilterIO, specs: readonly PrimitiveSpec[]): readonly SvgElement[] =>
  specs.map((spec, index) =>
    primitive(
      spec.name,
      {
        in: index === 0 ? io.input : local(io, `step${index - 1}`),
        ...spec.attributes,
        result: index === specs.length - 1 ? io.output : local(io, `step${index}`),
      },
      spec.children ?? [],
    ),
  )

const LUMINANCE_ROW = '0.2126 0.7152 0.0722 0 0'

export const LUMINANCE_MATRIX = [LUMINANCE_ROW, LUMINANCE_ROW, LUMINANCE_ROW, '0 0 0 1 0'].join(' ')

export const clipTo = (input: string, source: string, output: string): SvgElement =>
  primitive('feComposite', { in: input, in2: source, operator: 'in', result: output })

export const RGB_CHANNELS = ['R', 'G', 'B'] as const

export const RGBA_CHANNELS = ['R', 'G', 'B', 'A'] as const

export const transfer = (
  channels: readonly string[],
  attributes: AttributeInput,
): readonly SvgElement[] => channels.map((channel) => primitive(`feFunc${channel}`, attributes))

export const componentTransfer = (
  attributes: AttributeInput,
  functions: readonly SvgElement[],
): SvgElement => primitive('feComponentTransfer', attributes, functions)

export const colorMatrix = (values: string, attributes: AttributeInput = {}): SvgElement =>
  primitive('feColorMatrix', { type: 'matrix', values, ...attributes })

export const merge = (inputs: readonly string[], attributes: AttributeInput = {}): SvgElement =>
  primitive(
    'feMerge',
    attributes,
    inputs.map((input) => primitive('feMergeNode', { in: input })),
  )
