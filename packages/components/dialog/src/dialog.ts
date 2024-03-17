import {buildProps} from '@m-element-plus/utils'
import { useSizeProp } from '@m-element-plus/hooks'

export const dialogProps = buildProps({
  /**
   * @description 表格尺寸
   */
  size: useSizeProp,
  /**
   * @description 弹窗开关
   */
  modelValue: {
    type: Boolean,
    required: true
  },
  /**
   * @description 弹窗标题
   */
  title: {
    type: String,
    default: ''
  },
  /**
   * @description 弹窗宽度
   */
  width: {
    type: String,
    default: '600px'
  },
  /**
   * @description 顶部距离
   */
  top: {
    type: String,
    default: '15vh'
  },
  /**
   * @description 插入body
   */
  appendToBody: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否可以通过点击 modal 关闭 Dialog
   */
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  /**
   * @description 是否可以通过按下 ESC 关闭 Dialog
   */
  closeOnnPressEscape: {
    type: Boolean,
    default: false
  },
  /**
   * @description 弹窗关闭前回调
   */
  beforeClose: {
    type: Function
  },
  /**
   * @description 为dialog开启拖拽功能
   */
  draggable: {
    type: Boolean,
    default: true
  },
  /**
   * @description 当关闭 Dialog 时，销毁其中的元素
   */
  destroyOnClose: {
    type: Boolean,
    default: true
  },
  /**
   * @description 保存按钮是否展示
   */
  saveBtn: {
    type: Boolean,
    default: true
  },
  /**
   * @description 取消按钮是否展示
   */
  cancelBtn: {
    type: Boolean,
    default: true
  }
})
