<script setup lang="ts">
import { useSlots } from "vue";
import { dialogProps } from "./dialog";

defineOptions({
  name: 'MDialog'
})

const props = defineProps(dialogProps)

const slots = useSlots()

const emits = defineEmits<{
  /**
   * @description 更新弹窗状态
   * @param dialogVisible 弹窗状态
   */
  (e: 'update:modelValue', visible: boolean): void,
  /**
   * @description 更新弹窗状态
   * @param e
   */
  (e: 'close'): void
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

}

/**
 * 关闭
 */
const close = () => {

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
    :beforeClose="beforeClose"
    :draggable="draggable"
    :destroyOnClose="destroyOnClose"
    @close="closeDialog"
  >
    <slot />
    <template #footer>
      <div v-if="!slots.btns" class="dialog-footer">
        <el-button v-if="cancelBtn" :size="size" icon="CircleClose" @click="closeDialog">取消</el-button>
        <el-button v-if="saveBtn" :size="size" icon="CircleCheck" type="primary" @click="closeDialog">确认</el-button>
      </div>
      <slot v-else name="btns"></slot>
    </template>
  </el-dialog>
</template>