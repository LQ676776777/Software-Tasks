
// import { create } from 'zustand'
// import { getProfile } from '@/api/auth'

// interface AuthState {
//   token?: string
//   isAuthed: boolean
//   profile?: any
//   setToken: (t?: string) => void
//   fetchProfile: () => Promise<void>
//   logout: () => void
// }

// const useAuth = create<AuthState>((set, get) => ({
//   token: localStorage.getItem('token') || undefined,
//   isAuthed: !!localStorage.getItem('token'),
//   profile: undefined,
//   setToken: (t) => {
//     if (t) localStorage.setItem('token', t)
//     else localStorage.removeItem('token')
//     set({ token: t, isAuthed: !!t })
//   },
//   fetchProfile: async () => {
//     try {
//       const data = await getProfile()
//       set({ profile: data })
//     } catch (err) {
//       console.error('获取用户信息失败', err)
//       // 如果 401 或未登录，可以清除 token
//       set({ profile: null })
//     }
//   },
//   logout: () => {
//     // 清理前端 token
//     localStorage.removeItem('token')
//     // 通知后端退出登录，忽略错误
//     try {
//       // 使用独立请求退出登录，后端会清空 Session
//       // 不用 client 避免触发拦截器的统一处理
//       fetch('/api/logout', { method: 'POST', credentials: 'include' })
//     } catch (_) {}
//     set({ token: undefined, isAuthed: false, profile: undefined })
//   }
// }))


// export default useAuth


// src/store/auth.ts
import { create } from 'zustand'
import { getProfile } from '@/api/auth' // 我们等下会在 api/auth.ts 里加这个
// getProfile 调的是后端 GET /user

// 你后端 /user 返回的用户信息结构
export interface Profile {
  userName?: string
  schoolName?: string
  gender?: string
  phone?: string
  phoneNumber?: string
}

interface AuthState {
  token: string | null
  profile: Profile | null

  // 这个是“是否登录”
  isAuthed: boolean

  // actions
  setToken: (token: string | null) => void
  logout: () => void
  fetchProfile: () => Promise<void>
  checkLogin: () => Promise<void>
}

const useAuth = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  profile: null,

  // 这里用 getter，这样它永远是基于当前 state 计算，而不是固定值
  get isAuthed() {
    return !!get().token
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({
      token: null,
      profile: null,
    })
  },

  // 关键：向后端拿 /user 并更新全局 profile
  // fetchProfile: async () => {
  //   try {
  //     const data = await getProfile() // axios GET /user
  //     set({ profile: data })
  //   } catch (err) {
  //     console.error('fetchProfile 失败: ', err)
  //     // 401 / 未登录 之类的情况，稳妥做法是清空本地态
  //     set({ profile: null })
  //   }
  // },

    fetchProfile: async () => {
    const data = await getProfile()      // GET /user
    set({ profile: data })
  },

  checkLogin: async () => {
    try {
      const data = await getProfile()
      set({ profile: data, token: get().token ?? localStorage.getItem('token') ?? null })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, profile: null })
      throw new Error('unauthed')
    }
  }
}))

export default useAuth

