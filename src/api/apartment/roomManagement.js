import request from "@/request";
/**
 * @typedef {Object} Room
 * @property {number|string} id
 * @property {number|string} roomNumber  房间号
 * @property {number|string} rent        租金
 * @property {number|string} apartmentId 所属公寓id
 * @property {number|string} isRelease   发布状态 0未发布 1已发布
 * @property {string} leaseEndDate       租约到期日
 * @property {boolean} isCheckIn         是否入住
 * @property {Object} apartmentInfo      所属公寓信息
 * @property {Array} [attrValueVoList]   属性信息
 * @property {Array} [facilityInfoList]  配套信息
 * @property {Array} [labelInfoList]     标签信息
 * @property {Array} [paymentTypeList]   支付方式
 * @property {Array} [leaseTermList]     可选租期
 * @property {Array} [graphVoList]       图片 [{url, name}]
 */

/**
 * @typedef {Object} SaveRoom
 * @property {number|string} id
 * @property {string} roomNumber
 * @property {number|string} rent
 * @property {number|string} apartmentId
 * @property {number|string} isRelease
 * @property {number[]} attrValueIds     属性id数组
 * @property {number[]} facilityInfoIds  配套id数组
 * @property {number[]} labelInfoIds     标签id数组
 * @property {number[]} paymentTypeIds   支付方式id数组
 * @property {number[]} leaseTermIds     租期id数组
 * @property {Array} graphVoList         图片
 */

/**
 * @typedef {Object} Payment
 * @property {number|string} id
 * @property {string} name            支付方式名称
 * @property {string|number} payMonthCount 付几个月
 * @property {string} additionalInfo  附加说明
 */

/**
 * @typedef {Object} Term
 * @property {number|string} id
 * @property {string} unit            单位
 * @property {string|number} monthCount 月数
 */
//#region <房间>
/**
 * 根据条件分页查询房间列表
 * @property {Object} params
 * @property {number} params.pageNum
 * @property {number} params.size
 * @property {number|string} [params.provinceId]
 * @property {number|string} [params.cityId]
 * @property {number|string} [params.districtId]
 * @property {number|string} [params.apartmentId]
 */
export function getRoomList(params) {
  return request.get('/admin/room/pageItem', {
    current: params.pageNum,
    size: params.size,
    provinceId: params.provinceId,
    cityId: params.cityId,
    districtId: params.districtId,
    apartmentId: params.apartmentId
  })
}

/**
 * 根据id获取房间详细信息
 * @param {string|number} id
 * @returns
 */
export function getRoomById(id) {
  return request.get(`/admin/room/getDetailById?id=${id}`);
}

/**
 * 保存或更新房间信息
 * @param {object} params 房间信息
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.roomNumber 房间号
 * @param {number} params.rent 租金（元/月）
 * @param {number} params.apartmentId 所属公寓id
 * @param {string} params.isRelease 是否发布，0未发布 1已发布
 * @param {array} params.graphVoList 图片信息
 * @param {array} params.attrValueIds 属性信息列表
 * @param {array} params.facilityInfoIds 配套信息列表
 * @param {array} params.labelInfoIds 标签信息列表
 * @param {array} params.paymentTypeIds 支付方式列表
 * @param {array} params.leaseTermIds 可选租期列表
 * @returns
 */
export function saveOrUpdateRoom(params) {
  return request.post(`/admin/room/saveOrUpdate`, params);
}

/**
 * 根据id修改房间发布状态
 * @param {number|string} id
 * @param {number} status 0未发布 1已发布
 */
export function updateRoomReleaseStatus(id, status) {
  return request.post(`/admin/room/updateReleaseStatusById?id=${id}&status=${status}`)
}

/**
 * 根据id删除房间信息
 * @param {number|string} id
 */
export function deleteRoomById(id) {
  return request.delete(`/admin/room/removeById?id=${id}`)
}

/**
 * 根据区县id查公寓信息列表（筛选房间用）
 * @param {number|string} districtId
 */
export function getApartmentListByDistrictId(districtId) {
  return request.get(`/admin/apartment/listInfoByDistrictId?id=${districtId}`)
}

/**
 * 查询全部属性名称和属性值列表
 * @returns {Promise<{data: Array<{id, name, attrValueList}>}>}
 */
export function getAttrInfoList() {
  return request.get('/admin/attr/list')
}

/**
 * 查询全部支付方式列表
 * @returns
 */
export function getPaymentList() {
  return request.get(`/admin/payment/list`);
}

/**
 * 保存或更新支付方式
 * @param {object} params 支付方式表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.name 付款方式名称
 * @param {string} params.payMonthCount 每次支付租期数
 * @param {string} params.additionalInfo 付费说明
 * @returns
 */
export function saveOrUpdatePaymentType(params) {
  return request.post(`/admin/payment/saveOrUpdate`, params);
}

/**
 * 根据ID删除支付方式
 * @param {string} id
 * @returns
 */
export function deletePaymentById(id) {
  return request.delete(`/admin/payment/deleteById?id=${id}`);
}

/**
 * 查询全部租期列表
 * @returns
 */
export function getTermList() {
  return request.get(`/admin/term/list`);
}

/**
 * 保存或更新租期信息
 * @param {object} params 租期信息
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {number} params.monthCount 租期月数
 * @param {string} params.unit 租期单位:月
 * @returns
 */
export function saveOrUpdateTerm(params) {
  return request.post(`/admin/term/saveOrUpdate`, params);
}

/**
 * 根据ID删除租期
 * @param {string} id
 * @returns
 */
export function deleteTermById(id) {
  return request.delete(`/admin/term/deleteById?id=${id}`);
}
