import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginWithCode, sendCode } from '@/api/auth'
import useAuth from '@/store/auth'
import { KeyRound } from 'lucide-react'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [agree, setAgree] = useState(true)
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [hasSent, setHasSent] = useState(false)
  const nav = useNavigate()
  const loc = useLocation()
  const { setToken /*, fetchProfile*/ } = useAuth()

  // 更稳的倒计时：不会出现负数
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const validPhone = /^1\d{10}$/.test(phone)
  const validCode = code.length >= 4 // 根据后端实际位数改成 6 也可

  const onSend = async () => {
    if (!validPhone) return alert('请输入正确的11位手机号')
    if (cooldown > 0) return
    setLoadingSend(true)
    try {
      // 关键：sendCode 内部需以查询参数方式发送 (/code?phone=xxx)
      const res = await sendCode(phone) as any
      setHasSent(true)
      // 如果后端返回 ttl，用返回值；否则退化为 60
      const ttl = typeof res?.ttl === 'number' && res.ttl > 0 ? res.ttl : 60
      setCooldown(ttl)
    } catch (e: any) {
      alert(e?.message || '发送失败')
    } finally {
      setLoadingSend(false)
    }
  }

  const onLogin = async () => {
    if (!agree) return alert('请先勾选并同意协议')
    if (!validPhone || !validCode) return alert('请填写合法的手机号与验证码')
    setLoadingLogin(true)
    try {
      // 后端是 Session 登录：POST /login { phone, code } 即可
      await loginWithCode(phone, code)

      // 使用占位 token 进入已登录态；鉴权实际靠 session cookie
      setToken('session')
      // 如果后端补了 /user/me，可以开启：
      // await fetchProfile()

      const redirect = (loc.state as any)?.from?.pathname || '/'
      nav(redirect, { replace: true })
    } catch (e: any) {
      alert(e?.message || '登录失败')
    } finally {
      setLoadingLogin(false)
    }
  }

  const sendBtnText =
    cooldown > 0 ? `${cooldown}s` : hasSent ? '重新发送验证码' : '获取验证码'

  // 允许回车触发登录（可选）
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pb-20 sm:pb-24">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">

        {/* 标题 */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <KeyRound className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">登录 / 注册</h1>
            <p className="text-sm text-gray-400 mt-1">验证码通过后将自动注册</p>
          </div>
        </div>

        {/* 表单 */}
        <div className="space-y-6 pt-2">
          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">手机号</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <input
                className="w-full bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100 py-2"
                type="tel"
                inputMode="numeric"
                maxLength={11}
                placeholder="请输入手机号"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">验证码</label>
            <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
              <div className="flex items-center gap-0 py-2">
                <input
                  className="flex-1 bg-transparent outline-none text-base sm:text-lg text-gray-900 placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100"
                  type="tel"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="请输入验证码"
                  value={code}
                  onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={onKeyDown}
                />
                <button
                  onClick={onSend}
                  disabled={loadingSend || cooldown > 0}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition
                    ${cooldown>0 ? 'bg-gray-100 text-gray-400 ring-1 ring-gray-200 cursor-not-allowed'
                                  : 'bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2'}`}>
                  {sendBtnText}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 按钮与协议 */}
        <div className="space-y-4 pt-4">
          <button
            onClick={onLogin}
            disabled={loadingLogin}
            className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold
                       bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70">
            {loadingLogin ? '登录中…' : '登录'}
          </button>

          <div className="pt-2">
            <label className="flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <input type="checkbox" className="w-4 h-4 accent-emerald-500" checked={agree} onChange={e => setAgree(e.target.checked)} />
              我已阅读并同意 <a className="text-emerald-600 hover:underline" href="/terms" target="_blank" rel="noreferrer">用户协议</a> 和 <a className="text-emerald-600 hover:underline" href="/privacy" target="_blank" rel="noreferrer">隐私政策</a>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
