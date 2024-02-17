import { buildProps, definePropType } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

import type { ITableDefaultSort, ITableOption } from "@m-element-plus/components/table";

// 分页参数
export interface ICrudPage {
  // 页数
  page: number;
  // 页码
  limit: number;
}

// 默认排序
export interface ICrudDefaultSort extends ITableDefaultSort {}

// crud配置
export interface ICrudOption extends ITableOption {
  // 是否有操作栏
  menu?: boolean;
  // 操作栏宽度
  menuWidth?: number;
  // 操作栏标题
  menuTitle?: string;
  // 操作栏列冻结列 (true/left/right)
  menuFixed?: boolean | string;
  // 操作栏编辑按钮
  editBtn?: boolean;
  // 操作栏修改按钮文案
  editBtnText?: string;
  // 操作栏修改按钮图标
  editBtnIcon?: string;
  // 操作栏删除按钮
  delBtn?: boolean;
  // 操作栏删除按钮文字
  delBtnText?: string;
  // 操作栏删除按钮图标
  delBtnIcon?: string;
  // 操作栏查看按钮
  viewBtn?: boolean;
  // 操作栏查看按钮文字
  viewBtnText?: string;
  // 操作栏查看按钮图标
  viewBtnIcon?: string;
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
   * @description 表格配置
   */
  option: {
    type: definePropType<ICrudOption>(Object),
    required: true
  }
})
