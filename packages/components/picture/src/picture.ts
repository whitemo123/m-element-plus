import { buildProps } from "@m-element-plus/utils";

export const pictureProps = buildProps({
  /**
   * @description 预览图片地址
   */
  src: {
    type: String,
    required: true
  },
  /**
   * @description 预览图片集合
   */
  previewSrcList: {
    type: Array,
    default: () => []
  },
  /**
   * @description 图片宽度
   */
  imgWidth: {
    type: String,
    default: '70px'
  },
  /**
   * @description 图片高度
   */
  imgHeight: {
    type: String,
    default: '70px'
  }
})
