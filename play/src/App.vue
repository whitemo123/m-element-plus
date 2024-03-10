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
      type: "checkbox",
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
    },
    {
      label: "图片",
      prop: "pic",
      type: 'picture',
      align: 'center'
    },
    {
      label: "qrcode1",
      prop: "qrcode1",
      type: "qrcode",
      align: "center"
    }
  ]
}

const tableData = ref<any>([
  {
    test: '测试1',
    id: 1,
    slot1: 'slot1',
    status: 1,
    pic: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
    qrcode1: '1'
  },
  {
    id: 2,
    test: '测试2',
    slot1: 'slot1',
    status: 2,
    qrcode1: 'sasasaasaa'
  },
  {
    id: 3,
    test: '测试3',
    slot1: 'slot1',
    status: '1,2',
    qrcode1: 'sa121saa212aa21asa21'
  },
])

const selects = ref<any>([])
</script>

<template>
  <div>
    <MTable v-model:select="selects" :data="tableData" :option="tableOption">
      <template #slot1="{row, $index}">
        测试
      </template>
    </MTable>
  </div>
</template>

<style scoped lang="scss">

</style>
