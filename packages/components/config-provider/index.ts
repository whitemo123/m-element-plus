import { withInstall } from '@m-element-plus/utils'

import ConfigProvider from './src/config-provider'

export const MConfigProvider = withInstall(ConfigProvider)
export default MConfigProvider

export * from './src/config-provider'
export * from './src/config-provider-props'
export * from './src/constants'
export * from './src/hooks/use-global-config'
