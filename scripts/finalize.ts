import { writeFileSync } from 'node:fs'

const marker = (type: string): string => `${JSON.stringify({ type }, null, 2)}\n`

writeFileSync('dist/cjs/package.json', marker('commonjs'))
writeFileSync('dist/esm/package.json', marker('module'))
