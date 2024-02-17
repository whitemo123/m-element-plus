<script setup lang="ts">
import { ITableOption, MTable } from '@m-element-plus/components'


const tableOption: ITableOption = {
  viewBtn: true,
  index: true,
  selection: 'radio',
  column: []
}
</script>

<template>
  <div>
    <MTable :data="[{'test': 1}]" :option="tableOption" />
  </div>
</template>

<style scoped lang="scss">

</style>
