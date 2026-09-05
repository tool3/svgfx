import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const examples = dirname(fileURLToPath(import.meta.url))

const outputs = join(examples, 'svgs')

export const load = (name: string): string => readFileSync(join(examples, 'sources', name), 'utf8')

export const save = (name: string, before: string, after: string): void => {
  mkdirSync(outputs, { recursive: true })
  writeFileSync(join(outputs, `${name}.before.svg`), before)
  writeFileSync(join(outputs, `${name}.after.svg`), after)
  console.log(`${name.padEnd(22)} svgs/${name}.before.svg  ->  svgs/${name}.after.svg`)
}

export const MOTION_SOURCE = 'tetrahedron.svg'

export const render = (
  name: string,
  art: string,
  transform: (source: string) => string,
): void => {
  const still = load(art)
  const motion = load(MOTION_SOURCE)
  mkdirSync(outputs, { recursive: true })
  writeFileSync(join(outputs, `${name}.before.svg`), still)
  writeFileSync(join(outputs, `${name}.after.svg`), transform(still))
  writeFileSync(join(outputs, `${name}.motion.after.svg`), transform(motion))
  console.log(`${name.padEnd(22)} ${art.padEnd(14)} + ${MOTION_SOURCE}`)
}
