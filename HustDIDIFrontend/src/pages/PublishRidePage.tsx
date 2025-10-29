// src/pages/PublishRidePage.tsx

import { useState } from 'react'
import { createRide } from '@/api/rides'
import { useNavigate } from 'react-router-dom'
import { PenSquare, Send } from 'lucide-react'

export default function PublishRidePage() {
  // 表单字段与后端 CarPool 一致：startPlace, destination, dateTime
  const [form, setForm] = useState({
    startPlace: '',
    destination: '',
    dateTime: ''
  })
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const submit = async () => {
    // 简单的前端校验
    if (!form.startPlace || !form.destination || !form.dateTime) {
      alert('请填写完整的出发地、目的地和出发时间')
      return
    }
    setLoading(true)
    try {
      await createRide(form) // 与后端模型一致
      alert('发布成功！')
      nav('/') // 发布成功后跳转到首页
    } catch (e: any) {
      alert(e.message || '发布失败')
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (label: string, placeholder: string, field: keyof typeof form, type: string = 'text') => (
    <div className="group">
      <label className="block text-sm sm:text-base text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
        {label}
      </label>
      <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
        <input
          className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
          type={type}
          placeholder={placeholder}
          value={form[field] as string}
          onChange={e => handleInputChange(field, e.target.value)}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8 pb-16">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">
        {/* 标题部分 - 采用 PageHeader 的内部样式 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <PenSquare className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">发布新的拼车</h1>
            <p className="text-sm text-gray-400 mt-1">分享你的行程，找到同路人</p>
          </div>
        </div>

        <div className="space-y-6">
          {renderInput('出发地', '例如：东一食堂', 'startPlace')}
          {renderInput('目的地', '例如：光谷广场', 'destination')}
          {renderInput('出发时间', '', 'dateTime', 'datetime-local')}
        </div>

        <div className="pt-4">
          <button onClick={submit} disabled={loading} className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70">
            <Send size={20} />
            确认发布
          </button>
        </div>
      </div>
    </div>
  )
}

