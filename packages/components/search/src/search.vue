<script setup lang="ts">
import { ref, watch } from 'vue' 
import { ISearchOption, ISearchOptionColumn, searchProps } from './search';

defineOptions({
  name: "MSearch"
})

const props = defineProps(searchProps)

// 默认配置
const defaultOption: ISearchOption = {
  column: []
}

// 搜索配置
const searchOption = ref<ISearchOption>({
  column: []
})

// 搜索表单
const searchForm = ref<any>({})

/**
 * @description 通过配置项获取搜索表单值
 */
const getFormByColumn = (column: ISearchOptionColumn[]) => {
  const value = {}
  for (let i = 0; i < column.length; i++) {
    console.log(column[i])
  }
  return value
}

watch(() => props.option, (newVal: ISearchOption) => {
  // 更新配置项
  searchOption.value = Object.assign(defaultOption, newVal);
}, {
  immediate: true,
  deep: true
})
</script>

<template>
  <div class="m-search-box">
    <el-form :size="size" :inline="true" @submit.native.prevent>
      <el-row>
        <el-col v-for="(column, columnIndex) in searchOption.column" :key="columnIndex">
          <el-form-item :label="column.label + '：'" :prop="column.prop">
            <template v-if="column.type === 'input'">
                <el-input />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
