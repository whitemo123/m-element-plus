/**
 * @description 公共column配置
 */
export interface ICommonColumn extends IDict, ISelectColumn {
  /**
   * @description 列标题
   */
  label: string;
  /**
   * @description 列标题的内容属性名称
   */
  prop: string;
}

/**
 * @description 输入框类型
 */
export type InputTypes = 'input' | 'number' | 'textarea'

/**
 * @description 时间类型
 */
export type DateTypes = 'year' | 'month' | 'date' | 'dates' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'monthrange' | 'time'

/**
 * @description 通用字典内容
 */
export interface IDictValue {
  /**
   * @description 键
   */
  label: string;
  /**
   * @description 值
   */
  value: string | number | boolean;
}

/**
 * @description 字典
 */
export interface IDict {
  /**
   * @description 数据字典值
   */
  dicData?: IDictValue[];
  /**
   * @description 数据字典接口url地址
   */
  dicUrl?: string;
  /**
   * @description 数据字典接口请求参数
   */
  dicQuery?: Record<string, any>;
  /**
   * @description 数据字典接口请求头参数
   */
  dicHeaders?: Record<string, any>;
  /**
   * 数据字典接口返回数据格式化方法
   * @param res 后端返回的数据
   * @description 数据字典接口返回数据格式化方法
   * @returns list、label和value
   */
  dicFormatter?: (res: any) => ({list: any[], label: string, value: string})
}

export interface ISelectColumn {
  /**
   * @description 是否多选
   */
  multiple?: boolean;
  /**
   * @description 可清除
   */
  clearable?: boolean;
  /**
   * @description 筛选
   */
  filterable?: boolean;
  /**
   * 自定义筛选方法
   * @description 自定义筛选方法
   * @param {string} keyword 筛选词s
   * @returns 
   */
  filterMethod?: (keyword: string) => void,
  /**
   * @description 是否从服务器远程加载
   */
  remote?: boolean;
  /**
   * 远程搜索
   * @description 远程搜索
   * @param {string} keyword 筛选词
   * @returns 
   */
  remoteMethod?: (keyword: string) => void,
  /**
   * @description 是否正在从远程获取数据
   */
  loading?: boolean;
}
