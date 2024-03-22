<script setup lang="ts">
import { ref } from 'vue'
import {ITableOption, MTable, MCrud, MPagination, ICrudPage, ICrudOption, CrudInstance} from '@m-element-plus/components'
import '@m-element-plus/theme-chalk/dist/index.css'

const query = ref<ICrudPage>({
  page: 1,
  limit: 10
})

const crudRef = ref<CrudInstance>()

const total = ref(0)

const loading = ref(false)

const formValue = ref<any>({})

const selects = ref<any>([])

const tableData = ref<any>([
  {
    name: "小刘",
    role: 2,
    sex: 1
  }
])

const option = ref<ICrudOption>({
  index: true,
  column: [
    {
      label: "姓名",
      prop: "name",
      search: true,
      align: "center",
      rules: [
        {required: true, message: "请输入姓名", trigger: "blur"}
      ],
      value: "默认姓名",
      slot: true
    },
    {
      label: "身份",
      prop: "role",
      type: "select",
      search: true,
      align: "center",
      dicData: [
        {
          label: "老师",
          value: 1
        },
        {
          label: "学生",
          value: 2
        },
        {
          label: "家长",
          value: 3
        }
      ]
    },
    {
      label: "性别",
      prop: "sex",
      type: "radio",
      align: "center",
      search: true,
      dicData: [
        {
          label: "男",
          value: 1
        },
        {
          label: "女",
          value: 2
        }
      ]
    }
  ]
})

const rowSave = (form: any, done: Function, loading: Function) => {
  console.log(form)
}
</script>

<template>
  <div>
    <MCrud
      ref="crudRef"
      v-model:search="query"
      v-model:select="selects"
      v-model="formValue"
      :loading="loading"
      :data="tableData"
      :total="total"
      :option="option"
      @rowSave="rowSave"
    >
      <template v-slot:name="{row, $index}">
        <span @click="crudRef?.rowView(row, $index)">{{ row.name }}</span>
      </template>
    </MCrud>
  </div>
</template>

<style scoped lang="scss">

</style>
