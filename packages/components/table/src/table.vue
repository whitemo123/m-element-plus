<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElTable } from 'element-plus'
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

const tableRef = ref<InstanceType<typeof ElTable>>()

// 导出
const emits = defineEmits(tableEmits)

// 合并表格配置
tableOption.value = Object.assign(defaultTableOption, props.option)

/**
 * 单选框点击
 * @param {string} value 值
 */
const tableRadioClick = (value: string) => {
  let selects: any;
  if (currentRadio.value === value) {
    currentRadio.value = ''
    selects = []
  } else {
    currentRadio.value = value as string
    selects = [JSON.parse(value as string)]
  }
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

onMounted(() => {
  // 开启了选择模式
  if (tableOption.value.selection && props.select && props.select.length) {
    if (tableOption.value.selection === 'radio') {
      // 单选
      if (props.select.length > 1) {
        throw new Error('在radio选择模式下，select只能一条')
      }
      currentRadio.value = JSON.stringify(props.select[0])
    } else {
      // 多选
      for (let i = 0; i < props.select.length; i++) {
        tableRef.value?.toggleRowSelection(props.select[i], true)
      }
    }
  }
})

// TODO: 单选模式列表刷新未清除
</script>

<template>
  <div class="m-table">
    <el-table
      ref="tableRef"
      :data="data"
      :size="size"
      :stripe="tableOption.stripe"
      :border="tableOption.border"
      :rowKey="tableOption.rowKey"
      :default-sort="(tableOption.defaultSort as any)"
      :show-summary="tableOption.showSummary"
      @sort-change="tableSortChange"
      @selection-change="tableSelectionChange"
    >
      <!--选择列-->
      <!--多选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'checkbox'" type="selection" :width="tableOption.selectionWidth" align="center" />
      <!--单选框-->
      <el-table-column v-if="tableOption.selection && tableOption.selection === 'radio'" :width="tableOption.selectionWidth" align="center">
        <template #default="{row}">
          <el-radio class="table-radio" @click.native.prevent="tableRadioClick(JSON.stringify(row))" v-model="currentRadio" :label="JSON.stringify(row)">{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <!--索引列-->
      <el-table-column v-if="tableOption.index" type="index" :width="tableOption.indexWidth" align="center" />
      <el-table-column sortable="custom" label="测试" prop="test" align="center" />
      <!-- <template v-if=""></template> -->
    </el-table>
  </div>
</template>
