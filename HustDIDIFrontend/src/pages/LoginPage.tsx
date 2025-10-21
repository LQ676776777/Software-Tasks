
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginWithCode, sendCode } from '@/api/auth'
import useAuth from '@/store/auth'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const { setToken } = useAuth()

  const onSend = async () => {
    setLoading(true)
    try {
      await sendCode(phone)
      alert('验证码已发送')
    } finally { setLoading(false) }
  }

  const onLogin = async () => {
    setLoading(true)
    try {
      const { token } = await loginWithCode(phone, code)
      setToken(token)
      const redirect = (loc.state as any)?.from?.pathname || '/'
      nav(redirect, { replace: true })
    } catch (e: any) {
      alert(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl border shadow-sm">
      <h1 className="text-xl font-bold mb-4 text-gray-800">手机验证码登录</h1>
      <div className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="手机号" value={phone} onChange={e=>setPhone(e.target.value)} />
        <div className="flex gap-2">
          <input className="flex-1 border rounded p-2" placeholder="验证码" value={code} onChange={e=>setCode(e.target.value)} />
          <button onClick={onSend} disabled={loading} className="px-3 py-2 rounded bg-gray-900 text-white">发送验证码</button>
        </div>
        <button onClick={onLogin} disabled={loading} className="w-full px-3 py-2 rounded bg-blue-600 text-white">登录</button>
      </div>
    </div>
  )
}
