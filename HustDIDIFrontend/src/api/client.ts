
import axios from 'axios'
import type { Result } from './result'
import { isOk, getMessage } from './result'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// attach token if exists
client.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) {
    cfg.headers = cfg.headers || {}
    cfg.headers['Authorization'] = `Bearer ${token}`
  }
  return cfg
})

client.interceptors.response.use(
  (res) => {
    // Backend wraps everything into { code/msg/data/... }
    const payload = res.data as Result<any>
    if (payload && typeof payload === 'object' && 'data' in payload) {
      if (isOk(payload)) return payload.data
      // not OK -> throw with message
      const msg = getMessage(payload) || '请求失败'
      return Promise.reject(new Error(msg))
    }
    // Fallback: if backend didn't wrap, return original data
    return res.data
  },
  (err) => {
    const msg = err?.response?.data?.message || err?.message || '网络错误'
    return Promise.reject(new Error(msg))
  }
)

export default client
