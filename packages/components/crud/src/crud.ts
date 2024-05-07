import { buildProps, definePropType, isNumber, isFunction } from "@m-element-plus/utils";
import { useSizeProp } from '@m-element-plus/hooks'

import type { ITableDefaultSort, ITableOption, ITableOptionColumn } from "@m-element-plus/components/table";
import { ISearchOption, ISearchOptionColumn } from "@m-element-plus/components/search";
import { FormItemRule } from "element-plus";

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
   * @description 搜索排序
   */
  searchOrder?: number;
  /**
   * @description 表单排序
   */
  formOrder?: number;
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
  /**
   * @description 搜索规则
   */
  searchRules?: FormItemRule[];
  /**
   * @description 新增表单隐藏
   */
  addHide?: boolean;
  /**
   * @description 编辑表单隐藏
   */
  editHide?: boolean;
  /**
   * @description 查看表单隐藏
   */
  viewHide?: boolean;
  /**
   * @description 新增插槽
   */
  addSlot?: boolean;
  /**
   * @description 编辑插槽
   */
  editSlot?: boolean;
  /**
   * @description 查看插槽
   */
  viewSlot?: boolean;
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
   * @description 搜索label宽度
   */
  searchLabelWidth?: string;
  /**
   * @description 表单label宽度
   */
  formLabelWidth?: string;
  /**
   * @description 新增弹窗标题
   */
  addDialogTitle?: string;
  /**
   * @description 编辑弹窗标题
   */
  editDialogTitle?: string;
  /**
   * @description 查看弹窗标题
   */
  viewDialogTitle?: string;
  /**
   * @description 弹窗宽度
   */
  dialogWidth?: string;
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
   * @description 表单绑定值
   */
  modelValue: {
    type: Object,
    required: true
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
  },
  /**
   * @description 新增/编辑确认前事件
   */
  beforeEnter: {
    type: Function,
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
   * @description 更新表单值
   * @param data 表单绑定值
   * @returns 
   */
  ['update:modelValue']: (data: any) => true,
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
  /**
   * @description 新增事件
   * @param form 表单内容
   * @param done 完成回调
   * @param loading 加载关闭回调
   * @returns 
   */
  rowSave: (form: any, done: Function, loading: Function) => isFunction(done) && isFunction(loading),
  /**
   * @description 修改事件
   * @param form 表单内容
   * @param done 完成回调
   * @param loading 加载关闭回调
   * @returns 
   */
  rowEdit: (form: any, done: Function, loading: Function) => isFunction(done) && isFunction(loading),
  /**
   * @description 删除事件
   * @param row 行数据
   * @param index 行索引
   * @returns 
   */
  rowDel: (row: any, index: number) => true,
  /**
   * @description 表单取消
   * @param row 行数据
   * @param index 索引
   * @param type 类型
   * @returns 
   */
  rowCancel: (row: any, index: number, type: 'add' | 'edit' | 'view') => true
}
