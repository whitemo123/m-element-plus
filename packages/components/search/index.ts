import { withInstall } from '@m-element-plus/utils'

import Search from './src/search.vue'

export const MSearch = withInstall(Search)
export default MSearch

export * from './src/search'
export type { SearchInstance } from './src/instance'
