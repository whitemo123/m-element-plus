<script setup lang="ts">
import { ref } from 'vue'
import {ITableOption, MTable, MCrud, MPagination, ICrudPage, ICrudOption} from '@m-element-plus/components'
import '@m-element-plus/theme-chalk/dist/index.css'

const query = ref<ICrudPage>({
  page: 1,
  limit: 10
})

const total = ref(100)

const loading = ref(false)

const tableOption: ICrudOption = {
  col: false,
  colIndex: 2,
  border: true,
  addBtn: false,
  column: [
    {
      label: '测试',
      prop: 'test',
      align: 'center',
      overHidden: true,
      type: 'input',
      help: '我是帮助信息',
      search: true,
      searchSlot: false,
      searchValue: '2'
    },
    {
      label: 'ID',
      prop: 'id',
      align: 'center'
    },
    {
      label: '插槽',
      prop: 'slot1',
      slot: true,
      align: 'center',
      dicFormatter: (res) => ({list: res.data, label: 'name', value: 'id'})
    },
    {
      label: "状态",
      prop: "status",
      type: "checkbox",
      align: "center",
      search: true,
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
    // {
    //   label: "图片",
    //   prop: "pic",
    //   type: 'picture',
    //   align: 'center'
    // },
    // {
    //   label: "qrcode1",
    //   prop: "qrcode1",
    //   type: "qrcode",
    //   align: "center"
    // },
    {
      label: "time",
      prop: "time",
      align: "center",
      type: "year",
      search: true,
      searchPlaceholder: '请选择年'
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
    qrcode1: '1',
    time: '2023'
  },
  {
    id: 2,
    test: '测试2',
    slot1: 'slot1',
    status: 2,
    qrcode1: 'sasasaasaa',
    time: '2024'
  },
  {
    id: 3,
    test: '测试3',
    slot1: 'slot1',
    status: '1,2',
    qrcode1: 'sa121saa212aa21asa21',
    time: '2021'
  },
])

const selects = ref<any>([])
</script>

<template>
  <div>
    <MCrud
      v-model:search="query"
      v-model:select="selects"
      :loading="loading"
      :data="tableData"
      :total="total"
      :option="tableOption"
    >
      <template v-slot:slot1="{row, $index}">
        <span>{{ row.slot1 }}</span>
      </template>
      <template v-slot:testSearch="{ $query }">
        <input v-model="$query.test" />
      </template>
    </MCrud>
  </div>
</template>

<style scoped lang="scss">

</style>
