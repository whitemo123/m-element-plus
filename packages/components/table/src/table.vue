<script lang="ts" setup>
import { ref } from 'vue'
import { ITableOption, tableProps, tableEmits } from './table'

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

// 当前表格单选值
const currentRadio = ref<string>('')

// 导出
const emits = defineEmits(tableEmits)

// 如果单选模式需要指定rowKey（默认id）
if (props.option?.selection && props.option?.selection === 'radio') {
  // 合并表格配置
  tableOption.value = Object.assign(defaultTableOption, {rowKey: 'id'}, props.option)
} else {
  // 合并表格配置
  tableOption.value = Object.assign(defaultTableOption, props.option)
}

// 开启了选择模式
if (tableOption.value.selection && props.select && props.select.length) {
  if (tableOption.value.selection === 'radio') {
    // 单选
    if (props.select.length > 1) {
      throw new Error('在radio选择模式下，select只能一条')
    }
    // @ts-ignore
    const select: any = props.data?.find((item: any) => item[tableOption.value.option?.rowKey as string] === props.select[0][tableOption.value.option?.rowKey]);
    if (select) {
      currentRadio.value = JSON.stringify(select)
    }
  } else {
    // 多选
  }
}

/**
 * 单选选中
 * @param value 
 */
const tableRadioChange = (value: string | number | boolean) => {
  currentRadio.value = value as string;
  const selects = [JSON.parse(value as string)];
  emits('selectionChange', selects)
  emits('update:select', selects)
}

/**
 * 排序变化
 * @param data 
 */
const tableSortChange = (data: {column: any, prop: string, order: string}) => {
  emits('sortChange', data);
}

/**
 * 表格多选改变
 * @param selection 
 * @param row 
 */
const tableSelectionChange = (selection: any) => {
  const selects = JSON.parse(JSON.stringify(selection));
  emits('selectionChange', selects);
  emits('update:select', selects)
}
</script>

<template>
  <div class="m-table">
    <el-table
      :data="data"
      @sort-change="tableSortChange"
      @selection-change="tableSelectionChange"
    >
      <!--选择列-->
      <!--多选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'checkbox'" type="selection" :width="tableOption.selectionWidth" align="center" />
      <!--单选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'radio'" :width="tableOption.selectionWidth" align="center">
        <template #default="{row}">
          {{ currentRadio }} {{ row }}
          <el-radio class="table-radio" v-model="currentRadio" :label="JSON.stringify(row)" @change="tableRadioChange">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <!--索引列-->
      <el-table-column v-if="tableOption.index" type="index" :width="tableOption.indexWidth" align="center" />
      <el-table-column sortable="custom" label="测试" prop="test" align="center" />
      <!-- <template v-if=""></template> -->
    </el-table>
  </div>
</template>
