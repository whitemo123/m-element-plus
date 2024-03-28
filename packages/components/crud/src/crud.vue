<script setup lang="ts">
import { computed, onMounted, ref, useSlots, nextTick } from 'vue'

import { isEmpty } from '../../common/utils'
import { useGlobalConfig } from '@m-element-plus/components/config-provider'
import MPagination from '@m-element-plus/components/pagination'
import MTable from '@m-element-plus/components/table'
import MDialog from '@m-element-plus/components/dialog'
import MSearch, { SearchInstance } from '@m-element-plus/components/search'
import MForm, { FormInstance }  from '@m-element-plus/components/form'
import type { ITableOption, ITableOptionColumn, TableInstance } from '@m-element-plus/components/table'
import type { ISearchOption, ISearchOptionColumn } from '@m-element-plus/components/search'
import type { IFormOption, IFormOptionColumn } from '@m-element-plus/components/form'

import { crudProps, crudEmits, ICrudOption, ICrudOptionColumn } from './crud';
import { ElMessageBox } from 'element-plus';
import { cloneDeep } from 'lodash-es';

defineOptions({
  name: 'MCrud',
})

const props = defineProps(crudProps)

const emits = defineEmits(crudEmits)

const globalConfig = useGlobalConfig()

// 插槽
const slots = useSlots()

// 搜索ref
const mSearchRef = ref<SearchInstance>()

// 表格ref
const mTableRef = ref<TableInstance>()

// 表格高度
const tableHeight = ref<any>(undefined)

// 弹窗类型
const dialogType = ref<'add'|'edit'|'view'>('add')

// 弹窗状态
const formDialog = ref(false)

// 表单ref
const crudFormRef = ref<FormInstance>()

/**
 * @description crud配置
 */
const crudOption = computed<ICrudOption>(() => ({
  ...props.option,
  // 新增按钮
  addBtn: props.option?.addBtn === undefined ? true : props.option.addBtn,
  // 新增按钮图标
  addBtnIcon: props.option?.addBtnIcon === undefined ? 'Plus' : props.option.addBtnIcon,
  // 新增按钮文字
  addBtnText: props.option?.addBtnText === undefined ? '新 增' : props.option.addBtnText,
  // 操作栏显示
  menu: props.option?.menu === undefined ? true : props.option.menu,
  // 操作栏标题
  menuTitle: props.option?.menuTitle === undefined ? '操作' : props.option.menuTitle,
  // 操作栏宽度
  menuWidth: props.option?.menuWidth === undefined ? 220 : props.option.menuWidth,
  // 编辑按钮
  editBtn: props.option?.editBtn === undefined ? true : props.option.editBtn,
  // 编辑按钮文字
  editBtnText: props.option?.editBtnText === undefined ? '编 辑' : props.option.editBtnText,
  // 编辑按钮图标
  editBtnIcon: props.option?.editBtnIcon === undefined ? 'EditPen' : props.option.editBtnIcon,
  // 删除按钮
  delBtn: props.option?.delBtn === undefined ? true : props.option.delBtn,
  // 删除按钮文字
  delBtnText: props.option?.delBtnText === undefined ? '删 除' : props.option.delBtnText,
  // 编辑按钮图标
  delBtnIcon: props.option?.delBtnIcon === undefined ? 'Delete' : props.option.delBtnIcon,
  // 搜索label宽度
  searchLabelWidth: props.option?.searchLabelWidth === undefined ? '80px' : props.option.searchLabelWidth,
  // 表单label宽度
  formLabelWidth: props.option?.formLabelWidth === undefined ? '80px' : props.option.formLabelWidth,
  // 新增弹窗标题
  addDialogTitle: props.option?.addDialogTitle === undefined ? '新增' : props.option.addDialogTitle,
  // 修改弹窗标题
  editDialogTitle: props.option?.editDialogTitle === undefined ? '修改' : props.option.editDialogTitle,
  // 详情弹窗标题
  viewDialogTitle: props.option?.viewDialogTitle === undefined ? '查看' : props.option.viewDialogTitle,
  // 弹窗宽度
  dialogWidth: props.option?.dialogWidth === undefined ? '800px' : props.option.dialogWidth,

  column: props.option!.column
}))

