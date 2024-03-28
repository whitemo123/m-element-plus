import { buildProps } from '@m-element-plus/utils'

import type { ExtractPropTypes } from 'vue'

export const configProviderProps = buildProps({
  /**
   * @description GET网络请求
   */
  httpGet: {
    type: Function
  },
  /**
   * @description POST网络请求
   */
  httpPost: {
    type: Function
  },
  /**
   * @description 表格高度调节(px)
   */
  calcHeight: {
    type: Number
  }
} as const)
export type ConfigProviderProps = ExtractPropTypes<typeof configProviderProps>
