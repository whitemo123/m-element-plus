<script lang="ts" setup>
import { computed, onMounted, ref, useSlots } from 'vue'
import { ElTable } from 'element-plus'
import MRender from '@m-element-plus/components/render'
import MPicture from '@m-element-plus/components/picture'
import MQrcode from '@m-element-plus/components/qrcode'
import MDialog from '@m-element-plus/components/dialog'
import QrcodeFix from 'qrcodejs2-fix'
import { ITableOption, tableProps, tableEmits, ITableOptionColumn } from './table'
import type { IDictValue } from '../../common/types'
import { isArray } from '@m-element-plus/utils'

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

const slots = useSlots()

// 表格配置
const tableOption = ref<ITableOption>({
  column: []
})

// 表格列配置
const tableColumn = computed<ITableOptionColumn[]>(() => {
  const result: ITableOptionColumn[] = []
  const columns = props.option?.column || []
  for (let i = 0; i < columns.length; i++) {
    if (!columns[i].hide && props.permission[columns[i].prop] !== false) {
      result.push({
        ...columns[i]
      })
    }
  }
  return result
})

// 当前表格单选值
const currentRadio = ref<string>('')

// table Ref
const tableRef = ref<InstanceType<typeof ElTable>>()

// qrcode预览
const qrcodePreview = ref(false)

// qrcode值
const previewQrcode = ref('')

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
 * 获取字典value值
 * @param column 列
 * @param row 行数据
 */
const getDictValue = (column: ITableOptionColumn, row: any): string => {
  const findLabelByValue = (dicData: IDictValue[], value: any) => {
    const dictItem = (dicData || []).find(dict => column.multiple ? dict.value == value : dict.value === value)
    if (dictItem === undefined) {
      return undefined;
    }
    return dictItem.label
  }
  let dictLabel: string | undefined;
  if (column.type === 'select' && column.multiple) {
    // select下拉且开启多选
    const values: any = (row[column.prop] instanceof Array) ? row[column.prop] : typeof row[column.prop] === 'string' ? row[column.prop].split(',') : [row[column.prop]]
    const result: string[] = []
    for (let i = 0; i < values.length; i++) {
      dictLabel = findLabelByValue((column.dicData || []), values[i])
      if (dictLabel === undefined) {
        break;
      }
      result.push(dictLabel)
    }
    return result.join(',')
  }
  dictLabel = findLabelByValue((column.dicData || []), row[column.prop])
  if (dictLabel === undefined) {
    return ''
  }
  return dictLabel
}

/**
 * @description 获取预览图片
 * @param column 
 * @param row 
 */
const getPreviewPics = (column: ITableOptionColumn, row: any): string[] => {
  let value = row[column.prop]
  if (!value) {
    return []
  }
  if(isArray(value)) {
    return value.map(item => (column.imgPrefix || '') + item)
  }
  value = new String(value)
  return value.split((column.imgSuffix || ',')).map(item => (column.imgPrefix || '') + item)
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

/**
 * @description 行编辑
 */
const rowEdit = (row: any, index: number) => {
  emits('rowEdit', row, index)
}

/**
 * @description 行删除
 */
const rowDel = (row: any, index: number) => {
  emits('rowDel', row, index)
}

/**
 * @description 预览qrcode二维码
 * @param code qrcode二维码
 */
const openQrcodePreview = (code: string) => {
  previewQrcode.value = code;
  if (!code) {
    return
  }
  qrcodePreview.value = true
  setTimeout(() => {
    const dom = document.querySelector("#qrcode-preview")
    dom!.innerHTML = ''
    new QrcodeFix(dom, {
      text: code,
      width: 180,
      height: 180
    })
  }, 0)
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
  <div class="m-table" v-if="tableColumn && tableColumn.length">
    <el-table
      ref="tableRef"
      :data="data"
      :size="size"
      v-loading="loading"
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
      <el-table-column
        v-for="(column, columnIndex) in tableColumn"
        :key="columnIndex"
        :label="column.label"
        :prop="column.prop"
        :align="column.align"
        :show-overflow-tooltip="column.overHidden"
      >
        <!--帮助信息文字-->
        <template v-if="column.help" #header>
          <el-tooltip :content="column.help" placement="top">
            <div style="display: inline-flex; align-items: center; justify-content: center;">
              <span style="margin-right: 2px;">{{column.label}}</span><QuestionFilled style="width: 12px; height: 12px;" />
            </div>
          </el-tooltip>
        </template>
        <template #default="{row, $index}">
          <!--开启插槽模式-->
          <slot v-if="column.slot" :name="column.prop" v-bind="{row, $index}" />
          <!--自定义formatter-->
          <MRender v-else-if="column.formatter" :render="column.formatter(row)" />
          <!--带dicData的（例如select、checkbox、radio）-->
          <span v-else-if="column.type === 'select' || column.type === 'checkbox' || column.type === 'radio'">{{ getDictValue(column, row) }}</span>
          <!--图片-->
          <MPicture v-else-if="column.type === 'picture' && getPreviewPics(column, row).length" :src="getPreviewPics(column, row)[0]" :preview-src-list="getPreviewPics(column, row)" />
          <!--qrcode-->
          <MQrcode v-if="column.type === 'qrcode'" :align="column.align" :text="row[column.prop]" @click="openQrcodePreview" />
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableOption.menu"
        :label="tableOption.menuTitle"
        align="center"
        :width="tableOption.menuWidth"
        :fixed="tableOption.menuFixed"
      >
        <template #default="scope">
          <slot v-if="slots.menu" name="menu" v-bind="scope" />
          <template v-else>
            <el-link
              class="m-control-btns"
              type="primary"
              :underline="false"
              v-if="tableOption.editBtn"
              :icon="tableOption.editBtnIcon"
              @click="rowEdit(scope.row, scope.$index)"
            >
              {{ tableOption.editBtnText }}
            </el-link>
            <el-link
              class="m-control-btns"
              type="primary"
              :underline="false"
              v-if="tableOption.delBtn"
              :icon="tableOption.delBtnIcon"
              @click="rowDel(scope.row, scope.$index)"
            >
              {{ tableOption.delBtnText }}
            </el-link>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- qrcode预览 -->
    <MDialog
      v-model="qrcodePreview"
      title="预览"
      :size="size"
      width="300px"
      :save-btn="false"
      :cancel-btn="false"
    >
      <div id="qrcode-preview"></div>
      <div class="qrcode-preview-code">{{ previewQrcode }}</div>
    </MDialog>
  </div>
</template>
