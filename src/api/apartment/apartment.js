import request from "@/request";
/**
 * @typedef {Object} Apartment
 * @property {number|string} id
 * @property {string} name             公寓名称
 * @property {string} introduction     公寓介绍
 * @property {number|string} provinceId
 * @property {string} provinceName
 * @property {number|string} cityId
 * @property {string} cityName
 * @property {number|string} districtId
 * @property {string} districtName
 * @property {string} addressDetail    详细地址
 * @property {number|string} latitude  纬度
 * @property {number|string} longitude 经度
 * @property {string} phone
 * @property {number|string} isRelease 发布状态 0未发布 1已发布
 * @property {number} totalRoomCount   总房间数
 * @property {number} freeRoomCount    空闲房间数
 * @property {number[]} [facilityInfoIds] 配套id数组
 * @property {number[]} [labelIds]        标签id数组
 * @property {number[]} [feeValueIds]     杂费值id数组
 * @property {Array} [graphVoList]        图片 [{url, name}]
 */

/**
 * @typedef {Object} Region
 * @property {number} id
 * @property {string} name
 */

//#region <公寓>
/**
 * 根据条件分页查询公寓列表
 * @param {Object} params
 * @param {number} params.pageNum               页码
 * @param {number} params.pageSize              每页条数
 * @param {number|string} [params.provinceId]   省份id
 * @param {number|string} [params.cityId]       城市id
 * @param {number|string} [params.districtId]   区域id
 * @returns {Promise<{code:number, message:string, data:{records:Apartment[], total:number}}>}
 */
export function getApartmentList(params) {
  return request.get('/admin/apartment/pageItem', {
    current: params.pageNum,
    size: params.pageSize,
    provinceId: params.provinceId,
    cityId: params.cityId,
    districtId: params.districtId
  })
}
/**
 * 查询省份列表
 * @returns {Promise<{data: Region[]}>}
 */
export function getProvinceList() {
  return request.get('/admin/region/province/list')
}
/**
 * 根据省份id查城市列表
 * @param {number|string} provinceId
 * @returns {Promise<{data: Region[]}>}
 */
export function getCityList(provinceId) {
  return request.get(`/admin/region/city/listByProvinceId?id=${provinceId}`)
}
/**
 * 根据城市id查区域列表
 * @param {number|string} cityId
 * @returns {Promise<{data: Region[]}>}
 */
export function listDistrictInfoByCityId(cityId) {
  return request.get(`/admin/region/district/listByCityId?id=${cityId}`);
}
/**
 * 根据ID获取公寓详细信息
 * @param {number|string} id
 * @returns
 */
export function getApartmentById(id) {
  return request.get(`/admin/apartment/getDetailById?id=${id}`);
}
/**
 * 保存或更新公寓信息
 * @param{Apartment} data
 *
 */
export function saveOrUpdateApartment(data) {
  return request.post(`/admin/apartment/saveOrUpdate`, data)
}
/**
 * 根据id修改公寓发布状态
 * @param {string} id
 * @param {string|number} status 0未发布 1已发布
 * @returns
 */
export function updateApartmentReleaseStatus(id, status) {
  return request.post(`/admin/apartment/updateReleaseStatusById?id=${id}&status=${status}`);
}
/**
 * 根据id删除公寓信息
 * @param {string} id
 * @returns
 */
export function deleteApartmentById(id) {
  return request.delete(`/admin/apartment/removeById?id=${id}`);
}
/**
 * 查询配套信息列表（新增公寓时勾选用）
 * @param {number|null} [type] 1公寓 2房间，不传查全部
 */
export function getFacilityInfoList(type = null) {
  return request.get(`/admin/facility/list${type ? `?type=${type}` : ''}`)
}

/**
 * 查询标签信息列表
 * @param {number|null} [type] 1公寓 2房间
 */
export function getLabelInfoList(type = null) {
  return request.get(`/admin/label/list${type ? `?type=${type}` : ''}`)
}

/**
 * 查询全部杂费名称和杂费值列表
 * @returns {Promise<{data:Array<{id:number,name:string,feeValueList:Array<{id:number,name:string,unit:string,feeKeyId:number}>}>}>}
 */
export function getFeeInfoList() {
  return request.get('/admin/fee/list')
}

/**
 * 上传图片到文件服务器（MinIO）
 * @param {File} file
 * @returns {Promise<{data:string}>} data 就是上传后的访问地址
 */
export function uploadFile(file) {
  const formData = new FormData()
  // 字段名必须是 file，对应后端 upload(@RequestParam MultipartFile file)
  formData.append('file', file)
  // 别手动写 Content-Type: 'multipart/form-data'。
  // 这个头必须带 boundary，而 boundary 是 axios 拿到 FormData 时自己生成的；
  // 手写会把 boundary 弄丢，后端就解析不出文件了
  return request.post('/admin/file/upload', formData)
}
