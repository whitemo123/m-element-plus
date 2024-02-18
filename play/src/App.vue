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

const selects = ref<any>([])

selects.value = [tableData.value[1]]

const sortChange = (data: {column: any, prop: string, order: string}) => {
  console.log(data);
}

const selectionChange = (selection: any) => {
  console.log(selection)
}

const test = () => {
  tableData.value = [
    {
      id: 3,
      test: 3
    },
  ]
}
</script>

<template>
  <div>
    {{ selects }}
    <MTable size="small" v-model:select="selects" :data="tableData" :option="tableOption" @sort-change="sortChange" @selection-change="selectionChange" />
    <button @click="test">测试</button>
  </div>
</template>

<style scoped lang="scss">

</style>
