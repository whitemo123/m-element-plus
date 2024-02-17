import { withInstall } from '@m-element-plus/utils'

import Crud from './src/crud.vue'

export const MCrud = withInstall(Crud)
export default MCrud

export * from './src/crud'
export type { CrudInstance } from './src/instance'
