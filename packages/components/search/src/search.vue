<script setup lang="ts">
import { ref, watch } from 'vue' 
import { ISearchOption, ISearchOptionColumn, searchEmits, searchProps } from './search';
import { isEmpty } from '@m-element-plus/components/common/utils';
import { FormInstance } from 'element-plus';

defineOptions({
  name: "MSearch"
})

const props = defineProps(searchProps)

const emits = defineEmits(searchEmits)

// 搜索ref
const searchRef = ref<FormInstance>()

// 折叠搜索
const searchCol = ref(true)

// 搜索loading
const searchLoading = ref(false)

// 默认配置
const defaultOption: ISearchOption = {
  // 默认label宽度
  labelWidth: '80px',
  // 搜索按钮文字
  searchBtnText: '搜 索',
  // 搜索按钮图标
  searchBtnIcon: 'Search',
  // 清空按钮文字
  resetBtnText: '清 空',
  // 清空按钮图标
  resetBtnIcon: 'Delete',
  // 默认只展示3个
  colIndex: 3,

  column: []
}

// 搜索配置
const searchOption = ref<ISearchOption>({
  column: []
})

/**
 * @description 通过配置项获取搜索表单值
 */
const getFormByColumn = (column: ISearchOptionColumn[]) => {
  const value = {}
  for (let i = 0; i < column.length; i++) {
    const columnItem = column[i]
    if (isEmpty(props.modelValue![columnItem.prop])) {
      // 日期范围，下拉框多选数据为数组
      if (columnItem.type === 'datetimerange' || columnItem.type === 'monthrange' || (columnItem.type === 'select' && columnItem.multiple)) {
        value[columnItem.prop] = isEmpty(columnItem.value) ? [] : columnItem.value
      } else {
        // 其他类型全部传空字符
        value[columnItem.prop] = isEmpty(columnItem.value) ? '' : columnItem.value
      }
    } else {
      value[columnItem.prop] = props.modelValue![columnItem.prop]
    }
  }
  return value
}


/**
 * @description 切换展开收缩状态
 */
const toggleCol = () => {
  searchCol.value = !searchCol.value
}

/**
 * @description 搜索
 */
const handleSearch = () => {
  searchRef.value?.validate(valid => {
    if (valid) {
      searchLoading.value = true
      const done = () => {
        searchLoading.value = false
      }
      emits('search', props.modelValue, done)
    }
  })
}

/**
 * @description 重置
 */
const handleReset = () => {
  searchRef.value?.resetFields()
  emits('reset')
}

// 拿到所有列配置
const columns: ISearchOptionColumn[] = JSON.parse(JSON.stringify(props.option!.column));
for (let i = 0; i < columns.length; i++) {
  const item = JSON.parse(JSON.stringify(columns[i]))
  columns[i] = {
    ...item,
    // 默认span6
    span: item.span || 6,
    // 开启关闭按钮
    clearable: true
  }
}
// 更新配置项
searchOption.value = Object.assign(defaultOption, {...props.option, column: columns});

// 第一次加载组件先初始化form表单对象的字段默认值
emits('update:modelValue', getFormByColumn(columns as ISearchOptionColumn[]))
</script>

<template>
  <div class="m-search-box">
    <el-form
      ref="searchRef"
      :disabled="searchLoading"
      :size="size"
      :inline="true"
      :label-width="searchOption.labelWidth"
      :model="modelValue"
      @submit.native.prevent
    >
      <el-row :gutter="0">
        <template v-for="(column, columnIndex) in searchOption.column" :key="columnIndex">
          <el-col v-if="!searchOption.col || !searchCol || (columnIndex < (searchOption.colIndex || 3))" :span="column.span">
            <el-form-item style="width: 100%" :label="column.label + ':'" :prop="column.prop" :rule="column.rule">
              <!--输入框-->
              <template v-if="!column.type || ['input', 'textarea', 'number'].includes(column.type as string)">
                <el-input
                  style="width: 100%"
                  v-model.trim="modelValue![column.prop]"
                  type="text"
                />
              </template>
              <!--多选-->
              <template v-else-if="['select', 'radio', 'checkbox'].includes(column.type)">
                <el-select
                  style="width: 100%;"
                  v-model="modelValue![column.prop]"
                  :clearable="column.clearable"
                  :multiple="column.multiple"
                >
                  <el-option
                    v-for="(dicItem, dicIndex) in column.dicData"
                    :key="dicIndex"
                    :label="dicItem.label"
                    :value="dicItem.value"
                  >
                  </el-option>
                </el-select>
              </template>
              <!--日期-->
              <template v-else-if="['year','month','week','date','datetime','datetimerange','daterange','monthrange'].includes(column.type)">
                <el-date-picker
                  style="width: 100%;"
                  v-model="modelValue![column.prop]"
                  :type="column.type"
                  v-bind="column"
                >
                </el-date-picker>
              </template>
              <template v-else-if="column.type === 'time'">
                <el-time-picker
                  style="width: 100%;"
                  v-model="modelValue![column.prop]"
                  v-bind="column"
                >
                </el-time-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
        
        <el-col :span="6">
          <el-form-item class="m-search-btns" style="width: 100%;">
            <el-button
              @click="handleSearch"
              type="primary"
              :icon="searchOption.searchBtnIcon"
              :loading="searchLoading"
            >
              {{ searchOption.searchBtnText }}
            </el-button>
            <el-button
              @click="handleReset"
              type="default"
              :icon="searchOption.resetBtnIcon"
              :loading="searchLoading"
            >
              {{ searchOption.resetBtnText }}
            </el-button>
            <el-link
              v-if="searchOption.col"
              style="width: 54px"
              :underline="false"
              :icon="searchCol ? 'ArrowDown' : 'ArrowUp'"
              @click="toggleCol"
            >
              {{ searchCol ? '展 开' : '收 缩' }}
            </el-link>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
