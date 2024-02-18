import { buildProps, definePropType } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

import { isString } from "@m-element-plus/utils";

// 默认排序
export interface ITableDefaultSort {
  // 排序字段
  prop?: string;
  // 排序顺序
  order?: 'ascending' | 'descending'
}

// 表格配置
export interface ITableOptionColumn {

}


export interface ITableOption {
  // 斑马纹
  stripe?: boolean;
  // 是否有序号
  index?: boolean;
  // 序号列宽度
  indexWidth?: number;
  // 是否有选择款
  selection?: 'radio' | 'checkbox';
  // 选择框宽度
  selectionWidth?: number;
  // 是否带边框
  border?: boolean;
  // 表格指定key
  rowKey?: string;
  // 表格默认排序
  defaultSort?: ITableDefaultSort;
  // 底部出现合计行
  showSummary?: boolean;
  // 表格配置项
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
  sortChange: (data: {column: any, prop: string, order: string}) => isString(data.prop) && isString(data.order),
  /**
   * 选择改变
   * @param {any} selection 选择的数据数组
   * @description 选择改变
   * @returns 
   */
  selectionChange: (selection: any) => true
}
