<script setup lang="ts">
import { ref, watch } from 'vue' 
import { ISearchOption, searchProps } from './search';

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
    <el-form :size="size" :inline="true">
      <el-row>
        <el-col v-for="(column, columnIndex) in searchOption.column" :key="columnIndex">
          <template v-if="column.type === ''"></template>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
