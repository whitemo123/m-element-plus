<script setup lang="ts">
import { ref } from 'vue'
import { ITableOption, MTable } from '@m-element-plus/components'
import '@m-element-plus/theme-chalk/dist/index.css'


const tableOption: ITableOption = {
  column: [
    {
      label: '测试',
      prop: 'test',
      align: 'center',
      overHidden: true,
      type: 'input',
      help: '我是帮助信息'
    },
    {
      label: 'ID',
      prop: 'id',
    },
    {
      label: '插槽',
      prop: 'slot1',
      slot: true,
      dicFormatter: (res) => ({list: res.data, label: 'name', value: 'id'})
    },
    {
      label: "状态",
      prop: "status",
      type: "select",
      align: "center",
      dicData: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "禁用",
          value: 2
        },
      ]
    }
  ]
}

const tableData = ref<any>([
  {
    test: '测试1',
    id: 1,
    slot1: 'slot1',
    status: 1
  },
  {
    id: 2,
    test: '测试2',
    slot1: 'slot1',
    status: 2
  },
  {
    id: 3,
    test: '测试3',
    slot1: 'slot1',
    status: 1
  }
])

const selects = ref<any>([])
</script>

<template>
  <div>
    <MTable size="small" v-model:select="selects" :data="tableData" :option="tableOption">
      <template #slot1="{row, $index}">
        {{ row }} {{ $index }}
      </template>
    </MTable>
  </div>
</template>

<style scoped lang="scss">

</style>
