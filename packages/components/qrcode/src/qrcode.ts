import { buildProps } from "@m-element-plus/utils";

export const qrcodeProps = buildProps({
  /**
   * @description 二维码内容
   */
  text: {
    type: String,
    required: true
  },
  /**
   * @description 对齐方式
   */
  align: {
    type: String,
    default: 'left'
  },
  /**
   * @description qrcode宽度
   */
  qrcodeWidth: {
    type: Number,
    default: 70
  },
  /**
   * @description qrcode高度
   */
  qrcodeHeight: {
    type: Number,
    default: 70
  }
})
