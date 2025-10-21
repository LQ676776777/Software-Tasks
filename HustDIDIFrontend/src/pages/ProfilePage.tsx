
import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'
import { updateProfile, getProfile } from '@/api/auth'

export default function ProfilePage() {
  const { profile, fetchProfile, logout } = useAuth()
  const [form, setForm] = useState<any>(profile || {})

  useEffect(() => { fetchProfile() }, [])
  useEffect(() => { setForm(profile||{}) }, [profile])

  const save = async () => {
    await updateProfile(form)
    alert('保存成功')
    await fetchProfile()
  }

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-2xl p-6 space-y-3">
      <h1 className="text-xl font-bold">个人信息</h1>
      <input className="w-full border rounded p-2" placeholder="昵称" value={form.nickname||''} onChange={e=>setForm({...form, nickname:e.target.value})}/>
      <input className="w-full border rounded p-2" placeholder="学院" value={form.faculty||''} onChange={e=>setForm({...form, faculty:e.target.value})}/>
      <div className="flex gap-2">
        <button className="flex-1 bg-blue-600 text-white rounded py-2" onClick={save}>保存</button>
        <button className="flex-1 border rounded py-2" onClick={logout}>退出登录</button>
      </div>
    </div>
  )
}
