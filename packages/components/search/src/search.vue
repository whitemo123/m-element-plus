<script setup lang="ts">
import { ref } from 'vue'
import { get, set } from 'lodash-es';
import { ISearchOption, ISearchOptionColumn, searchEmits, searchProps } from './search';
import { isEmpty } from '@m-element-plus/components/common/utils';
import { FormInstance } from 'element-plus';

defineOptions({
  name: "MSearch"
})

// props
const props = defineProps(searchProps)

// emits
const emits = defineEmits(searchEmits)

// 搜索ref
const searchRef = ref<FormInstance>()

// 代理model
const proxys: any = new Proxy(props.model as any, {
  get(target, property) {
    return get(target, property)
  },
  set(target, property, value) {
    set(target, property, value)
    return true;
  }
})

// 折叠搜索
const searchCol = ref(true)

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
 * @description 获取搜索列
 * @param { ISearchOptionColumn[] } arr 搜索列
 */
const getSearchColumns = (arr: ISearchOptionColumn[]) => {
  const result: ISearchOptionColumn[] = []
  const columns = arr || []
  for (let i = 0; i < columns.length; i++) {
    if (props.permission[columns[i].prop] !== false || props.permission[columns[i].prop + 'Search'] === true) {
      result.push({
        ...columns[i],
        // 默认span6
        span: columns[i].span || 6,
        // 开启关闭按钮
        clearable: true
      })
    }
  }
  return result
}

/**
 * @description 通过配置项获取搜索表单值
 */
const setFormByColumn = (column: ISearchOptionColumn[]) => {
  for (let i = 0; i < column.length; i++) {
    const columnItem = column[i]
    if (isEmpty(proxys[columnItem.prop])) {
      // 日期范围，下拉框多选数据为数组
      if (columnItem.type === 'datetimerange' || columnItem.type === 'monthrange' || (columnItem.type === 'select' && columnItem.multiple)) {
        proxys[columnItem.prop] = isEmpty(columnItem.value) ? [] : columnItem.value
      } else {
        // 其他类型全部传空字符
        proxys[columnItem.prop] = isEmpty(columnItem.value) ? '' : columnItem.value
      }
    } else {
      proxys[columnItem.prop] = proxys[columnItem.prop]
    }
  }
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
const search = (p: number = 1) => {
  searchRef.value?.validate(valid => {
    if (valid) {
      // 搜索自动使用第一页进行搜索
      if (proxys.page) {
        proxys.page = p;
      }
      // emit搜索事件 如果非第一页，自动重置第一页
      emits('search', proxys)
    }
  })
}

/**
 * @description 重置
 */
const reset = () => {
  // 重置分页参数
  if (proxys.page) {
    proxys.page = 1;
  }
  if (proxys.limit) {
    proxys.limit = 10
  }
  // 清空搜索表单的字段
  searchRef.value?.resetFields()
  // emit重置事件
  emits('reset')
}

// 更新配置项
searchOption.value = Object.assign(defaultOption, props.option, { column: getSearchColumns(props.option!.column) });

// 设置初始化值
setFormByColumn(searchOption.value.column as ISearchOptionColumn[])

defineExpose({
  search,
  reset
})
</script>

<template>
  <div class="m-search-box">
    <el-form
      ref="searchRef"
      :disabled="loading"
      :size="size"
      :inline="true"
      :label-width="searchOption.labelWidth"
      :model="proxys"
      @submit.native.prevent
    >
      <el-row :gutter="0">
        <template v-for="(column, columnIndex) in searchOption.column" :key="columnIndex">
          <el-col v-if="!searchOption.col || !searchCol || (columnIndex < (searchOption.colIndex || 3))" :span="column.span">
            <el-form-item style="width: 100%" :label="column.label + ':'" :prop="column.prop" :rule="column.rule">
              <!--插槽-->
              <slot v-if="column.slot" :name="column.prop" v-bind="{$query: proxys}" />
              <!--输入框-->
              <template v-else-if="!column.type || ['input', 'textarea', 'number'].includes(column.type as string)">
                <el-input
                  style="width: 100%"
                  v-model.trim="proxys[column.prop]"
                  type="text"
                />
              </template>
              <!--多选-->
              <template v-else-if="['select', 'radio', 'checkbox'].includes(column.type)">
                <el-select
                  style="width: 100%;"
                  v-model="proxys[column.prop]"
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
                  v-model="proxys[column.prop]"
                  :type="column.type"
                  v-bind="column"
                >
                </el-date-picker>
              </template>
              <template v-else-if="column.type === 'time'">
                <el-time-picker
                  style="width: 100%;"
                  v-model="proxys[column.prop]"
                  v-bind="column"
                >
                </el-time-picker>
              </template>
            </el-form-item>
          </el-col>
        </template>
        <!--按钮区域-->
        <el-col :span="6">
          <el-form-item class="m-search-btns" style="width: 100%;">
            <el-button
              @click="search(1)"
              type="primary"
              :icon="searchOption.searchBtnIcon"
              :loading="loading"
            >
              {{ searchOption.searchBtnText }}
            </el-button>
            <el-button
              @click="reset"
              type="default"
              :icon="searchOption.resetBtnIcon"
              :loading="loading"
            >
              {{ searchOption.resetBtnText }}
            </el-button>
            <el-link
              v-if="searchOption.col"
              style="width: 54px"
              :underline="false"
              :disabled="loading"
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
