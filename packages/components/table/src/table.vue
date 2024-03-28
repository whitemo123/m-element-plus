<script lang="ts" setup>
import { onMounted, ref, useSlots, watch } from 'vue'
import { useGlobalConfig } from '@m-element-plus/components/config-provider'
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
const defaultOption = {
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

// 全局配置
const globalConfig = useGlobalConfig()

const tableKey = ref(1)

// 表格配置
const tableOption = ref<ITableOption>({
  column: []
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
 * @description 刷新表格
 */
const refreshTable = () => {
  tableKey.value++
}

/**
 * @description 更新远程字典
 * @param column 配置
 * @param index 索引
 */
 const updateRemoteDic = async (column: ITableOptionColumn, index: number) => {
  if (!globalConfig.value.httpGet) {
    console.error(`请配置全局属性httpGet!!!`)
    return
  }
  if (!column.dicFormatter) {
    console.error(`请设置"${column.prop}"配置的dicFormatter!!!`)
    return
  }

  let isSetting = false

  try {
    // 字典接口请求
    const dicRes = await globalConfig.value.httpGet(column.dicUrl)
    if (dicRes) {
      const { list, label, value } = column.dicFormatter(dicRes)
      if (list && (list instanceof Array)) {
        tableOption.value.column[index - 1]['dicData'] = list.map(item => {
          return {
            label: item[label],
            value: item[value]
          }
        })
        isSetting = true
      }
    }
  } catch (err) {
  }
  if (!isSetting) {
    tableOption.value.column[index - 1]['dicData'] = []
  }
  // 更新table 重新渲染
  refreshTable()
}

/**
 * @description 获取列表列
 * @param arr { ISearchOptionColumn[] } arr 列表列
 */
const getTableColumns = (arr: ITableOptionColumn[]) => {
  const result: ITableOptionColumn[] = []
  const columns = arr || []

  for (let i = 0; i < columns.length; i++) {
    const columnsItem = columns[i]
    // 表格列配置
    if (!columnsItem.hide && props.permission[columnsItem.prop] !== false) {
      const resultItem: ITableOptionColumn = {
        ...columnsItem
      }
      result.push(resultItem)
      if ((!columnsItem.dicData || !columnsItem.dicData.length) && columnsItem.dicUrl) {
        // 远程字典
        updateRemoteDic(resultItem, result.length)
      }
    }
  }

  return result.sort((a, b) => (b.order || 0) - (a.order || 0))
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

/**
 * @description 设置默认选择数据
 */
const setDefaultCheckData = () => {
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
}

/**
 * @description 清空列表单选
 */
const clearRadioCheck = () => {
  currentRadio.value = ''
}

onMounted(() => {
  // 设置默认选择数据
  setDefaultCheckData()
})

watch(() => props.option as ITableOption, (newVal: ITableOption) => {
  // 更新配置项
  tableOption.value = Object.assign(defaultOption, newVal, { column: getTableColumns(newVal.column) });
}, {
  immediate: true,
  deep: true
})

defineExpose({
  refreshTable,
  clearRadioCheck
})
</script>

<template>
  <div class="m-table" v-if="tableOption.column && tableOption.column.length">
    <el-table
      :key="tableKey"
      ref="tableRef"
      :data="data"
      :size="size"
      v-loading="loading"
      :stripe="tableOption.stripe"
      :border="tableOption.border"
      :rowKey="tableOption.rowKey"
      :default-sort="(tableOption.defaultSort as any)"
      :show-summary="tableOption.showSummary"
      :height="height"
      :max-height="maxHeight"
      @sort-change="tableSortChange"
      @selection-change="tableSelectionChange"
    >
      <!--空数据-->
      <template #empty>
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
          <img src="data:image/png;base64,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" />
          <span style="line-height: normal;">暂无数据</span>
        </div>
      </template>
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
        v-for="(column, columnIndex) in tableOption.column"
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
