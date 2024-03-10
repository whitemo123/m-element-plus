<script setup lang="ts">
import { MPagination } from "@m-element-plus/components";
import { crudProps } from './crud';

defineOptions({
  name: 'MCrud',
})

defineProps(crudProps)
</script>

<template>
  <div class="m-crud">

    <m-pagination :small="size === 'small'" />
  </div>
</template>
