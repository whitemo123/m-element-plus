import { withInstall } from '@m-element-plus/utils'

import Render from './src/render.vue'

export const MRender = withInstall(Render)
export default MRender

export * from './src/render'
export type { RenderInstance } from './src/instance'
