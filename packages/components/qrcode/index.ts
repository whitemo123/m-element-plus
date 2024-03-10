import { withInstall } from '@m-element-plus/utils'

import Qrcode from './src/qrcode.vue'

export const MQrcode = withInstall(Qrcode)
export default MQrcode

export * from './src/qrcode'
export type { QrcodeInstance } from './src/instance'
