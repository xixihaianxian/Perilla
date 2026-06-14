<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRow = Record<string, any>

interface Column {
  prop: string
  label: string
  width?: string
  formatter?: (row: DataRow) => string
  slot?: string
}

interface Props {
  columns: Column[]
  data: DataRow[]
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
}

withDefaults(defineProps<Props>(), {
  loading: false,
  total: 0,
  page: 1,
  pageSize: 20,
})

const emit = defineEmits<{
  pageChange: [page: number]
  pageSizeChange: [size: number]
}>()
</script>

<template>
  <div>
    <el-table :data="data" v-loading="loading" stripe style="width: 100%">
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :width="col.width"
      >
        <template v-if="col.slot" #default="{ row }">
          <slot :name="col.slot" :row="row" />
        </template>
        <template v-else #default="{ row }">
          {{ col.formatter ? col.formatter(row) : row[col.prop] }}
        </template>
      </el-table-column>
    </el-table>

    <div v-if="total > pageSize" class="flex justify-end mt-4">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="emit('pageChange', $event)"
      />
    </div>
  </div>
</template>
