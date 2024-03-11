<script setup lang="ts">
import { ref } from 'vue'
import { MPagination, MTable } from "@m-element-plus/components";
import { crudProps, crudEmits } from './crud';

defineOptions({
  name: 'MCrud',
})

const props = defineProps(crudProps)

const emits = defineEmits(crudEmits)
const currentPageChange = (page: number) => {
  emits('update:page', {
    page: page,
    limit: props.page['limit']
  })
}

const pageSizeChange = (pageSize: number) => {
  emits('update:page', {
    page: props.page['page'],
    limit: pageSize
  })
}
</script>

<template>
  <div class="m-crud">
    <m-table
      :data="data"
      :size="size"
      :option="option"
    >

    </m-table>
    <div
      class="m-pagination-box"
      v-if="total"
    >
      <m-pagination
        :small="size === 'small'"
        :total="total"
        :current-page="page.page"
        :page-size="page.pageSize"
        :disabled="loading"
        @currentPage="currentPageChange"
        @pageSize="pageSizeChange"
      />
    </div>
  </div>
</template>
