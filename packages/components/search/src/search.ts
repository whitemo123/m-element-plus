import { buildProps, definePropType } from "@m-element-plus/utils";
import { ColumnType, ICommonColumn } from "@m-element-plus/components/common/types";
import { useSizeProp } from "@m-element-plus/hooks";
import { FormItemRule } from "element-plus";

export interface ISearchOptionColumn extends ICommonColumn {
  /**
   * @description label宽度
   */
  labelWidth?: string;
  /**
   * @description 搜索排序
   */
  order?: number;
  /**
   * @description 搜索校验规则
   */
  rules?: FormItemRule[];
  /**
   * @description 栅栏宽度
   */
  span?: number;
  /**
   * @description 是否开启插槽
   */
  slot?: boolean;
  /**
   * @description 类型
   */
  type?: ColumnType;
  /**
   * @description 最大长度
   */
  maxlength?: number;
  /**
   * @description 搜索默认值
   */
  value?: any;
  /**
   * @description 输入框占位文本
   */
  placeholder?: string;
  /**
   * @description 通用key
   */
  [key: string]: any;
}

/**
 * @description 搜索配置
 */
export interface ISearchOption {
  /**
   * @description label宽度
   */
  labelWidth?: string;
  /**
   * @description 搜索按钮文字
   */
  searchBtnText?: string;
  /**
   * @description 搜索按钮图标
   */
  searchBtnIcon?: string;
  /**
   * @description 重置按钮文字
   */
  resetBtnText?: string;
  /**
   * @description 重置按钮图标
   */
  resetBtnIcon?: string;
  /**
   * @description 收缩展示个数
   */
  colIndex?: number;
  /**
   * @description 是否开启收缩
   */
  col?: boolean;
  /**
   * @description 搜索配置项
   */
  column: ISearchOptionColumn[];
}

/**
 * @description 搜索prop
 */
export const searchProps = buildProps({
  /**
   * @description 尺寸大小
   */
  size: useSizeProp,
  /**
   * @description 配置项
   */
  option: {
    type: definePropType<ISearchOption>(Object),
    required: true
  },
  /**
   * @description 搜索加载状态
   */
  loading: {
    type: Boolean,
    default: false
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
   * @description 搜索表单绑定的值
   */
  model: {
    type: Object,
    required: true
  }
})

/**
 * @description 组件emits
 */
export const searchEmits = {
  /**
   * @description 搜索
   * @param form 搜索表单
   * @param done 完成
   * @returns 
   */
  search: (form: any) => true,
  /**
   * 重置
   * @returns 
   */
  reset: () => true,
}
