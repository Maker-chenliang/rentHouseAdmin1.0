<template>
  <div class="container">
    <div class="top">
      <span>
        省份： <el-select clearable v-model="province" value-key="id" placeholder="请选择省份" style="width: 240px">
          <el-option v-for="item in optionsProvince" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </span>
      <span>
        城市： <el-select clearable v-model="city" value-key="id" placeholder="请选择城市" style="width: 240px">
          <el-option v-for="item in optionsCity" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </span>
      <span>
        区域： <el-select clearable v-model="district" value-key="id" placeholder="请选择区域" style="width: 240px">
          <el-option v-for="item in optionsArea" :key="item.id" :label="item.name" :value="item" />
        </el-select>
      </span>

    </div>
    <div class="top-next">
      <el-button type="primary" :icon="Search" @click="filter">筛选</el-button>
      <el-button :icon="Delete" @click="reset">重置</el-button>
    </div>
    <div class="bottom">
      <span>
        <el-button :icon="Plus" type="primary" @click="add">新增公寓</el-button>
      </span>
      <span class="bottom-actions">
        <el-tooltip content="刷新" placement="bottom" effect="dark">
          <el-icon size="20px" class="action-icon" @click="filter">
            <Refresh />
          </el-icon>
        </el-tooltip>


        <el-popover trigger="click" placement="bottom-end" :width="160">
          <template #reference>
            <span class="action-icon">
              <el-tooltip content="列设置" placement="bottom" effect="dark">
                <el-icon size="20px">
                  <setting />
                </el-icon>
              </el-tooltip>
            </span>
          </template>
          <!-- v-for 和 v-if 不能写在同一个标签上，套一层 <template> -->
          <template v-for="col in colums" :key="col.prop">
            <el-checkbox v-if="!col.hideInSetting" v-model="col.visible" class="col-toggle">
              {{ col.label }}
            </el-checkbox>
          </template>
        </el-popover>
      </span>
    </div>


    <CommonTable :data="tableData" :loading="loading" :colums="colums" :total="total" v-model:current-page="currentPage"
      v-model:page-size="pageSize">
      <template #checkInStatus="{ row }">
        <el-popover effect="light" trigger="hover" placement="top" :width="200">
          <!-- el-popover 的默认插槽是「弹层内容」，触发元素必须放 #reference。-->
          <template #reference>
            <el-tag :type="row.freeRoomCount > 0 ? 'success' : 'info'">
              {{ row.freeRoomCount > 0 ? '可入住' : '不可入住' }}
            </el-tag>
          </template>
          <!-- 这才是鼠标悬停时弹出来的内容 -->
          <div>空闲 {{ row.freeRoomCount }} 间 / 共 {{ row.totalRoomCount }} 间</div>
        </el-popover>
      </template>
      <template #isRelease="{ row }">
        <el-switch :model-value="row.isRelease" :active-value="1" :inactive-value="0"
          @change="(val) => { changeRelease(row.id, val) }" />
      </template>
      <template #action="{ row }">
        <div style="display: flex;flex-wrap: nowrap;align-items: center;justify-content: center;">
          <el-button type="success" :icon="Edit" @click="edit(row)">编辑</el-button>
          <el-button :icon="Delete" type="danger" @click="remove(row)">删除</el-button>
        </div>
      </template>
    </CommonTable>


  </div>
</template>
<script setup>
import { ref, watch, onMounted, reactive, } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {
  Delete,
  Plus,
  Search,
  Setting,
  Refresh,
  Edit,
} from '@element-plus/icons-vue'
import {
  getProvinceList,
  getCityList,
  listDistrictInfoByCityId,
  getApartmentList,
  deleteApartmentById,
  updateApartmentReleaseStatus
} from '@/api/apartment/apartment';
import CommonTable from '@/components/commonTable.vue';
import router from '@/router';
// 新增和编辑走同一条路由，靠 id 有无区分：
// 路由声明是 path: '/apartmentManagement/addOrEditApartment/:id?'
// —— 末尾的 ? 让它变成可选参数，不传 params 也能匹配上，
// 解析出来的路径就是 /apartmentManagement/addOrEditApartment，
// 表单里 route.params.id 是 undefined，于是显示「新增公寓」
const add = () => router.push({ name: 'addOrEditApartment' })



