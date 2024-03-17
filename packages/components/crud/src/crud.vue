<script setup lang="ts">
import { computed, ref, watch, useSlots } from 'vue'
import { MPagination, MTable, MSearch, ISearchOption, ITableOption, ISearchOptionColumn, ITableOptionColumn, SearchInstance, IFormOption, IFormOptionColumn } from "@m-element-plus/components";
import { crudProps, crudEmits, ICrudOption, ICrudOptionColumn } from './crud';

defineOptions({
  name: 'MCrud',
})

const props = defineProps(crudProps)

const emits = defineEmits(crudEmits)

const slots = useSlots()

// 搜索ref
const mSearchRef = ref<SearchInstance>()

/**
 * @description crud配置
 */
const crudOption = ref<ICrudOption>({
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
  column: props.option!.column
})

/**
 * @description 搜索配置
 */
const searchOption = ref<ISearchOption>({
  ...crudOption.value,
  column: []
})

/**
 * @description 表格配置
 */
const tableOption = ref<ITableOption>({
  ...crudOption.value,
  column: []
})

/**
 * @description 表单配置
 */
const formOption = ref<IFormOption>({
  ...crudOption.value,
  column: []
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
const formSlotColumns = computed(() => formOption.value.column.filter(item => item.slot))

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
  emits('search', form)
}

/**
 * @description 重置搜索
 */
const handleReset = () => {
  emits('reset')
}

/**
 * @description 设置所有配置列
 * @param { ICrudOptionColumn[] } arr crud配置列
 */
const setAllOptionColumn = (arr: ICrudOptionColumn[]): void => {
  // 表格配置列
  const tableColumns: ITableOptionColumn[] = []
  // 搜索配置列
  const searchColumns: ISearchOptionColumn[] = []
  // 表单配置列
  const formColumns: IFormOptionColumn[] = []

  for (let i = 0; i < crudOption.value.column.length; i++) {
    const columnItem: ICrudOptionColumn = JSON.parse(JSON.stringify(arr[i]))
    // ==== 搜索 ====
    // 是否开启搜素
    if (columnItem.search) {
      searchColumns.push({
        ...columnItem,
        // 插槽
        slot: columnItem.searchSlot,
        // 搜索默认参数
        value: columnItem.searchValue,
        // 搜索输入框最大长度
        maxlength: columnItem.searchMaxLength,
        // 搜索输入框占位符
        placeholder: columnItem.searchPlaceholder,
      })
    }
    // =============
    // ==== 表格 ====
    // 没有隐藏列表
    if (!columnItem.hide) {
      tableColumns.push({
        ...columnItem
      })
    }
    // =============
    // ==== 表单 ====
    
    // =============
  }
  // 设置搜索列配置
  searchOption.value.column = searchColumns;
  // 设置列表配置
  tableOption.value.column = tableColumns
  // 设置表单配置
  formOption.value.column = formColumns
}


/**
 * @description 监听配置列变化
 */
watch(() => props.option as ICrudOption, (newVal: ICrudOption) => {
  // 设置所有配置列
  setAllOptionColumn(newVal.column)

  // 设置默认配置
  if (newVal.searchLabelWidth) {
    searchOption.value.labelWidth = newVal.searchLabelWidth
  }
  if (newVal.formLabelWidth) {
    formOption.value.labelWidth = newVal.formLabelWidth
  }
}, {
  immediate: true,
  deep: true
})

console.log(2222)
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
      <el-button v-if="crudOption.addBtn" :size="size" type="primary" :icon="crudOption.addBtnIcon">{{ crudOption.addBtnText }}</el-button>
      <slot name="topLeft" />
    </div>
    <!--表格-->
    <m-table
      :data="data"
      :size="size"
      :loading="loading"
      :permission="permission"
      :option="tableOption"
      v-model:select="selectData"
    > 
      <!--动态创建列表的插槽，并传递row,$index-->
      <template v-for="(item, index) in tableSlotColumns" :key="index" v-slot:[item.prop]="scope">
        <slot :name="item.prop" v-bind="scope"  />
      </template>
      <!--菜单插槽-->
      <template v-slot:menu="scope">
        
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
  </div>
</template>
