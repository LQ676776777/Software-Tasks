// src/pages/PublishRidePage.tsx
import { useEffect, useState } from 'react'
import { createRide } from '@/api/rides'
import { useNavigate } from 'react-router-dom'
import { PenSquare, Send } from 'lucide-react'
import { useToast } from '@/components/Toast'

// 把本地时间格式化为 <input type="datetime-local"> 需要的 "YYYY-MM-DDTHH:mm"
function formatLocalForInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const hh = pad(d.getHours())
  const mm = pad(d.getMinutes())
  return `${y}-${m}-${day}T${hh}:${mm}`
}

export default function PublishRidePage() {
  const [form, setForm] = useState({
    startPlace: '',
    destination: '',
    dateTime: '' // "YYYY-MM-DDTHH:mm"
  })
  const [minDateTime, setMinDateTime] = useState<string>(formatLocalForInput(new Date()))
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const toast = useToast()

  // 每 30s 刷新一次 min，避免用户长时间停留导致“当前时间”过期
  useEffect(() => {
    const t = setInterval(() => setMinDateTime(formatLocalForInput(new Date())), 30_000)
    return () => clearInterval(t)
  }, [])

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const submit = async () => {
    // 简单的前端校验
    if (!form.startPlace || !form.destination || !form.dateTime) {
      toast('请填写完整的出发地、目的地和出发时间', 'error')
      return
    }

    // 关键校验：必须晚于“此刻”
    const chosen = new Date(form.dateTime)            // dateTime 是本地时间的字符串
    if (Number.isNaN(chosen.getTime())) {
      toast('请选择合法的出发时间', 'error')
      return
    }
    if (chosen.getTime() <= Date.now()) {
      toast('出发时间必须晚于当前时间', 'error')
      return
    }

    setLoading(true)
    try {
      // 如果后端不接受带 T 的格式，可改成 'YYYY-MM-DD HH:mm'
      // 这里直接把输入值传给后端（与之前保持一致）
      await createRide(form)
      toast('发布成功！')
      nav('/')
    } catch (e: any) {
      toast(e?.message || '发布失败', 'error')
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (
    label: string,
    placeholder: string,
    field: keyof typeof form,
    type: string = 'text'
  ) => (
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
          // 只对时间输入生效的属性
          {...(field === 'dateTime'
            ? { min: minDateTime, step: 60 } // step=60(秒)；防止选择过去时间
            : {})}
        />
      </div>
    </div>
  )

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8 pb-16">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">
        {/* 标题部分 */}
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
          <button
            onClick={submit}
            disabled={loading}
            className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70"
          >
            <Send size={20} />
            确认发布
          </button>
        </div>
      </div>
    </div>
  )
}
