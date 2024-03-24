<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import Qrcode from 'qrcodejs2-fix'
import { qrcodeProps } from './qrcode';

defineOptions({
  name: 'MQrcode'
})
const props = defineProps(qrcodeProps)

const emits = defineEmits<{
  /**
   * @description 点击事件
   * @param e
   */
  (e: "click", code: string): void
}>()

const qrcodeRef = ref<any>()

const alignComputed = computed(() => {
  if (!props.align || props.align === 'left') {
    return 'flex-start'
  }
  if (props.align === 'right') {
    return 'flex-end'
  }
  return 'center'
})

watch(() => props.text as string, (newVal: string) => {
  if (!newVal) return
  setTimeout(() => {
    qrcodeRef.value.innerHTML = ''
    new Qrcode(qrcodeRef.value, {
      text: newVal,
      width: props.qrcodeWidth,
      height: props.qrcodeHeight
    })
    const img = qrcodeRef.value.querySelector('img')
    img.onclick = () => {
      emits("click", newVal)
    }
  }, 0)
}, {
  immediate: true
})
</script>

<template>
  <div class="m-qrcode-box" :style="'justify-content: ' + alignComputed"  ref="qrcodeRef"></div>
</template>
