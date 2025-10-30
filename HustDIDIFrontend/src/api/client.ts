// src/api/client.ts
import axios from 'axios'
import type { Result } from './result'
import { isOk, getMessage } from './result'
import { useToast } from '@/components/Toast'
import useAuth from '@/store/auth'

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
    /**
     * 后端统一返回 { success, errorMsg, data, total } 结构。
     * 在此统一判断并返回整个 payload，方便调用方同时获取 data 和 total。
     */
    const payload = res.data as Result<any>
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (isOk(payload)) {
        return payload
      }
      const msg = getMessage(payload) || '请求失败'
      return Promise.reject(new Error(msg))
    }
    // 如果后端没有包装 Result，直接返回原始 data
    return res.data
  },
  (err) => {
    // 统一错误信息
    const status = err?.response?.status
    let msg =
      err?.response?.data?.message ||
      err?.message ||
      '网络错误'

    const toast = useToast()

    if (status === 401) msg = '未登录或登录已过期'
    {
      const { logout } = useAuth.getState()
      logout()
      toast?.('登录已过期，请重新登录', 'error')
      // 可选：跳转
      window.location.href = '/login'
    }
    if (status === 403) msg = '无权限访问'
    if (status === 404) msg = '接口不存在'
    if (status >= 500) msg = '服务器错误'

    return Promise.reject(new Error(msg))
  }
)

export default client
