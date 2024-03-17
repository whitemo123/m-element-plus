<script lang="ts" setup>
import { ref, watch } from 'vue'
import { get, set } from 'lodash-es';
import { IFormOption, formProps } from './form';

defineOptions({
  name: "MForm"
})

// 默认配置信息
const defaultOptions: IFormOption = {
  // 标签宽度
  labelWidth: '80px',
  
  column: []
}

// props
const props = defineProps(formProps)

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

// 监听配置信息
watch(() => props.option as IFormOption, (newVal: IFormOption) => {

}, {
  immediate: true,
  deep: true
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
      <el-row :gutter="20">
        <el-col
          v-for="(column, columnIndex) in formOption.column"
          :key="columnIndex"
          :span="column.span"
        >
          <el-form-item
            style="width: 100%"
            :label="column.label + ':'"
            :prop="column.prop"
            :rule="column.rule"
          >
            <el-input v-model="proxys[column.prop]" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>