<script lang="ts" setup>
import { ref } from 'vue';
import { MForm } from '@m-element-plus/components';
import type { IFormOption } from '@m-element-plus/components'

const form = ref<any>({})

const option: IFormOption = {
  column: [
    {
      label: '姓名',
      prop: 'name',
      type: 'input'
    },
    {
      label: '年龄',
      prop: "age",
      type: "number",
      rule: [
        {
          required: true,
          message: '请输入年龄',
          trigger: 'blur'
        }
      ]
    },
    {
      label: "备注",
      prop: "ramarks",
      type: "textarea",
      span: 24
    },
    {
      label: "性别",
      prop: "sex",
      type: "radio",
      value: 1,
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
    },
    {
      label: "城市",
      prop: "city",
      type: "select",
      clearable: true,
      dicData: [
        {
          label: "深圳",
          value: "sz"
        },
        {
          label: "南京",
          value: "nj"
        }
      ]
    },
    {
      label: "爱好",
      prop: "habbit",
      type: "checkbox",
      dicData: [
        {
          label: "打篮球",
          value: 1
        },
        {
          label: "吹气球",
          value: 2
        }
      ]
    },
    {
      label: "状态",
      prop: "status",
      type: "switch",
      dicData: [
        {
          label: "禁用",
          value: 1
        },
        {
          label: "启用",
          value: 2
        },
      ]
    }
  ]
}

const loading = ref(false)
</script>

<template>

  <MForm
    size="default"
    :model="form"
    :option="option"
    :loading="loading"
  >
  </MForm>
</template>

<style lang="scss" scoped>
</style>