/**
 * @description 弹窗标题
 */
const dialogTitle = computed(() => {
  let title;
  if (dialogType.value === 'add') {
    title = crudOption.value.addDialogTitle
  } else if (dialogType.value === 'edit') {
    title = crudOption.value.editDialogTitle
  } else {
    title = crudOption.value.viewDialogTitle
  }
  return title
})

/**
 * @description 搜索配置
 */
 const searchOption = computed<ISearchOption>(() => {
  // 配置列
  const column: ISearchOptionColumn[] = []

  for (let i = 0; i < crudOption.value.column.length; i++) {
    const columnItem: ICrudOptionColumn = cloneDeep(crudOption.value.column[i])
    // 是否开启搜素
    if (columnItem.search) {
      const resultColumn: ISearchOptionColumn = {
        ...columnItem,
        // 插槽
        slot: columnItem.searchSlot,
        // 规则
        rules: columnItem.searchRules,
        // 搜索默认参数
        value: columnItem.searchValue,
        // 搜索输入框最大长度
        maxlength: columnItem.searchMaxLength,
        // 搜索输入框占位符
        placeholder: columnItem.searchPlaceholder,
      }
      delete resultColumn.order
      // 排序字段不为空
      if (!isEmpty(resultColumn.searchOrder)) {
        resultColumn.order = resultColumn.searchOrder
      }
      column.push(resultColumn)
    }
  }

  // 配置项
  const options: ISearchOption = {
    ...crudOption.value,
    // 搜索label宽度
    labelWidth: crudOption.value.searchLabelWidth,
    // 配置列
    column
  }
  return options
})

/**
 * @description 表格配置
 */
const tableOption = computed<ITableOption>(() => {
  // 配置列
  const column: ITableOptionColumn[] = []

  for (let i = 0; i < crudOption.value.column.length; i++) {
    const columnItem: ICrudOptionColumn = crudOption.value.column[i]
    if (!columnItem.hide) {
      column.push({
        ...columnItem
      })
    }
  }

  // 配置项
  const options: ITableOption = {
    ...crudOption.value,
    // 配置列
    column
  }
  return options
})


/**
 * @description 表单配置
 */
const formOption = computed<IFormOption>(() => {
  // 配置列
  const column: IFormOptionColumn[] = []

  for (let i = 0; i < crudOption.value.column.length; i++) {
    const columnItem: ICrudOptionColumn = cloneDeep(crudOption.value.column[i])
    delete columnItem.slot
    // 清空排序
    delete columnItem.order

    if (!isEmpty(columnItem.formOrder)) {
      columnItem.order = columnItem.formOrder
    }

    if (dialogType.value === 'add') {
      // 新增
      if (!columnItem.addHide) {
        column.push({
          ...columnItem
        })
      }
    } else if (dialogType.value === 'edit') {
      // 修改
      if (!columnItem.editHide) {
        column.push({
          ...columnItem
        })
      }
    } else {
      // 查看
      if (!columnItem.viewHide) {
        column.push({
          ...columnItem
        })
      }
    }
  }

  // 配置项
  const options: IFormOption = {
    ...crudOption.value,
    // 表单label宽度
    labelWidth: crudOption.value.formLabelWidth,
    // 配置列
    column
  }
  return options
})

/**
 * @description 搜索表单数据
 */
const searchForm = computed({
  get() {
    return props.search
  },
  set(value: any) {
    emits('update:search', value)
  }
})

/**
 * @description 表单绑定值
 */
const modelForm = computed({
  get() {
    return props.modelValue
  },
  set(value: any) {
    emits('update:modelValue', value)
  }
})


/**
 * @description 选择的数据
 */
const selectData = computed({
  get() {
    return props.select
  },
  set(value: any) {
    emits('update:select', value)
  }
})

