import {series, parallel } from 'gulp'
import path from 'path'
import { mkdir, copyFile } from 'fs/promises'
import { copy } from 'fs-extra'
import {run, runTask, withTaskName, buildConfig} from './src'

import { mepOutput, mepPackage, projRoot, buildOutput } from './src/constant'

import type { TaskFunction } from 'gulp'
import type { Module } from './src'


export const copyFiles: TaskFunction = async (done) => {
  await Promise.all([
    copyFile(mepPackage, path.join(mepOutput, 'package.json')),
    copyFile(
      path.resolve(projRoot, 'README.md'),
      path.resolve(mepOutput, 'README.md')
    ),
    copyFile(
      path.resolve(projRoot, 'global.d.ts'),
      path.resolve(mepOutput, 'global.d.ts')
    ),
  ])
  done()
}

export const copyTypesDefinitions: TaskFunction = (done) => {
  const src = path.resolve(buildOutput, 'types', 'packages')
  const copyTypes = (module: Module) =>
    withTaskName(`copyTypes:${module}`, () =>
      copy(src, buildConfig[module].output.path, { recursive: true })
    )

  return parallel(copyTypes('esm'), copyTypes('cjs'))(done)
}

export default series(
  // 清理打包目录
  withTaskName('clean', () => run('pnpm run clean')),
  // 创建打包产物目录
  withTaskName('createOutput', () => mkdir(mepOutput, { recursive: true })),

  parallel(
    // 打包es cjs
    runTask('buildModules'),
    // 打包全包
    runTask('buildFullBundle'),
    // 打包类型
    runTask('generateTypesDefinitions'),
    // 打包scss
    runTask('buildSass')
  ),

  // 移动打包文件
  parallel(copyTypesDefinitions, copyFiles)
)

export * from './src'
