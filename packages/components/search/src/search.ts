import { buildProps, definePropType } from "@m-element-plus/utils";
import { ICommonColumn } from "@m-element-plus/components/common/types";
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
  rule?: FormItemRule[];
  /**
   * @description 栅栏宽度
   */
  span?: number;
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
  }
})

export const searchEmits = {
  
}
