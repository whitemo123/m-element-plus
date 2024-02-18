import { writeFile } from 'fs/promises'
import path from 'path'
import consola from 'consola'
import { mepRoot } from '@m-element-plus/build/src/constant'
import pkg from '../packages/m-element-plus/package.json'

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  } else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Version: ${version}`)
  await writeFile(
    path.resolve(mepRoot, 'version.ts'),
    `export const version = '${version}'\n`
  )
}

main()
