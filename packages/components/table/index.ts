import { withInstall } from '@m-element-plus/utils'

import Table from './src/table.vue'

export const MTable = withInstall(Table)
export default MTable

export * from './src/table'
export type { TableInstance } from './src/instance'