const changeRelease = (async (id, val) => {
  try {
    await updateApartmentReleaseStatus(id, val)
    ElMessage.success(val === 1 ? '已发布' : '已下架')
    loadTableData()
  } catch {
    //同上
  }
})

// 编辑：把这一行的 id 带上，表单里 route.params.id 有值 → 显示「编辑公寓」并回填数据
const edit = (row) => router.push({ name: 'addOrEditApartment', params: { id: row.id } })
const remove = ((row) => {
  ElMessageBox.confirm(
    '确定要删除该公寓信息?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      await deleteApartmentById(row.id)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      await loadTableData()

    })
    .catch((err) => {
      if (err === 'cancel') ElMessage({ type: 'info', message: '取消删除' })
      // 接口失败的话，request.js 的拦截器已经弹过提示了，这里不用管
    })
})


const province = ref(null)
const city = ref(null)
const district = ref(null)


const optionsProvince = ref([])
const optionsCity = ref([])
const optionsArea = ref([])

const tableData = ref([])
const loading = ref(false)


const filter = (() => {
  loadTableData()
})


const reset = (() => {
  province.value = null
  city.value = null
  district.value = null
  loadTableData()
})


onMounted(() => {
  loadProvince()
  loadTableData()
})


async function loadTableData() {
  loading.value = true
  try {
    const res = await getApartmentList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      provinceId: province.value?.id,
      cityId: city.value?.id,
      districtId: district.value?.id,
    })

    tableData.value = res.data.records
    total.value = res.data.total
  } catch {
    // 拦截器已经弹过提示了
  } finally {
    loading.value = false
  }
}

// 表格列配置。加列/删列/改标题宽度/控制显隐
const colums = reactive([
  { prop: 'name', label: '名称', minWidth: 90, showOverflowTooltip: true },
  { prop: 'addressDetail', label: '详细地址', minWidth: 100, showOverflowTooltip: true },
  { prop: 'freeRoomCount', label: '空闲房间数', minWidth: 90, sortable: true },
  { prop: 'totalRoomCount', label: '房间总数', minWidth: 90, sortable: true },
  { prop: 'provinceName', label: '所处省份', minWidth: 100 },
  { prop: 'cityName', label: '所处城市', minWidth: 100 },
  { prop: 'districtName', label: '所处区域', minWidth: 100 },
  { prop: 'phone', label: '联系方式', minWidth: 90, showOverflowTooltip: true },
  { prop: 'checkInStatus', label: '入住状态', minWidth: 100, slot: 'checkInStatus' },
  { prop: 'isRelease', label: '发布状态', minWidth: 100, slot: 'isRelease' },
  // hideInSetting: 操作列里是按钮，不给隐藏
  { prop: 'action', label: '操作', minWidth: 200, fixed: 'right', slot: 'action', hideInSetting: true },
])
// 统一补 visible，省得上面每一列都写一遍
colums.forEach(col => {
  col.visible = true
})

async function loadProvince() {
  try {

    const res = await getProvinceList()
    optionsProvince.value = res.data
  } catch {
    // 拦截器已经弹过 ElMessage 了，这儿不用再处理
  }
}

// 省份一变就重新拉城市
watch(province, async (val) => {
  city.value = null
  optionsCity.value = []
  if (!val?.id) return
  try {
    const res = await getCityList(val.id)
    optionsCity.value = res.data
  } catch { /* 拦截器已弹提示，这里不用管 */ }
})

// 城市一变就重新拉区域
watch(city, async (val) => {
  district.value = null
  optionsArea.value = []
  if (!val?.id) return
  try {
    const res = await listDistrictInfoByCityId(val.id)
    optionsArea.value = res.data
  } catch { /* 拦截器已弹提示，这里不用管 */ }
})


// 分页。total 是「总条数」——接口返回的全量条数，不是当前页的条数，
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)


watch([currentPage, pageSize], async () => {
  try {
    const res = await getApartmentList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    })
    tableData.value = res.data.records
    total.value = res.data.total
  } catch {
    // 拦截器已经弹过提示了
  }

})

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
  min-height: 0;
}

.top {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px 100px;
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
  width: 100%;
  min-width: 0;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.bottom-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}


.action-icon {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

.action-icon:hover {
  color: var(--el-color-primary);
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

/* el-checkbox 默认 inline-block，不加这个会挤在一行 */
.col-toggle {
  display: block;
  margin-right: 0;
}
</style>
