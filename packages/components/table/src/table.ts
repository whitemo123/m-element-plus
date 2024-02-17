import { buildProps, definePropType } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

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
  // 是否懒加载
  lazy?: boolean;
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
  }
})

export const tableEmits = {
  // 更新data数据
  'update:data': (d: any[]) => void(0)
}

