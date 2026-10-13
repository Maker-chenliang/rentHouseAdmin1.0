<template>
  <div class="container">
    <div class="header">
      <span class="header-title">
        {{ id != null ? "编辑公寓" : "新增公寓" }}
      </span>
    </div>
    <el-form ref="formRef" class="body" :model="form" :rules="rules" label-width="auto" scroll-to-error>
      <el-form-item label="公寓名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入公寓名称" clearable />
      </el-form-item>

      <el-form-item label="公寓介绍" prop="introduction">
        <el-input v-model="form.introduction" type="textarea" :rows="4" placeholder="请输入公寓介绍" />
      </el-form-item>

      <el-form-item label="所属区域" prop="districtId">
        <div class="area-row">
          <el-select v-model="form.provinceId" placeholder="请选择省份" style="width: 240px" clearable
            @change="onProvinceChange(form.provinceId)">
            <el-option v-for="item in optionsProvince" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="form.cityId" :disabled="form.provinceId != null ? false : true" placeholder="请选择城市"
            style="width: 240px" clearable @change="onCityChange(form.cityId)">
            <el-option v-for="item in optionsCity" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="form.districtId" :disabled="form.cityId == null" placeholder="请选择地区" style="width: 240px"
            clearable>
            <el-option v-for="item in optionsArea" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="详细地址" prop="addressDetail">
        <el-input v-model="form.addressDetail" placeholder="请输入详细地址" clearable />
      </el-form-item>

      <el-form-item label="公寓前台电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入前台电话" clearable />
      </el-form-item>

      <el-form-item label="是否发布" prop="isRelease">
        <el-radio-group v-model="form.isRelease">
          <el-radio :value="0">未发布</el-radio>
          <el-radio :value="1">已发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="公寓配套" prop="facilityInfoIds">
        <el-select v-model="form.facilityInfoIds" multiple placeholder="请选择公寓配套">
          <el-option v-for="f in facilityOptions" :key="f.id" :label="f.name" :value="f.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="公寓标签" prop="labelIds">
        <el-select v-model="form.labelIds" multiple placeholder="请选择公寓标签">
          <el-option v-for="l in labelOptions" :key="l.id" :label="l.name" :value="l.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="公寓杂费" prop="feeValueIds">
        <el-tree-select v-model="form.feeValueIds" :data="feeValueOptions" multiple :render-after-expand="false"
          node-key="treeKey" :props="{ label: 'label', children: 'feeValueList' }"
          :default-expanded-keys="expandedFeeKeys" />
      </el-form-item>

      <el-form-item label="公寓图片" prop="fileList">
        <el-upload v-model:file-list="form.fileList" list-type="picture-card" :on-preview="handlePictureCardPreview"
          :on-change="beforeUpload" :auto-upload="false">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible" :title="previewName" width="60%" append-to-body>
          <img :src="dialogImageUrl" alt="预览图" class="preview-img" />
        </el-dialog>
      </el-form-item>


    </el-form>
    <div class="form-actions">
      <el-button style="width: 150px;" type="primary" :loading="submitting" @click="submit">保存</el-button>
      <el-button style="width: 150px;" @click="goBack">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import { getApartmentById, getCityList, getFeeInfoList, getLabelInfoList, getProvinceList, listDistrictInfoByCityId, getFacilityInfoList, uploadFile, saveOrUpdateApartment } from '@/api/apartment/apartment'
const router = useRouter()
const LIST_PATH = '/apartmentManagement/apartmentManagement'
const route = useRoute()
const rules = reactive({
  name: [
    { required: true, message: '请输入公寓名称', trigger: 'blur' },

  ],
  introduction: [
    { required: true, message: '请输入公寓介绍', trigger: 'blur' },
  ],
  districtId: [
    { required: true, message: '请选择所处区域', trigger: 'change' },
  ],
  addressDetail: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入前台电话号码', trigger: 'blur' },
    {
      pattern: /^(?:1[3-9]\d{9}|0\d{2,3}-?\d{7,8})$/,
      message: '手机号或座机号格式不正确',
      trigger: 'blur',
    },
  ],

})
const id = computed(() => route.params.id)
const form = reactive({
  name: '',
  introduction: '',
  provinceId: null,
  cityId: null,
  districtId: null,
  addressDetail: '',
  phone: '',
  isRelease: 0,
  facilityInfoIds: [],
  labelIds: [],
  feeValueIds: [],
  fileList: []
}
)

const formRef = ref()
const submitting = ref(false)
const uploadedUrls = new WeakMap()
//看不懂
async function submit() {
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('表单填写有误，请检查必填项')
    return
  }
  submitting.value = true
  try {
    const fresh = form.fileList.filter(f => f.raw && !uploadedUrls.has(f.raw))
    await Promise.all(
      fresh.map(async (f) => {
        uploadedUrls.set(f.raw, (await uploadFile(f.raw)).data)
      }))
    // fileList 是前端自己的字段，后端不认，先拆出去
    const { fileList, ...rest } = form
    await saveOrUpdateApartment({
      id: id.value ?? null,
      ...rest,
      provinceName: optionsProvince.value.find(p => p.id === form.provinceId)?.name,
      cityName: optionsCity.value.find(c => c.id === form.cityId)?.name,
      districtName: optionsArea.value.find(d => d.id === form.districtId)?.name,
      graphVoList: fileList.map(f => ({
        name: f.name,
        url: f.raw ? uploadedUrls.get(f.raw) : f.url,
      })),
    })
    ElMessage.success('保存成功')
    router.push(LIST_PATH)
  } catch {
    //同上
  }
  finally {
    submitting.value = false
  }
}
const goBack = (() =>
  router.push(LIST_PATH)
)

