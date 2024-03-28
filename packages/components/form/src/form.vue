<script lang="ts" setup>
import { ref, watch } from 'vue'
import { cloneDeep, get, set } from 'lodash-es';
import { IFormOption, IFormOptionColumn, formProps } from './form';
import { isEmpty } from '@m-element-plus/utils';
import { FormInstance } from 'element-plus';
import { IDictValue } from '@m-element-plus/components/common/types';
import { useGlobalConfig } from '@m-element-plus/components/config-provider';

defineOptions({
  name: "MForm"
})

// 默认配置信息
const defaultOption: IFormOption = {
  // 标签宽度
  labelWidth: '80px',

  column: []
}

// props
const props = defineProps(formProps)

// 全局配置
const globalConfig = useGlobalConfig()

// 表单ref
const formRef = ref<FormInstance>()

// 绑定值
const proxys = new Proxy(props.model as any, {
  get(target, property) {
    return get(target, property);
  },
  set(target, property, value) {
    set(target, property, value)
    return true
  }
})

// form配置
const formOption = ref<IFormOption>({
  column: []
})


/**
 * @description 通过column配置设置表单值
 * @param { IFormOptionColumn[] } column 配置列
 */
const setFormValueByColumn = (column: IFormOptionColumn[]) => {
  for (let i = 0; i < column.length; i++) {
    const columnItem = column[i]
    if (isEmpty(proxys[columnItem.prop])) {
      // 日期范围，下拉框多选数据，多选为数组
      if (
        columnItem.type === 'datetimerange'||
        columnItem.type === 'monthrange' ||
        (columnItem.type === 'select' && columnItem.multiple) ||
        columnItem.type === 'checkbox'
      ) {
        proxys[columnItem.prop] = []
      } else {
        // 其他类型全部传空字符
        proxys[columnItem.prop] = ''
      }
    } else {
      proxys[columnItem.prop] = proxys[columnItem.prop]
    }
  }
}


/**
 * @description 更新远程字典
 * @param column 配置
 * @param index 索引
 */
 const updateRemoteDic = async (column: IFormOptionColumn, index: number) => {
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
        formOption.value.column[index - 1]['dicData'] = list.map(item => {
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
    formOption.value.column[index - 1]['dicData'] = []
  }
}

/**
 * @description 获取配置列
 */
const getFormColumns = (arr: IFormOptionColumn[]) => {
  const result: IFormOptionColumn[] = []
  const columns = arr || []
  for (let i = 0; i < columns.length; i++) {
    const columnsItem = columns[i]

    if (
      props.permission[columnsItem.prop] !== false ||
      props.permission[columnsItem.prop + 'Form'] === true
    ) {
      const resultItem: IFormOptionColumn = {
        ...columnsItem,
        // 默认span6
        span: columnsItem.span || 12,
        // 开启关闭按钮
        clearable: true
      }
      result.push(resultItem)
      if ((!columnsItem.dicData || !columnsItem.dicData.length) && columnsItem.dicUrl) {
        // 远程字典
        updateRemoteDic(resultItem, result.length)
      }
    }
  }
  return result
}


/**
 * 获取字典value值
 * @param column 列
 * @param row 行数据
 */
 const getDictValue = (column: IFormOptionColumn, row: any): string => {
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
 * @description 校验表单
 */
const validForm = (): Promise<boolean> => {
  return new Promise(resolve => {
    formRef.value!.validate(valid => {
      resolve(valid)
    })
  })
}

/**
 * @description 清空数据和校验规则
 */
const clear = () => {
  // 清空校验规则
  formRef.value?.clearValidate()
  // 清空表单数据
  formRef.value?.resetFields()

  // 清空form表单值
  const form = cloneDeep(props.model)
  for (const key in form) {
    delete proxys[key]
  }
}

// 监听配置信息
watch(() => props.option as IFormOption, (newVal: IFormOption) => {
  // 更新配置项
  formOption.value = Object.assign(defaultOption, newVal, { column: getFormColumns(newVal.column) });

  // 设置初始化值
  setFormValueByColumn(formOption.value.column as IFormOptionColumn[])
}, {
  immediate: true,
  deep: true
})


defineExpose({
  validForm,
  clear
})
</script>

<template>
  <div class="m-form-box">
    <el-form
      v-if="!readonly"
      ref="formRef"
      :disabled="loading"
      :size="size"
      :label-width="formOption.labelWidth"
      :model="proxys"
      @submit.native.prevent
    >
      <el-row :gutter="0">
        <el-col
          v-for="(column, columnIndex) in formOption.column"
          :key="columnIndex"
          :span="column.span"
        >
          <el-form-item style="width: 100%" :label="column.label + ':'" :prop="column.prop" :rules="column.rules">
            <!--插槽-->
            <slot v-if="column.slot" :name="column.prop" v-bind="{$query: proxys}" />
            <!--输入框-->
            <template v-else-if="!column.type || ['input', 'textarea', 'number'].includes(column.type as string)">
              <el-input
                style="width: 100%"
                v-model.trim="proxys[column.prop]"
                :type="column.type"
                v-bind="column"
              />
            </template>
            <!--多选-->
            <template v-else-if="['select', 'radio', 'checkbox', 'switch'].includes(column.type)">
              <el-select
                v-if="column.type === 'select'"
                style="width: 100%;"
                v-model="proxys[column.prop]"
                :clearable="column.clearable"
                :multiple="column.multiple"
                v-bind="column"
              >
                <el-option
                  v-for="(dicItem, dicIndex) in column.dicData"
                  :key="dicIndex"
                  :label="dicItem.label"
                  :value="dicItem.value"
                >
                </el-option>
              </el-select>
              <el-radio-group style="width: 100%;" v-else-if="column.type === 'radio'" v-model="proxys[column.prop]">
                <el-radio
                  v-for="(dicItem, dicIndex) in column.dicData"
                  :key="dicIndex"
                  :value="dicItem.value"
                  :label="dicItem.value"
                >
                  {{ dicItem.label }}
                </el-radio>
              </el-radio-group>
              <el-checkbox-group style="width: 100%;" v-else-if="column.type === 'checkbox'" v-model="proxys[column.prop]">
                <el-checkbox
                  v-for="(dicItem, dicIndex) in column.dicData"
                  :key="dicIndex"
                  :label="dicItem.label"
                  :value="dicItem.value"
                />
              </el-checkbox-group>
              <template v-else-if="column.type === 'switch'">
                <el-switch
                  v-if="column.dicData && column.dicData.length === 2"
                  style="width: 100%;"
                  v-model="proxys[column.prop]"
                  :inactive-value="column.dicData[0].value"
                  :active-value="column.dicData[1].value"
                  :active-text="column.dicData[1].label"
                  :inactive-text="column.dicData[0].label"
                />
                <span v-else>请配置dicData，且长度等于2</span>
              </template>
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
      </el-row>
    </el-form>
    <el-descriptions
      v-else
      :size="size"
      :column="24"
      border
    >
      <el-descriptions-item v-for="(item, index) in formOption.column" :key="index" :label="item.label" :span="item.span">
        <template v-if="item.type === 'picture'">
          <!--图片插槽-->
        </template>
        <template v-else-if="['select', 'radio', 'checkbox', 'switch'].includes(item.type as string)">
          {{ getDictValue(item, proxys) }}
        </template>
        <template v-else>
          {{ proxys[item.prop] }}
        </template>
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
