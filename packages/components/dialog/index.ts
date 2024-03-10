import { withInstall } from '@m-element-plus/utils'

import Dialog from './src/dialog.vue'

export const MDialog = withInstall(Dialog)
export default MDialog

export * from './src/dialog'
export type { DialogInstance } from './src/instance'
