import {  parallel } from "gulp";
import { rollup } from 'rollup'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueMacros from 'unplugin-vue-macros/rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild, { minify as minifyPlugin } from 'rollup-plugin-esbuild'
import { generateExternal, writeBundles, formatBundleFilename } from '../utils'
import path from 'path'
import { MElementPlusAlias } from '../plugins/m-element-plus-alias'
import { withTaskName } from "../utils";
import { mepOutput, mepRoot, PKG_BRAND_NAME, PKG_CAMELCASE_NAME } from "../constant";
import { version } from '../../../../packages/m-element-plus/version'

import type { TaskFunction } from 'gulp'
import type { Plugin } from "rollup";


const banner = `/*! ${PKG_BRAND_NAME} v${version} */\n`

async function buildFullEntry(minify: boolean) {
  const plugins: Plugin[] = [
    MElementPlusAlias(),
    // @ts-ignore
    vue(),
    // @ts-ignore
    vueJsx(),
    nodeResolve({
      extensions: ['.mjs', '.js', '.json', '.ts'],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: minify,
      target: "es2018",
      loaders: {
        '.vue': 'ts',
      },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
      treeShaking: true,
      legalComments: 'eof',
    }),
  ]
  if (minify) {
    plugins.push(
      minifyPlugin({
        target: "es2018",
        sourceMap: true,
      })
    )
  }

  const bundle = await rollup({
    input: path.resolve(mepRoot, 'index.ts'),
    plugins,
    external: await generateExternal({ full: true }),
    treeshake: true,
  })
  await writeBundles(bundle, [
    {
      format: 'umd',
      file: path.resolve(
        mepOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'js')
      ),
      exports: 'named',
      name: PKG_CAMELCASE_NAME,
      globals: {
        vue: 'Vue',
      },
      sourcemap: minify,
      banner,
    },
    {
      format: 'esm',
      file: path.resolve(
        mepOutput,
        'dist',
        formatBundleFilename('index.full', minify, 'mjs')
      ),
      sourcemap: minify,
      banner,
    },
  ])
}

export const buildFull = (minify: boolean) => async () => {
  return Promise.all([buildFullEntry(minify)])
}

export const buildFullBundle: TaskFunction = parallel(
  withTaskName('buildFullMinified', buildFull(true)),
  withTaskName('buildFull', buildFull(false))
)
