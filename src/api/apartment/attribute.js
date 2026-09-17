import request from "@/request";
/**
 * @typedef {Object} AttrKey
 * @property {number|string} id
 * @property {string} name
 */

/**
 * 新增或修改配套信息
 * @param {object} params 配套信息表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.type 配套所属对象类型,可用值:1,2
 * @param {string} params.name 名称
 * @param {string} params.icon 图标
 * @returns
 */
export function saveOrUpdateFacilityInfo(params) {
  return request.post(`/admin/facility/saveOrUpdate`, params);
}

/**
 * 根据id删除配套信息
 * @param {string} id
 * @returns
 */
export function removeFacilityInfoById(id) {
  return request.delete(`/admin/facility/deleteById?id=${id}`);
}

/**
 * 新增或修改标签信息
 * @param {object} params 标签信息表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.type 类型,可用值:1,2
 * @param {string} params.name 标签名称
 * @returns
 */
export function saveOrUpdateLabelInfo(params) {
  return request.post(`/admin/label/saveOrUpdate`, params);
}

/**
 * 根据id删除标签信息
 * @param {string} id
 * @returns
 */
export function deleteLabelByIdInfo(id) {
  return request.delete(`/admin/label/deleteById?id=${id}`);
}

/**
 * 新增或更新属性名称
 * @param {object} params 房间基本属性表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.name 属性key
 * @returns
 */
export function saveOrUpdateAttrKey(params) {
  return request.post(`/admin/attr/key/saveOrUpdate`, params);
}

/**
 * 新增或更新属性值
 * @param {object} params 房间基本属性值表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.name 属性value
 * @param {number} params.attrKeyId 对应的属性key_id
 * @returns
 */
export function saveOrUpdateAttrValue(params) {
  return request.post(`/admin/attr/value/saveOrUpdate`, params);
}

/**
 * 根据id删除属性名称
 * @param {string} attrKeyId
 * @returns
 */
export function removeAttrKeyById(attrKeyId) {
  return request.delete(`/admin/attr/key/deleteById?attrKeyId=${attrKeyId}`);
}

/**
 * 根据id删除属性值
 * @param {string} id
 * @returns
 */
export function removeAttrValueById(id) {
  return request.delete(`/admin/attr/value/deleteById?id=${id}`);
}

/**
 * 保存或更新杂费名称
 * @param {object} params 杂项费用名称表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.name 付款项key
 * @returns
 */
export function saveOrUpdateFeeKey(params) {
  return request.post(`/admin/fee/key/saveOrUpdate`, params);
}

/**
 * 保存或更新杂费值
 * @param {object} params 杂项费用值表
 * @param {number} params.id 主键
 * @param {object} params.isDeleted 逻辑删除
 * @param {string} params.name 费用value
 * @param {string} params.unit 收费单位
 * @param {number} params.feeKeyId 费用所对的fee_key编码
 * @returns
 */
export function saveOrUpdateFeeValue(params) {
  return request.post(`/admin/fee/value/saveOrUpdate`, params);
}

/**
 * 根据id删除杂费名称
 * @param {string} feeKeyId
 * @returns
 */
export function deleteFeeKeyById(feeKeyId) {
  return request.delete(`/admin/fee/key/deleteById?feeKeyId=${feeKeyId}`);
}

/**
 * 根据id删除杂费值
 * @param {string} id
 * @returns
 */
export function deleteFeeValueById(id) {
  return request.delete(`/admin/fee/value/deleteById?id=${id}`);
}
