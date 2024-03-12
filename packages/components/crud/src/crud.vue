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
 * @description 表格已经开启插槽columns
 */
const tableSlotColumns = computed(() => tableOption.value.column.filter(item => item.slot))


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
    const columnItem = crudColumns[i]
    // 是否开启搜素
    if (columnItem.search) {
      columns.push({
        ...columnItem,
        slot: columnItem.searchSlot
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
  emits('update:page', {
    page: page,
    limit: props.page['limit']
  })
}

/**
 * @description 页大小发生变化
 */
const pageSizeChange = (pageSize: number) => {
  emits('update:page', {
    page: props.page['page'],
    limit: pageSize
  })
}

/**
 * @description 监听配置项的实时变化
 */
 watch(() => props.option, (newVal: ICrudOption) => {
  // 更新搜索配置
  searchOption.value.column = getSearchOption(newVal.column)
  // 更新表格配置
  tableOption.value.column = getTableOption(newVal.column)
}, {
  immediate: true,
  deep: true
})
</script>

<template>
  <div class="m-crud">
    <m-search
      :option="searchOption"
    >
    </m-search>
    <m-table
      :data="data"
      :size="size"
      :option="tableOption"
    > 
      <!--动态创建列表的插槽，并传递row,$index-->
      <template v-for="item in tableSlotColumns" v-slot:[item.prop]="scope">
        <slot :key="item.prop" :name="item.prop" v-bind="scope"  />
      </template>
    </m-table>
    <div
      class="m-pagination-box"
      v-if="total"
    >
      <m-pagination
        :small="size === 'small'"
        :total="total"
        :current-page="page.page"
        :page-size="page.limit"
        :disabled="loading"
        @currentPage="currentPageChange"
        @pageSize="pageSizeChange"
      />
    </div>
  </div>
</template>
