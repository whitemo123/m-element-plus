<script lang="ts" setup>
import { ref } from 'vue'
import { ITableOption, tableProps, tableEmits } from './table'

import "../style/index.scss"

defineOptions({
  name: 'MTable',
})

// 默认表格option
const defaultTableOption = {
  // 序号列宽度
  indexWidth: 50,
  // 选择栏宽度
  selectionWidth: 50,

  // // 有操作栏
  // menu: true,
  // // 操作栏宽度
  // menuWidth: 220,
  // // 操作栏标题
  // menuTitle: '操作',
  // // 操作栏右固定,
  // menuFixed: 'right',
  // // 操作栏编辑按钮
  // editBtn: true,
  // editBtnText: '编辑',
  // editBtnIcon: '',
  // // 操作栏删除按钮
  // delBtn: true,
  // delBtnText: '删除',
  // delBtnIcon: '',
  // // 操作栏查看按钮
  // viewBtnText: '查看',
  // viewBtnIcon: ''
}

const props = defineProps(tableProps)

// 表格配置
const tableOption = ref<ITableOption>({
  column: []
})

// 导出
const emits = defineEmits(tableEmits)

// 合并表格配置
tableOption.value = Object.assign(defaultTableOption, props.option)

// 当前表格单选值
const currentRadio = ref<string>('')

/**
 * 单选选中
 * @param value 
 */
const tableRadioChange = (value: string | number | boolean) => {
  currentRadio.value = value as string;
}

console.log(props, tableOption.value);
</script>

<template>
  <div class="m-table">
    <el-table
      :data="data"
    >
      <!--选择列-->
      <!--多选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'checkbox'" type="selection" :width="tableOption.selectionWidth" align="center" />
      <!--单选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'radio'" :width="tableOption.selectionWidth" align="center">
        <template #default="{row}">
          <el-radio class="table-radio" v-model="currentRadio" :label="JSON.stringify(row)" @change="tableRadioChange">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <!--索引列-->
      <el-table-column v-if="tableOption.index" type="index" :width="tableOption.indexWidth" align="center" />
      <el-table-column label="测试" prop="test" align="center" />
      <!-- <template v-if=""></template> -->
    </el-table>
  </div>
</template>
