import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { generateExternal, writeBundles } from '../utils'
import { excludeFiles } from '../utils'
import { MElementPlusAlias } from '../plugins/m-element-plus-alias'

import { pkgRoot, mepRoot } from '../constant'
import { buildConfigEntries } from '../utils'

import type { OutputOptions } from 'rollup'

export const buildModules = async () => {
  // 需要打包的所有文件(排除后)
  const input = excludeFiles(
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )

  const bundle = await rollup({
    input,
    plugins: [
      MElementPlusAlias(),
      // VueMacros({
      //   setupComponent: true,
      //   setupSFC: false,
      //   plugins: {
      //     vue: vue({
      //       isProduction: true,
      //     }),
      //     vueJsx: vueJsx(),
      //   },
      // }),
      // @ts-ignore
      vue(),
      // @ts-ignore
      vueJsx(),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })

  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: mepRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}
