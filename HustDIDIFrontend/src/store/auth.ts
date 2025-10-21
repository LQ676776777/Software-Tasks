
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
    try {
      const data = await getProfile()
      set({ profile: data })
    } catch (e) { /* ignore */ }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: undefined, isAuthed: false, profile: undefined })
  }
}))

export default useAuth
