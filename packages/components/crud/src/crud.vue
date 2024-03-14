<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { MPagination, MTable, MSearch, ISearchOption, ITableOption, ISearchOptionColumn, ITableOptionColumn } from "@m-element-plus/components";
import { crudProps, crudEmits, ICrudOption, ICrudOptionColumn } from './crud';

defineOptions({
  name: 'MCrud',
})

const props = defineProps(crudProps)

const emits = defineEmits(crudEmits)

/**
 * @description 搜索配置
 */
const searchOption = ref<ISearchOption>({
  column: []
})

/**
 * @description 表格配置
 */
const tableOption = ref<ITableOption>({
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
 * @description 表格已经开启插槽columns
 */
const tableSlotColumns = computed(() => tableOption.value.column.filter(item => item.slot))

/**
 * @description 搜索已经开启插槽的columns
 */
const searchSlotColumns = computed(() => searchOption.value.column.filter(item => item.slot))

/**
 * @description 获取搜索表单的配置项
 * @param { ICrudOption } crudOption crud配置项
 */
 const getSearchOption = (crudColumns: ICrudOptionColumn[]): ISearchOptionColumn[] => {
  if (!crudColumns || !crudColumns.length) {
    return []
  }
  // 搜索-columns
  const columns: ISearchOptionColumn[] = []
  for (let i = 0; i < crudColumns.length; i++) {
    const columnItem: ICrudOptionColumn = crudColumns[i]
    // 是否开启搜素
    if (columnItem.search) {
      columns.push({
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
  }
  return columns
}


/**
 * @description 获取列表的配置项
 * @param { ICrudOption } crudOption crud配置项
 */
 const getTableOption = (crudColumns: ICrudOptionColumn[]): ITableOptionColumn[] => {
  if (!crudColumns || !crudColumns.length) {
    return []
  }
  // 搜索-columns
  const columns: ITableOptionColumn[] = []
  for (let i = 0; i < crudColumns.length; i++) {
    const columnItem = crudColumns[i]
    // 没有隐藏列表
    if (!columnItem.hide) {
      columns.push({
        ...columnItem
      })
    }
  }
  return columns
}

/**
 * @description 当前页发生改变
 */
const currentPageChange = (page: number) => {
  searchForm.value.page = page
}

/**
 * @description 页大小发生变化
 */
const pageSizeChange = (pageSize: number) => {
  searchForm.value.limit = pageSize
}

/**
 * @description 搜索事件
 * @param form 搜索表单值
 * @param done 完成回调
 */
const handleSearch = (form: any, done: Function) => {
  emits('search', form, done)
}

/**
 * @description 重置搜索
 */
const handleReset = () => {
  emits('reset')
}

/**
 * @description 监听配置项的实时变化
 */
 watch(() => props.option as ICrudOption, (newVal: ICrudOption) => {
  // 更新搜索配置
  searchOption.value = {
    ...newVal,
    column: getSearchOption(newVal.column)
  }
  // 更新表格配置
  tableOption.value = {
    ...newVal,
    column: getTableOption(newVal.column)
  }
}, {
  immediate: true,
  deep: true
})
</script>

<template>
  <div class="m-crud">
    <!--搜索区域-->
    <m-search
      :option="searchOption"
      v-model="searchForm"
      :permission="permission"
      @search="handleSearch"
      @reset="handleReset"
    >
      <template v-for="(item, index) in searchSlotColumns" :key="index" v-slot:[item.prop]="scope">
        <slot :name="item.prop + 'Search'" v-bind="scope" />
      </template>
    </m-search>
    <!--表格-->
    <m-table
      :data="data"
      :size="size"
      :permission="permission"
      :option="tableOption"
    > 
      <!--动态创建列表的插槽，并传递row,$index-->
      <template v-for="(item, index) in tableSlotColumns" :key="index" v-slot:[item.prop]="scope">
        <slot :name="item.prop" v-bind="scope"  />
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
