import {series, parallel } from 'gulp'
import { mkdir } from 'fs/promises'
import {run, runTask, withTaskName} from './src'

import { mepOutput } from './src/constant'

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
    runTask('generateTypesDefinitions')
  )
)

export * from './src'
