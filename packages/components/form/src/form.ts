import { ColumnType, ICommonColumn } from "@m-element-plus/components/common/types";
import { useSizeProp } from "@m-element-plus/hooks";
import { buildProps, definePropType } from "@m-element-plus/utils";
import { FormItemRule } from "element-plus";

/**
 * @description form列配置
 */
export interface IFormOptionColumn extends ICommonColumn {
  /**
   * @description 隐藏不显示
   */
  hide?: boolean;
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
   * @description 表单默认值
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
 * @description form配置
 */
export interface IFormOption {
  /**
   * @description 标签宽度
   */
  labelWidth?: string;
  /**
   * @description 列配置
   */
  column: IFormOptionColumn[];
}

export const formProps = buildProps({
  /**
   * @description 尺寸大小
   */
  size: useSizeProp,
  /**
   * @description 表单值
   */
  model: {
    type: Object,
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
   * @description 只读模式
   */
  readonly: {
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
   * @description 配置信息
   */
  option: {
    type: definePropType<IFormOption>(Object),
    required: true
  }
})
