<script setup lang="ts">
import { ref } from 'vue'
import { ITableOption, MTable } from '@m-element-plus/components'
import '@m-element-plus/theme-chalk/dist/index.css'


const tableOption: ITableOption = {
  index: true,
  selection: 'radio',
  column: []
}

const tableData = ref<any>([
  {
    test: 1,
    id: 1
  },
  {
    id: 2,
    test: 2
  },
])

const selects = ref<any>([
  {
    test: 2,
    id: 2
  }
])

const sortChange = (data: {column: any, prop: string, order: string}) => {
  console.log(data);
}

const selectionChange = (selection: any) => {
  console.log(selection)
}
</script>

<template>
  <div>
    {{ selects }}
    <MTable rowKey="test" v-model:select="selects" :data="tableData" :option="tableOption" @sort-change="sortChange" @selection-change="selectionChange" />
  </div>
</template>

<style scoped lang="scss">

</style>
