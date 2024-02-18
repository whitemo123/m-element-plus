/**
 * 公共column配置
 */
export interface ICommonColumn {
  /**
   * @description 列标题
   */
  label: string;
  /**
   * @description 列标题的内容属性名称
   */
  prop: string;
  /**
   * @description 禁用
   */
  disabled?: boolean;
}
