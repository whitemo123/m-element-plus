import { VNode } from 'vue'
import { buildProps, definePropType } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

import { isString } from "@m-element-plus/utils";

import type { ICommonColumn, InputTypes, DateTypes } from "../../common/types";

/**
 * 默认排序
 */
export interface ITableDefaultSort {
  /**
   * @description 排序字段
   */
  prop?: string;
  /**
   * @description 排序顺序
   */
  order?: 'ascending' | 'descending'
}

/**
 * 表格配置
 */
export interface ITableOptionColumn extends ICommonColumn {
  /**
   * @description 列宽度
   */
  width?: number;
  /**
   * @description 列是否固定在左侧或者右侧，true 表示固定在左侧
   * @example true | 'left' | 'right'
   */
  fixed?: true | 'left' | 'right';
  /**
   * @description 对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
   * @example true | false | 'custom'
   */
  sortable?: true | false | 'custom';
  /**
   * @description 用来格式化列内容
   * @param row 行数据
   * @returns 
   */
  formatter?: (row: any) => VNode;
  /**
   * @description 是否隐藏
   */
  hide?: boolean;
  /**
   * @description 对齐方式
   * @example 'left' | 'center' | 'right'
   */
  align?: 'left' | 'center' | 'right';
  /**
   * @description 当内容过长被隐藏时显示 tooltip
   */
  overHidden?: boolean;
  /**
   * @description 开启插槽
   */
  slot?: boolean;
  /**
   * @description 类型
   */
  type?: InputTypes | DateTypes | 'select' | 'checkbox' | 'radio' | 'picture' | 'qrcode';
  /**
   * @description 帮助信息文字
   */
  help?: string;
}


export interface ITableOption {
  /**
   * @description 斑马纹
   */
  stripe?: boolean;
  /**
   * @description 是否有序号
   */
  index?: boolean;
  /**
   * @description 序号列宽度
   */
  indexWidth?: number;
  /**
   * @description 是否有选择款
   * @example 'radio' | 'checkbox'
   */
  selection?: 'radio' | 'checkbox';
  /**
   * @description 选择框宽度
   */
  selectionWidth?: number;
  /**
   * @description 是否带边框
   */
  border?: boolean;
  /**
   * @description 表格指定key
   */
  rowKey?: string;
  /**
   * @description 表格默认排序
   */
  defaultSort?: ITableDefaultSort;
  /**
   * @description 底部出现合计行
   */
  showSummary?: boolean;
  /**
   * @description 表格配置项
   */
  column: ITableOptionColumn[];
}

export const tableProps = buildProps({
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
   * @description 表格数据
   */
  data: {
    type: Array,
    required: true
  },
  /**
   * @description 表格配置
   */
  option: {
    type: definePropType<ITableOption>(Object),
    required: true
  },
  /**
   * @description 选择的数据
   */
  select: {
    type: Array,
    default: () => []
  }
})

export const tableEmits = {
  /**
   * 更新data数据
   * @param {any[]} d 数据 
   * @description 更新data数据
   * @returns 
   */
  ['update:data']: (d: any[]) => true,
  /**
   * 更新select数据
   * @param {any} arr 数据 
   * @returns 更新select数据
   */
  ['update:select']: (arr: any) => true, 
  /**
   * 排序改变
   * @param {any} column 列
   * @param {string} prop 值
   * @param {string} order 排序
   * @description 排序改变
   * @returns 
   */
  sortChange: (data: {column: any, prop: string, order: string | null}) => isString(data.prop) && (data.order === null || isString(data.order)),
  /**
   * 选择改变
   * @param {any} selection 选择的数据数组
   * @description 选择改变
   * @returns 
   */
  selectionChange: (selection: any) => true
}
