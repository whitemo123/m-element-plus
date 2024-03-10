import { MRender } from '@m-element-plus/components/render'
import { MQrcode } from '@m-element-plus/components/qrcode'
import { MDialog } from '@m-element-plus/components/dialog'
import { MPicture } from '@m-element-plus/components/picture'
import { MTable } from '@m-element-plus/components/table'
import { MCrud } from '@m-element-plus/components/crud'
import { MPagination } from '@m-element-plus/components/pagination'

import type { Plugin } from 'vue'

export default [
  MRender,
  MQrcode,
  MDialog,
  MPicture,
  MTable,
  MCrud,
  MPagination
] as Plugin[]
