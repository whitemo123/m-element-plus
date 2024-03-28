import { defineComponent, renderSlot } from 'vue'
import { provideGlobalConfig } from './hooks/use-global-config'

export const ConfigProvider = defineComponent({
  name: 'MConfigProvider',
  
  setup(props, { slots }) {
    const config = provideGlobalConfig(props)
    return () => renderSlot(slots, 'default', { config: config?.value })
  },
})

export type ConfigProviderInstance = InstanceType<typeof ConfigProvider>

export default ConfigProvider
