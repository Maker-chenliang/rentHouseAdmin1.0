<template>
  <div class="container">
    <div class="top">
      <span>
        省份： <el-select v-model="value" value-key="id" placeholder="请选择省份" style="width: 240px">
          <el-option v-for="item in optionsProvince" :key="item.id" :label="item.label" :value="item" />
        </el-select>
      </span>
      <span>
        城市： <el-select v-model="value" value-key="id" placeholder="请选择城市" style="width: 240px">
          <el-option v-for="item in optionsCity" :key="item.id" :label="item.label" :value="item" />
        </el-select>
      </span>
      <span>
        区域： <el-select v-model="value" value-key="id" placeholder="请选择区域" style="width: 240px">
          <el-option v-for="item in optionsArea" :key="item.id" :label="item.label" :value="item" />
        </el-select>
      </span>

    </div>
    <div class="top-next">
      <el-button type="primary" :icon="Search">搜索</el-button>
      <el-button :icon="Delete">重置</el-button>
    </div>
    <div class="bottom">
      <span>
        <el-button :icon="Plus" type="primary">新增公寓</el-button>
      </span>
      <span class="bottom-actions">
        <el-icon size="20px">
          <Refresh />
        </el-icon>
        <el-icon size="20px">
          <setting />
        </el-icon>
      </span>
    </div>

    <!-- prop 是以后接口返回的字段名，先起好名字，接上数据就不用改模板了 -->
    <el-table :data="tableData" border style="width: 100%">
      <!-- 默认占位只有一个 span 文字，没有图。套一层 el-empty 才有那个灰色插图 -->
      <template #empty>
        <el-empty description="暂无数据" />
      </template>

      <el-table-column prop="name" label="名称" align="center" min-width="100" />
      <el-table-column prop="address" label="详细地址" align="center" min-width="100" show-overflow-tooltip />
      <el-table-column prop="freeRoomCount" label="空闲房间数" align="center" min-width="110" sortable />
      <el-table-column prop="roomCount" label="房间总数" align="center" min-width="100" sortable />
      <el-table-column prop="province" label="所处省份" align="center" min-width="100" />
      <el-table-column prop="city" label="所处城市" align="center" min-width="100" />
      <el-table-column prop="area" label="所处区域" align="center" min-width="100" />
      <el-table-column prop="contact" label="联系方式" align="center" min-width="130" />
      <el-table-column prop="checkInStatus" label="入住状态" align="center" min-width="100" />
      <el-table-column prop="publishStatus" label="发布状态" align="center" min-width="100" />
      <el-table-column label="操作" align="center" min-width="160" fixed="right" />
    </el-table>

    <el-pagination class="pagination" background layout="total, sizes, prev, pager, next, jumper" :total="total"
      :page-sizes="[10, 20, 30, 50]" v-model:current-page="currentPage" v-model:page-size="pageSize" />
  </div>
</template>
<script setup>
import { ref } from 'vue';
import {
  Delete,
  Plus,
  Search,
  Setting,
  Refresh
} from '@element-plus/icons-vue'
const optionsProvince = ref()
const optionsCity = ref()
const optionsArea = ref()
// 表格数据源，先给空数组，接了接口再往里塞
const tableData = ref([])
// 分页。total 是「总条数」——接口返回的全量条数，不是当前页的条数，
// 所以别写 tableData.length，那样分页时永远是 10
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
</script>
<style scoped>
.container {
  display: flex;

  gap: 16px;
  padding: 20px 24px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

  flex-direction: column;
  flex-wrap: wrap;
}

.top {
  flex-direction: row;
  column-gap: 100px;
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px
}

.top>span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-next {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

}

.bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

}

.bottom-actions {
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin-left: auto;
  flex-wrap: wrap;
}

/* el-table 的空状态外层是个 span，自带 width:50% 和 line-height:60px。
   塞了 el-empty 之后，那个 60px 行高会被里面的文字继承，字距被撑得很开，
   所以把这两条清掉，交给 el-empty 自己排版 */
:deep(.el-table__empty-text) {
  width: auto;
  line-height: normal;
}

/* el-pagination 自带 display:flex 但没写 justify-content，默认靠左。
   参考图里是靠右的，补一个就行 */
.pagination {
  justify-content: flex-end;
}
</style>
