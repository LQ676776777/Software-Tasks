// src/api/client.ts
import axios from 'axios'
import type { Result } from './result'
import { isOk, getMessage } from './result'

const client = axios.create({
  baseURL: '/api',        // 走 vite 代理
  timeout: 10000,
  withCredentials: true,  // ✅ 关键：后端用 Session 登录必须加
})

// ============= 请求拦截器 =============
client.interceptors.request.use((cfg) => {
  // 若后端改成 JWT 模式，可以用这个 token
  const token = localStorage.getItem('token')
  if (token) {
    cfg.headers = cfg.headers || {}
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})

// ============= 响应拦截器 =============
client.interceptors.response.use(
  (res) => {
    // 后端返回 Result 格式 { code, msg, data }
    const payload = res.data as Result<any>
    if (payload && typeof payload === 'object' && 'data' in payload) {
      if (isOk(payload)) return payload.data
      const msg = getMessage(payload) || '请求失败'
      return Promise.reject(new Error(msg))
    }

    // 如果后端没包装，直接返回 data
    return res.data
  },
  (err) => {
    // 统一错误信息
    const status = err?.response?.status
    let msg =
      err?.response?.data?.message ||
      err?.message ||
      '网络错误'

    if (status === 401) msg = '未登录或登录已过期'
    if (status === 403) msg = '无权限访问'
    if (status === 404) msg = '接口不存在'
    if (status >= 500) msg = '服务器错误'

    return Promise.reject(new Error(msg))
  }
)

export default client
