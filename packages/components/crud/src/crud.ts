import { buildProps, definePropType, isNumber } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

import type { ITableDefaultSort, ITableOption, ITableOptionColumn } from "@m-element-plus/components/table";
import { ISearchOption, ISearchOptionColumn } from "@m-element-plus/components/search";

// 分页参数
export interface ICrudPage {
  // 页数
  page: number;
  // 页码
  limit: number;
}

/**
 * @description crud默认排序
 */
export interface ICrudDefaultSort extends ITableDefaultSort {}

/**
 * @description crud column配置项
 */
export interface ICrudOptionColumn extends ITableOptionColumn, ISearchOptionColumn {
  /**
   * @description 是否开启搜索
   */
  search?: boolean;
  /**
   * @description 搜索项是否开启插槽
   */
  searchSlot?: boolean;
  /**
   * @description 搜索输入框最大输入长度
   */
  searchMaxLength?: number;
  /**
   * @description 搜索默认值
   */
  searchValue?: any;
  /**
   * @description 输入框占位文本
   */
  searchPlaceholder?: string;
}

/**
 * @description crud配置
 */
export interface ICrudOption extends ITableOption, ISearchOption {
  /**
   * @description 是否有操作栏
   */
  menu?: boolean;
  /**
   * @description 操作栏宽度
   */
  menuWidth?: number;
  /**
   * @description 操作栏标题
   */
  menuTitle?: string;
  /**
   * @description 操作栏列冻结列 (true/left/right)
   */
  menuFixed?: boolean | string;
  /**
   * @description 操作栏编辑按钮
   */
  editBtn?: boolean;
  /**
   * @description 操作栏修改按钮文案
   */
  editBtnText?: string;
  /**
   * @description 操作栏修改按钮图标
   */
  editBtnIcon?: string;
  /**
   * @description 操作栏删除按钮
   */
  delBtn?: boolean;
  /**
   * @description 操作栏删除按钮文字
   */
  delBtnText?: string;
  /**
   * @description 操作栏删除按钮图标
   */
  delBtnIcon?: string;
  /**
   * @description 操作栏查看按钮
   */
  viewBtn?: boolean;
  /**
   * @description 操作栏查看按钮文字
   */
  viewBtnText?: string;
  /**
   * @description 操作栏查看按钮图标
   */
  viewBtnIcon?: string;
  /**
   * @description crud列配置
   */
  column: ICrudOptionColumn[]
}

export const crudProps = buildProps({
  /**
   * @description 表格尺寸
   */
  size: useSizeProp,
  /**
   * @description 分页参数
   */
  page: {
    type: definePropType<ICrudPage>(Object),
    default: {
      page: 1,
      limit: 10
    }
  },
  /**
   * @description 数据总数
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * @description 表格数据
   */
  data: {
    type: Array,
    required: true
  },
  /**
   * @description 整体加载
   */
  loading: {
    type: Boolean,
    default: false
  },
  /**
   * @description 表格配置
   */
  option: {
    type: definePropType<ICrudOption>(Object),
    required: true
  }
})

export const crudEmits = {
  /**
   * @description 更新page
   * @param page 分页参数
   * @returns 
   */
  ['update:page']: (page: ICrudPage) => isNumber(page.page) && isNumber(page.limit),
  /**
   * @description 搜索
   * @param form 搜索表单
   * @returns 
   */
  search: (form: any, done: Function) => true,
  /**
   * @description 重置
   * @returns 
   */
  reset: () => true,
}
