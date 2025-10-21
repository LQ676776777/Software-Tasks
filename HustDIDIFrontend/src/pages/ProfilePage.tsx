// src/pages/ProfilePage.tsx

import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'
import { updateProfile } from '@/api/auth'
import { UserCircle, LogOut, Save } from 'lucide-react' // 引入图标

export default function ProfilePage() {
  const { profile, fetchProfile, logout } = useAuth()
  // 初始化 form 状态，避免在 profile 加载完成前为 undefined
  const [form, setForm] = useState({ nickname: '', faculty: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 初始加载 profile
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  useEffect(() => {
    // 当 profile 加载或更新时，同步到 form
    if (profile) {
      setForm({
        nickname: profile.nickname || '',
        faculty: profile.faculty || '',
      })
    }
  }, [profile])

  const handleInputChange = (field: 'nickname' | 'faculty', value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const save = async () => {
    setLoading(true)
    try {
      await updateProfile(form)
      alert('保存成功')
      await fetchProfile() // 重新获取以保证数据同步
    } catch (e: any) {
      alert(e.message || '保存失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">
        {/* 标题部分 - 采用 PageHeader 的内部样式 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <UserCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">个人信息</h1>
            <p className="text-sm text-gray-400 mt-1">及时更新信息，方便他人联系</p>
          </div>
        </div>

        {/* 表单 */}
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">昵称</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                placeholder="请输入你的昵称"
                value={form.nickname}
                onChange={e => handleInputChange('nickname', e.target.value)}
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">学院</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                placeholder="请输入你的学院"
                value={form.faculty}
                onChange={e => handleInputChange('faculty', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button onClick={save} disabled={loading} className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70">
            <Save size={20} />
            保存信息
          </button>
          <button onClick={logout} className="w-full h-12 sm:h-14 rounded-2xl text-red-500 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-white ring-1 ring-red-300 hover:ring-red-400 active:ring-2 transition">
            <LogOut size={20} />
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}