const optionsProvince = ref([])
const optionsCity = ref([])
const optionsArea = ref([])
const facilityOptions = ref([])
const labelOptions = ref([])
const feeValueOptions = ref([])

const previewName = ref('')
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
  previewName.value = uploadFile.name
}
const beforeUpload = (uploadFile) => {
  const raw = uploadFile.raw          // 原始 File 在 raw 上
  if (!raw) return                    // 编辑回填的老图没有 raw，放过
  if (!raw.type.startsWith('image/')) {
    ElMessage.error('请上传图片内容')
    form.fileList = form.fileList.filter(f => f.uid !== uploadFile.uid)
    return
  }
  if (raw.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过10MB!')
    form.fileList = form.fileList.filter(f => f.uid !== uploadFile.uid)
  }
}

async function onProvinceChange(id) {
  form.cityId = null
  form.districtId = null
  optionsCity.value = []
  optionsArea.value = null
  if (!id) return
  try {
    optionsCity.value = (await getCityList(id)).data
  } catch {
    //同上
  }
}

async function onCityChange(id) {
  form.districtId = null
  optionsArea.value = null
  if (!id) return
  try {
    optionsArea.value = (await listDistrictInfoByCityId(id)).data
  } catch {
    //同上
  }
}

//获取公寓信息数据
async function loadDetail() {
  try {
    const res = await getApartmentById(id.value)
    const data = res.data
    const [cityRes, districtRes] = await Promise.all([
      getCityList(data.provinceId),
      listDistrictInfoByCityId(data.cityId),
    ])
    optionsCity.value = cityRes.data
    optionsArea.value = districtRes.data
    Object.assign(form, {
      name: data.name,
      introduction: data.introduction,
      provinceId: data.provinceId,
      cityId: data.cityId,
      districtId: data.districtId,
      addressDetail: data.addressDetail,
      phone: data.phone,
      isRelease: data.isRelease,
      //把接收到的对象数组转换成id数组（.mp把每一项过一遍，f => f.id取id）
      facilityInfoIds: (data.facilityInfoList ?? []).map(f => f.id),
      //?? 叫空值合并运算符。规则一句话：左边是 null 或 undefined → 用右边；否则 → 用左边。
      // 这里是指这个字段要是空的（null/undefined），就拿个空数组顶上
      labelIds: (data.labelInfoList ?? []).map(l => l.id),
      feeValueIds: (data.feeValueVoList ?? []).map(v => v.id),
      fileList: (data.graphVoList ?? []).map(g => ({ name: g.name, url: g.url }))
    })
  } catch {
    // 拦截器已经弹过提示了

  }
}
//获取省份配套标签杂费信息
async function loadOptions() {
  try {
    const [province, facility, label, feeValue] = await Promise.all([
      getProvinceList(),
      getFacilityInfoList(1), // 1 = 公寓；2 是房间用的配套
      getLabelInfoList(1),
      getFeeInfoList(),
    ])
    optionsProvince.value = province.data
    labelOptions.value = label.data
    facilityOptions.value = facility.data

    feeValueOptions.value = feeValue.data.map(fee => ({
      ...fee,//把那个对象的所有字段原样搬过来，下面对feeValueList的定于又把搬过来的feeValueList覆盖掉了
      treeKey: `group-${fee.id}`,
      label: fee.name,
      //children
      feeValueList: (fee.feeValueList ?? []).map(v => ({
        ...v,
        treeKey: v.id,//起id
        label: `${v.name} ${v.unit}(${fee.name})`,//展示数据名
      })),
    }))
    //   treeKey: "group-1"    label: "停车费"          ← 分组节点（不是叶子，选不中）
    //  ├─ treeKey: 3       label: "400 元/月(停车费)"
    //  ├─ treeKey: 2       label: "300 元/月(停车费)"
    //  └─ treeKey: 1       label: "200 元/月(停车费)"
  } catch {
    // 同上
  }
}

const expandedFeeKeys = computed(() => {
  if (!form.feeValueIds.length) return []
  return feeValueOptions.value
    .filter(fee => (fee.feeValueList ?? []).some(v => form.feeValueIds.includes(v.treeKey)))
    .map(fee => fee.treeKey)
})
onMounted(async () => {
  try {
    await loadOptions()
    if (id.value) {
      await loadDetail()
    }
  }
  catch {
    // 同上
  }
}

)
</script>
<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-height: 0;
}

.header {
  padding: 14px 20px 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.body {
  padding: 20px;

  max-width: 720px;
}

.area-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.preview-img {
  display: block;
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 15px;

}
</style>
