import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const examples = dirname(fileURLToPath(import.meta.url))

const groups = ['effects', 'presets', 'animated']

const files = groups.flatMap((group) =>
  readdirSync(join(examples, group))
    .filter((name) => name.endsWith('.ts'))
    .sort()
    .map((name) => join(examples, group, name)),
)

await files.reduce(
  (chain, file) => chain.then(() => import(pathToFileURL(file).href)).then(() => undefined),
  Promise.resolve(),
)

console.log(`\n${files.length} examples rendered into examples/svgs.`)
