<script setup lang="ts">
import { pictureProps } from './picture'

defineOptions({
  name: "MPicture"
})
defineProps(pictureProps)
</script>

<template>
  <el-image
    :src="src"
    :preview-src-list="previewSrcList"
    fit="cover"
    :style="{width: imgWidth, height: imgHeight}"
    :preview-teleported="true"
  >
  </el-image>
</template>
