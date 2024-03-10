import { buildProps, isNumber } from "@m-element-plus/utils";

export const paginationProps = buildProps({
  /**
   * @description 是否使用小型分页样式
   */
  small: {
    type: Boolean,
    default: true
  },
  /**
   * @description 是否为分页按钮添加背景色
   */
  background: {
    type: Boolean,
    default: true
  },
  /**
   * @description 总条目数
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * @description  组件布局，子组件名用逗号分隔
   */
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper"
  },
  /**
   * @description 每页显示个数选择器的选项设置
   */
  pageSizes: {
    type: Array,
    default: () => [10, 50, 100, 200, 300, 400]
  },
  /**
   * @description 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false
  },
  /**
   * @description 当前页数
   */
  currentPage: {
    type: Number,
    default: 1
  },
  /**
   * @description 当前页大小
   */
  pageSize: {
    type: Number,
    default: 10
  }
})

export const paginationEmits = {
  ['update:currentPage']: (page: number) => isNumber(page),
  ['update:pageSize']: (pageSize: number) => isNumber(pageSize),
}
