
import { create } from 'zustand'
import { getProfile } from '@/api/auth'

interface AuthState {
  token?: string
  isAuthed: boolean
  profile?: any
  setToken: (t?: string) => void
  fetchProfile: () => Promise<void>
  logout: () => void
}

const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token') || undefined,
  isAuthed: !!localStorage.getItem('token'),
  profile: undefined,
  setToken: (t) => {
    if (t) localStorage.setItem('token', t)
    else localStorage.removeItem('token')
    set({ token: t, isAuthed: !!t })
  },
  fetchProfile: async () => {
    // 后端暂未提供获取当前登录用户信息的接口，因此此函数留空
    return
  },
  logout: () => {
    // 清理前端 token
    localStorage.removeItem('token')
    // 通知后端退出登录，忽略错误
    try {
      // 使用独立请求退出登录，后端会清空 Session
      // 不用 client 避免触发拦截器的统一处理
      fetch('/api/logout', { method: 'POST', credentials: 'include' })
    } catch (_) {}
    set({ token: undefined, isAuthed: false, profile: undefined })
  }
}))

export default useAuth
