<template>
  <el-table v-loading="loading" :data="data" border style="width: 100%">
    <!-- v-for 和 v-if 不能写在同一个标签上：Vue 3 里 v-if 优先级更高，
         写在 el-table-column 上会拿不到 col，所以外面套一层 <template> -->
    <template v-for="col in colums" :key="col.prop">
      <!-- width 和 min-width 是两种模式：写了 width 就一直这么宽、不参与拉伸，
           写了 min-width 则按比例分剩余空间。两个都写时 width 优先 -->
      <el-table-column v-if="col.visible !== false" :prop="col.prop" :label="col.label" align="center"
        :width="col.width" :min-width="col.minWidth" :fixed="col.fixed" :sortable="col.sortable"
        :show-overflow-tooltip="col.showOverflowTooltip">
        <!-- col.slot 有值才挂 default 插槽；没挂的时候 el-table-column
             会自动按 :prop 渲染，这是它自己的逻辑 -->
        <template v-if="col.slot" #default="scope">
          <!-- el-table-column里有插槽时，它每次渲染都要造一个 { row: {}, column: {}, $index: -1 } 递给插槽，
          要通过scope.$index >= 0避免它进入插槽产生错误 -->
          <slot v-if="scope.$index >= 0" :name="col.slot" :row="scope.row" :index="scope.$index"></slot>
        </template>
      </el-table-column>
    </template>
    <template #empty>
      <el-empty description="暂无数据" />
    </template>

  </el-table>
  <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="total"
    :page-sizes="pageSizes" :current-page="currentPage" :page-size="pageSize"
    @current-change="(val) => emit('update:currentPage', val)" @size-change="(val) => emit('update:pageSize', val)" />
</template>
<script setup>
defineProps({
  data: {
    type: Array,
    default: () => []
  },
  colums: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number, default: 0
  },
  pageSizes: {
    type: Array, default: () => [10, 20, 30, 50]
  },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },

})

const emit = defineEmits(['update:currentPage', 'update:pageSize'])

</script>
<style scoped>
/* 表头配色。*/
.el-table {
  /* 表头背景*/
  --el-table-header-bg-color: var(--el-fill-color-light);
  /* 表头文字*/
  --el-table-header-text-color: var(--el-text-color-primary);
}

.el-pagination {
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
