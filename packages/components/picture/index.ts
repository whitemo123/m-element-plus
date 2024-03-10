import { withInstall } from '@m-element-plus/utils'

import Picture from './src/picture.vue'

export const MPicture = withInstall(Picture)
export default MPicture

export * from './src/picture'
export type { PictureInstance } from './src/instance'
