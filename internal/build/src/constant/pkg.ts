import { resolve } from 'path'

// 项目目录
export const projRoot = resolve(__dirname, '..', '..', '..', '..')
// packages目录
export const pkgRoot = resolve(projRoot, 'packages')
// m-element-plus实际目录
export const mepRoot = resolve(pkgRoot, 'm-element-plus')

// 打包目录
export const buildRoot = resolve(projRoot, 'internal', 'build')

// 打包产物目录
export const buildOutput = resolve(projRoot, 'dist')
export const mepOutput = resolve(buildOutput, 'm-element-plus')
// m-element-plus package.json文件
export const mepPackage = resolve(mepRoot, 'package.json')
