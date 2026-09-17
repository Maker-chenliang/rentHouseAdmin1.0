import axios from "axios";
import {
  ElMessage
} from "element-plus";
import {
  LOGIN_URL
} from "./config/config";
import {
  useUserStore
} from "./stores/user";
const service = axios.create({
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_APP_BASE_URL : '/',
  timeout: 20000
})
//请求拦截
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['access-token'] = userStore.token

    }
    return config
  },
  (error) => Promise.reject(error),

)
//响应拦截
service.interceptors.response.use(
  (response) => {
    const {
      data
    } = response
    //登录失败
    if ([305, 601, 602].includes(data.code)) {
      const userStore = useUserStore()
      userStore.logout()
      ElMessage.error(data.message || '登录已过期')
      location.href = LOGIN_URL
      return Promise.reject(data)
    }
    //业务报错
    if (data.code && data.code !== 200) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(data)
    }
    return data //成功
  },
  (error) => {
    const status = error.response?.status
    const map = {
      401: 'token失效，请重新登录',
      403: '拒绝访问',
      404: '请求地址错误',
      500: '服务器故障',
    }
    ElMessage.error(map[status] || '网络连接故障')
    return Promise.reject(error)
  },



)
const request = {
  get: (url, params, config) => service.get(url, {
    params,
    ...config
  }),
  post: (url, data, config) => service.post(url, data, config),
  put: (url, data, config) => service.put(url, data, config),
  delete: (url, data, config) => service.delete(url, {
    data,
    ...config
  }),
}

export default request
