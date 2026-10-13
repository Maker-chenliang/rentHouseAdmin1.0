<template>
  <div class="container">
    <div class="header">
      <span class="header-title">
        {{ id != null ? "编辑房间" : "新增房间" }}
      </span>
    </div>
    <el-form ref="formRef" class="body" :model="form" :rules="rules" label-width="auto" scroll-to-error>
      <el-form-item label="房间号" prop="roomNumber">
        <el-input v-model="form.roomNumber" placeholder="请输入房间号" clearable />
      </el-form-item>

      <el-form-item label="租金" prop="rent">
        <el-input-number v-model="form.rent" :min="0" :step="1" />
      </el-form-item>

      <el-form-item label="所属公寓" prop="apartmentId">
        <div class="area-row">
          <el-select v-model="form.apartmentInfo.provinceId" placeholder="请选择省份" style="width: 240px" clearable
            @change="onProvinceChange(form.apartmentInfo.provinceId)">
            <el-option v-for="item in optionsProvince" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="form.apartmentInfo.cityId"
            :disabled="form.apartmentInfo.provinceId != null ? false : true" placeholder="请选择城市" style="width: 240px"
            clearable @change="onCityChange(form.apartmentInfo.cityId)">
            <el-option v-for="item in optionsCity" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="form.apartmentInfo.districtId" :disabled="form.apartmentInfo.cityId == null"
            placeholder="请选择地区" @change="onDistrictChange(form.apartmentInfo.districtId)" style="width: 240px"
            clearable>
            <el-option v-for="item in optionsArea" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <el-select v-model="form.apartmentId" :disabled="form.apartmentInfo.districtId == null" placeholder="请选择公寓"
            style="width: 240px" clearable>
            <el-option v-for="item in optionsApartment" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </div>
      </el-form-item>

      <el-form-item label="是否发布" prop="isRelease">
        <el-radio-group v-model="form.isRelease">
          <el-radio :value="0">未发布</el-radio>
          <el-radio :value="1">已发布</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="房间属性" prop="attrValueIds">
        <el-tree-select v-model="form.attrValueIds" :data="attrValueOptions" multiple :render-after-expand="false"
          node-key="treeKey" :props="{ label: 'label', children: 'attrValueList' }"
          :default-expanded-keys="expandedFeeKeys" />
      </el-form-item>

      <el-form-item label="房间配套" prop="facilityInfoIds">
        <el-select v-model="form.facilityInfoIds" multiple placeholder="请选择房间配套">
          <el-option v-for="f in facilityOptions" :key="f.id" :label="f.name" :value="f.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="房间标签" prop="labelInfoIds">
        <el-select v-model="form.labelInfoIds" multiple placeholder="请选择房间标签">
          <el-option v-for="l in labelOptions" :key="l.id" :label="l.name" :value="l.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="支付方式" prop="paymentTypeIds">
        <el-select v-model="form.paymentTypeIds" multiple placeholder="请选择房间支付方式">
          <el-option v-for="f in paymentTypeOptions" :key="f.id" :label="f.name" :value="f.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="可选租期" prop="leaseTermIds">
        <el-select v-model="form.leaseTermIds" multiple placeholder="请选择房间可选租期">
          <el-option v-for="f in leaseTermOptions" :key="f.id" :label="f.monthCount + f.unit" :value="f.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="房间图片" prop="fileList">
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
import { getCityList, getLabelInfoList, getProvinceList, listDistrictInfoByCityId, getFacilityInfoList, uploadFile, } from '@/api/apartment/apartment'
import { getApartmentListByDistrictId, getAttrInfoList, getPaymentList, getRoomById, getTermList, saveOrUpdateRoom } from '@/api/apartment/roomManagement'
const router = useRouter()
const LIST_PATH = '/apartmentManagement/roomManagement'
const route = useRoute()
const rules = reactive({
  roomNumber: [
    { required: true, message: '请输入房间号', trigger: 'blur' },

  ],
  rent: [
    { required: true, message: '请完善租金信息', trigger: 'blur' },
  ],
  apartmentId: [
    { required: true, message: '请选择所属公寓', trigger: 'blur' },
  ],
  attrValueIds: [
    { required: true, message: '请选择房间属性', trigger: 'blur' },
  ],
  facilityInfoIds: [
    { required: true, message: '请选择房间配套', trigger: 'blur' },
  ],
  paymentTypeIds: [
    { required: true, message: '请选择支付方式', trigger: 'blur' },
  ],
  leaseTermIds: [
    { required: true, message: '请选择租期', trigger: 'blur' },
  ],
  fileList: [
    { required: true, message: '请上传房间图片', trigger: 'blur' },
  ],

})
const id = computed(() => route.params.id)
const form = reactive({
  roomNumber: '',
  rent: null,
  apartmentId: null,
  isRelease: 0,
  apartmentInfo: {},
  facilityInfoIds: [],
  labelInfoIds: [],
  attrValueIds: [],
  paymentTypeIds: [],
  fileList: [],
  leaseTermIds: []
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
    await saveOrUpdateRoom({
      id: id.value ?? null,
      ...rest,
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
const optionsApartment = ref([])
const facilityOptions = ref([])
const labelOptions = ref([])
const attrValueOptions = ref([])
const leaseTermOptions = ref([])
const paymentTypeOptions = ref([])

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
  form.apartmentInfo.cityId = null
  form.apartmentInfo.districtId = null
  form.apartmentId = null
  optionsCity.value = []
  optionsArea.value = []
  optionsApartment.value = []
  if (!id) return
  try {
    optionsCity.value = (await getCityList(id)).data
  } catch {
    //同上
  }
}

async function onCityChange(id) {
  form.apartmentInfo.districtId = null
  form.apartmentId = null
  optionsArea.value = []
  optionsApartment.value = []
  if (!id) return
  try {
    optionsArea.value = (await listDistrictInfoByCityId(id)).data
  } catch {
    //同上
  }
}

async function onDistrictChange(id) {
  form.apartmentId = null
  optionsApartment.value = []
  if (!id) return
  try {
    optionsApartment.value = (await getApartmentListByDistrictId(id)).data
  } catch {
    //同上
  }
}


//获取房间信息数据
async function loadDetail() {
  try {
    const res = await getRoomById(id.value)
    const data = res.data
    const [cityRes, districtRes, apartmentRes] = await Promise.all([
      getCityList(data.apartmentInfo.provinceId),
      listDistrictInfoByCityId(data.apartmentInfo.cityId),
      getApartmentListByDistrictId(data.apartmentInfo.districtId)
    ])
    optionsCity.value = cityRes.data
    optionsArea.value = districtRes.data
    optionsApartment.value = apartmentRes.data
    Object.assign(form, {
      roomNumber: data.roomNumber,

      rent: data.rent,
      apartmentId: data.apartmentId,
      isRelease: data.isRelease,
      apartmentInfo: data.apartmentInfo,
      //把接收到的对象数组转换成id数组（.mp把每一项过一遍，f => f.id取id）
      facilityInfoIds: (data.facilityInfoList ?? []).map(f => f.id),
      //?? 叫空值合并运算符。规则一句话：左边是 null 或 undefined → 用右边；否则 → 用左边。
      // 这里是指这个字段要是空的（null/undefined），就拿个空数组顶上
      labelInfoIds: (data.labelInfoList ?? []).map(l => l.id),
      attrValueIds: (data.attrValueVoList ?? []).map(v => v.id),
      fileList: (data.graphVoList ?? []).map(g => ({ name: g.name, url: g.url })),
      paymentTypeIds: (data.paymentTypeList ?? []).map(p => p.id),
      leaseTermIds: (data.leaseTermList ?? []).map(e => e.id)
    })
  } catch {
    // 拦截器已经弹过提示了

  }
}
//获取options信息
async function loadOptions() {
  try {
    const [province, facility, label, attrValue, paymentType, leaseTerm] = await Promise.all([
      getProvinceList(),
      getFacilityInfoList(2), // 1 = 公寓；2 是房间用的配套
      getLabelInfoList(2),
      getAttrInfoList(),
      getPaymentList(),
      getTermList()
    ])
    optionsProvince.value = province.data
    labelOptions.value = label.data
    facilityOptions.value = facility.data

    paymentTypeOptions.value = paymentType.data
    leaseTermOptions.value = leaseTerm.data

    attrValueOptions.value = attrValue.data.map(attr => ({
      ...attr,
      treeKey: `group-${attr.id}`,
      label: attr.name,
      //children
      attrValueList: (attr.attrValueList ?? []).map(v => ({
        ...v,
        treeKey: v.id,//起id
        label: `${v.name} (${attr.name})`,//展示数据名
      })),
    }))

  } catch {
    // 同上
  }
}

const expandedFeeKeys = computed(() => {
  if (!form.attrValueIds.length) return []
  return attrValueOptions.value
    .filter(attr => (attr.attrValueList ?? []).some(v => form.attrValueIds.includes(v.treeKey)))
    .map(attr => attr.treeKey)
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
