<script lang="ts" setup>
import { ref, watch } from 'vue'
import { get, set } from 'lodash-es';
import { IFormOption, IFormOptionColumn, formProps } from './form';
import { isEmpty } from '@m-element-plus/utils';
import { FormInstance } from 'element-plus';

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
 * @description 获取配置列
 */
const getFormColumns = (arr: IFormOptionColumn[]) => {
  const result: IFormOptionColumn[] = []
  const columns = arr || []
  for (let i = 0; i < columns.length; i++) {
    if (props.permission[columns[i].prop] !== false || props.permission[columns[i].prop + 'Form'] === true) {
      result.push({
        ...columns[i],
        // 默认span6
        span: columns[i].span || 12,
        // 开启关闭按钮
        clearable: true
      })
    }
  }
  return result
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
  validForm
})
</script>

<template>
  <div class="m-form-box">
    <el-form
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
  </div>
</template>
