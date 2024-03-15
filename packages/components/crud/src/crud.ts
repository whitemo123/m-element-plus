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
   * @description 新增按钮是否显示
   */
  addBtn?: boolean;
  /**
   * @description 新增按钮文字
   */
  addBtnText?: string;
  /**
   * @description 新增按钮图标
   */
  addBtnIcon?: string;
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
   * @description 数据总数
   */
  total: {
    type: Number,
    default: 0
  },
  /**
   * @description 搜索表单数据
   */
  search: {
    type: Object,
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
   * @description 选择的数据
   */
  select: {
    type: Array,
    default: () => []
  },
  /**
   * @description 权限对象数据
   */
  permission: {
    type: Object,
    default: {
      addBtn: true,
      editBtn: true,
      delBtn: true
    }
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
   * @description 更新search绑定的值
   * @param value 搜索表单参数
   * @returns 
   */
  ['update:search']: (value: any) => true,
  /**
   * 更新select数据
   * @param {any} arr 数据 
   * @returns 更新select数据
   */
  ['update:select']: (arr: any) => true, 
  /**
   * @description 搜索
   * @param form 搜索表单
   * @returns 
   */
  search: (form: any) => true,
  /**
   * @description 重置
   * @returns 
   */
  reset: () => true,
}
