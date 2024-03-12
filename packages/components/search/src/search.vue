<script setup lang="ts">
import { searchProps } from './search';

defineOptions({
  name: "MSearch"
})

defineProps(searchProps)
</script>

<template>
  <div class="m-search-box">
    <el-form :size="size" :inline="true">
      
    </el-form>
  </div>
</template>