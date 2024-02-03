import installer from './defaults'

export * from '@m-element-plus/components'
export * from '@m-element-plus/constants'
export * from '@m-element-plus/hooks'
export * from './make-installer'

export const install = installer.install
export const version = installer.version
export default installer
