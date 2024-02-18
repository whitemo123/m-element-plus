import type { ProjectManifest } from '@pnpm/types'
import { Module, buildConfig } from '.'
import { PKG_PREFIX, PKG_NAME } from '../constant'

/**
 * 筛选不排除的文件
 * @param files 
 * @returns 
 */
export const excludeFiles = (files: string[]) => {
  const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist']
  return files.filter(
    (path) => !excludes.some((exclude) => path.includes(exclude))
  )
}

/**
 * 获取包的属性
 * @param pkgPath 包的路径
 * @returns 
 */
export const getPackageManifest = (pkgPath: string) => {
  return require(pkgPath) as ProjectManifest
}

/**
 * 获取包的依赖
 * @param pkgPath 包的路径
 * @returns 
 */
export const getPackageDependencies = (
  pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> => {
  const manifest = getPackageManifest(pkgPath)
  const { dependencies = {}, peerDependencies = {} } = manifest

  return {
    dependencies: Object.keys(dependencies),
    peerDependencies: Object.keys(peerDependencies),
  }
}


export const pathRewriter = (module: Module) => {
  const config = buildConfig[module]

  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/theme-chalk`, `${PKG_NAME}/theme-chalk`)
    id = id.replaceAll(`${PKG_PREFIX}/`, `${config.bundle.path}/`)
    return id
  }
}