/**
 * @description 表格已经开启插槽columns
 */
const tableSlotColumns = computed(() => tableOption.value.column.filter(item => item.slot))

/**
 * @description 搜索已经开启插槽的columns
 */
const searchSlotColumns = computed(() => searchOption.value.column.filter(item => item.slot))

/**
 * @description 表单已经开启插槽的columns
 */
const formSlotColumns = computed(() => {
  if (dialogType.value === 'add') {
    // @ts-ignore
    return formOption.value.column.filter(item => item.addSlot)
  }
  if (dialogType.value === 'edit') {
    // @ts-ignore
    return formOption.value.column.filter(item => item.editSlot)
  }
  if (dialogType.value === 'view') {
    // @ts-ignore
    return formOption.value.column.filter(item => item.viewSlot)
  }
})

/**
 * @description 当前页发生改变
 */
const currentPageChange = (page: number) => {
  mSearchRef.value?.search(page)
}

/**
 * @description 页大小发生变化
 */
const pageSizeChange = (pageSize: number) => {
  searchForm.value.limit = pageSize
  mSearchRef.value?.search()
}

/**
 * @description 搜索事件
 * @param form 搜索表单值
 * @param done 完成回调
 */
const handleSearch = (form: any) => {
  mTableRef.value?.clearRadioCheck()
  emits('search', form)
}

/**
 * @description 重置搜索
 */
const handleReset = () => {
  mTableRef.value?.clearRadioCheck()
  emits('reset')
}

/**
 * @description 新增/修改弹窗确认
 */
const dialogEnter = async (done: Function, loading: Function) => {
  const valid = await crudFormRef.value!.validForm()
  // 校验不通过
  if (!valid) {
    loading()
    return
  }

  // 表单前校验
  if (props.beforeEnter && !(await props.beforeEnter())) {
    loading()
    return
  }

  emits("rowSave", modelForm.value, done, loading)
}

/**
 * @description 新增/修改弹窗取消
 */
const dialogCancel = () => {

}


/**
 * @description 弹窗关闭
 */
const dialogClose = () => {
  if (crudFormRef.value) {
    crudFormRef.value.clear()
  } else {
    emits('update:modelValue', {})
  }
}

/**
 * @description 打开新增函数
 */
const rowAdd = () => {
  // 弹窗类型
  dialogType.value = 'add'
  // 弹窗状态
  formDialog.value = true
}

/**
 * @description 打开编辑修改
 */
const rowEdit = (row: any, index: number) => {
  // 弹窗类型
  dialogType.value = 'edit'
  for (const key in row) {
    modelForm.value[key] = row[key]
  }
  // 弹窗状态
  formDialog.value = true
}

/**
 * @description 打开详情
 */
const rowView = (row: any, index: number) => {
  // 弹窗类型
  dialogType.value = 'view'
  for (const key in row) {
    modelForm.value[key] = row[key]
  }
  // 弹窗状态
  formDialog.value = true
}

/**
 * @description 打开删除
 */
const rowDel = (row: any, index: number) => {
  ElMessageBox.confirm(
    '此操作将删除该数据, 是否继续?',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    emits('rowDel', row, index)
  }).catch(() => {
  })
}

/**
 * @description 获取表格高度
 */
 const getTableHeight = () => {
  nextTick(() => {
    // 表格style对象
    const tableStyle = mTableRef.value?.$el;
    // 分页对象
    const pageStyle: any = document.querySelector('.m-pagination-box')
    // 额外可控制高度参数
    const calcHeight: number = props.option?.calcHeight || globalConfig.value?.calcHeight || 0

    // 表格高度设置
    tableHeight.value = document.documentElement.clientHeight - tableStyle.offsetTop - (pageStyle?.offsetHeight || 0) - calcHeight;
  })
}

onMounted(() => {
  // 获取表格高度
  getTableHeight()
})

defineExpose({
  rowAdd,
  rowEdit,
  rowView
})
</script>

