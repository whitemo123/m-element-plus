import { withInstall } from '@m-element-plus/utils'

import Form from './src/form.vue'

export const MForm = withInstall(Form)
export default MForm

export * from './src/form'
export type { FormInstance } from './src/instance'
