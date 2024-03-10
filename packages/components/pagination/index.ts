import { withInstall } from '@m-element-plus/utils'

import Pagination from './src/pagination.vue'

export const MPagination = withInstall(Pagination)
export default MPagination

export * from './src/pagination'
export type { PaginationInstance } from './src/instance'