<template>
  <div class="m-crud">
    <!--搜索区域-->
    <m-search
      :option="searchOption"
      :model="searchForm"
      ref="mSearchRef"
      :size="size"
      :loading="loading"
      :permission="permission"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template v-for="(item, index) in searchSlotColumns" :key="index" v-slot:[item.prop]="scope">
        <slot :name="item.prop + 'Search'" v-bind="scope" />
      </template>
    </m-search>
    <!--新增区域-->
    <div v-if="crudOption.addBtn || slots.topLeft" class="m-search-top">
      <el-button @click="rowAdd()" v-if="crudOption.addBtn" :size="size" type="primary" :icon="crudOption.addBtnIcon">{{ crudOption.addBtnText }}</el-button>
      <slot name="topLeft" />
    </div>
    <!--表格-->
    <m-table
      ref="mTableRef"
      :data="data"
      :size="size"
      :loading="loading"
      :permission="permission"
      :option="tableOption"
      v-model:select="selectData"
      :height="tableHeight"
      :maxHeight="tableHeight"
      @rowEdit="rowEdit"
      @rowDel="rowDel"
    > 
      <!--动态创建列表的插槽，并传递row,$index-->
      <template v-for="(item, index) in tableSlotColumns" :key="index" v-slot:[item.prop]="scope">
        <slot :name="item.prop" v-bind="scope"  />
      </template>
      <!--菜单插槽-->
      <template v-if="slots.menu" v-slot:menu="scope">
        <slot name="menu" v-bind="scope" />
      </template>
    </m-table>
    <!--分页区域-->
    <div
      class="m-pagination-box"
      v-if="searchForm.page && total"
    >
      <m-pagination
        :small="size === 'small'"
        :total="total"
        :current-page="searchForm.page"
        :page-size="searchForm.limit"
        :disabled="loading"
        @currentPage="currentPageChange"
        @pageSize="pageSizeChange"
      />
    </div>
    <!--表单-->
    <m-dialog
      :size="size"
      v-model="formDialog"
      :title="dialogTitle"
      save-btn-text="保 存"
      cancel-btn-text="取 消"
      :save-btn="dialogType !== 'view'"
      :cancel-btn="dialogType !== 'view'"
      :width="crudOption.dialogWidth"
      @enter="dialogEnter"
      @cancel="dialogCancel"
      @close="dialogClose"
    >
      <template v-slot="{loading}">
        <!--顶部通用插槽-->
        <slot v-if="dialogType === 'add' || dialogType === 'edit'" name="topForm" v-bind="{loading, value: modelForm}" />
        <!--顶部新增插槽-->
        <slot v-if="dialogType === 'add'" name="topAdd" v-bind="{loading, value: modelForm}" />
        <!--顶部编辑插槽-->
        <slot v-if="dialogType === 'edit'" name="topEdit" v-bind="{loading, value: modelForm}" />
        <!--顶部查看插槽-->
        <slot v-if="dialogType === 'view'" name="topView" v-bind="{loading, value: modelForm}" />
        <m-form
          ref="crudFormRef"
          :size="size"
          :model="modelForm"
          :option="formOption"
          :loading="loading"
          :readonly="dialogType === 'view'"
        >
          <template v-for="(item, index) in formSlotColumns" :key="index" v-slot:[item.prop]="scope">
            <slot :name="item.prop + 'Form'" v-bind="scope" />
          </template>
        </m-form>
        <!--底部通用插槽-->
        <slot v-if="dialogType === 'add' || dialogType === 'edit'" name="bottomForm" v-bind="{loading, value: modelForm}" />
        <!--底部新增插槽-->
        <slot v-if="dialogType === 'add'" name="bottomAdd" v-bind="{loading, value: modelForm}" />
        <!--底部编辑插槽-->
        <slot v-if="dialogType === 'edit'" name="bottomEdit" v-bind="{loading, value: modelForm}" />
        <!--底部查看插槽-->
        <slot v-if="dialogType === 'view'" name="bottomView" v-bind="{loading, value: modelForm}" />
      </template>
    </m-dialog>
  </div>
</template>
