<script setup lang="ts">
import { useSlots, ref } from "vue";
import { dialogProps } from "./dialog";

defineOptions({
  name: 'MDialog'
})

const props = defineProps(dialogProps)

const slots = useSlots()

const dialogLoading = ref(false)

const emits = defineEmits<{
  /**
   * @description 更新弹窗状态
   * @param dialogVisible 弹窗状态
   */
  (e: 'update:modelValue', visible: boolean): void,
  /**
   * @description 弹窗关闭
   * @param e
   */
  (e: 'close'): void,
  /**
   * @description 弹窗取消
   */
  (e: 'cancel'): void,
  /**
   * @description 弹窗确认
   */
  (e: 'enter', done: Function, loading: Function): void,
}>()

/**
 * @description 弹窗关闭
 */
const closeDialog = () => {
  emits('update:modelValue', false)
  emits('close');
}

/**
 * 确认
 */
const enter = () => {
  // 弹窗开始加载
  dialogLoading.value = true
  // 关闭表单
  const done = () => {
    emits('update:modelValue', false)
  }
  // 关闭加载
  const loading = () => {
    dialogLoading.value = false
  }

  emits('enter', done, loading)
}

/**
 * 关闭
 */
const close = () => {
  emits('update:modelValue', false)
  emits('cancel')
}

/**
 * 弹窗关闭前
 * @param done 执行成功
 */
const onBeforeClose = (done: Function) => {
  if (dialogLoading.value) {
    return false;
  }
  if (props.beforeClose) {
    props.beforeClose(done)
  } else {
    done()
  }
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :top="top"
    :appendToBody="appendToBody"
    :closeOnClickModal="closeOnClickModal"
    :closeOnnPressEscape="closeOnnPressEscape"
    :beforeClose="onBeforeClose"
    :draggable="draggable"
    :destroyOnClose="destroyOnClose"
    @close="closeDialog"
  >
    <slot :loading="dialogLoading" />
    <template #footer>
      <div v-if="!slots.btns" class="dialog-footer">
        <el-button v-if="cancelBtn" :size="size" :icon="cancelBtnIcon" :loading="dialogLoading" @click="close">{{ cancelBtnText }}</el-button>
        <el-button v-if="saveBtn" :size="size" :icon="saveBtnIcon" :loading="dialogLoading" type="primary" @click="enter">{{ saveBtnText }}</el-button>
      </div>
      <slot :loading="dialogLoading" v-else name="btns"></slot>
    </template>
  </el-dialog>
</template>
