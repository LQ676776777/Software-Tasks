// src/pages/ProfilePage.tsx

import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'
import { updateProfile } from '@/api/auth'
import { UserCircle, Save, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/Toast'

export default function ProfilePage() {
  const nav = useNavigate()
  const toast = useToast()
  const { profile, fetchProfile } = useAuth()

  const [form, setForm] = useState({
    userName: '',
    schoolName: '',
    gender: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile) {
      fetchProfile()
    }
  }, [profile, fetchProfile])

  useEffect(() => {
    if (profile) {
      setForm({
        userName: profile.userName || '',
        schoolName: profile.schoolName || '',
        gender: profile.gender || ''
      })
    }
  }, [profile])

  const handleInputChange = (
    field: 'userName' | 'schoolName' | 'gender',
    value: string
  ) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const save = async () => {
    setLoading(true)
    try {
      await updateProfile(form)
      toast('保存成功','success')
      await fetchProfile()
      nav('/account', { replace: true })
    } catch (e: any) {
      toast(e.message || '保存失败','error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">

        {/* 顶部标题 + 返回 */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <UserCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">编辑个人信息</h1>
              <p className="text-sm text-gray-400 mt-1">这些信息会展示给与你拼车的人</p>
            </div>
          </div>

          <button
            onClick={() => nav('/account')}
            className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-700 gap-1 px-3 py-2 rounded-xl bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4" />
            返回
          </button>
        </div>

        {/* 表单 */}
        <div className="space-y-6">
          <div className="group">
            <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">昵称</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                placeholder="请输入你的昵称"
                value={form.userName}
                onChange={e => handleInputChange('userName', e.target.value)}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">性别</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                placeholder="请输入你的性别"
                value={form.gender}
                onChange={e => handleInputChange('gender', e.target.value)}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">学院</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                placeholder="请输入你的学院"
                value={form.schoolName}
                onChange={e => handleInputChange('schoolName', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 保存按钮 */}
        <div className="pt-4">
          <button
            onClick={save}
            disabled={loading}
            className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70"
          >
            <Save size={20} />
            保存信息
          </button>
        </div>
      </div>
    </div>
  )
}
