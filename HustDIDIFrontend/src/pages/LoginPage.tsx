import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginWithCode, sendCode } from '@/api/auth'
import useAuth from '@/store/auth'
import { KeyRound } from 'lucide-react'
import { useToast } from '@/components/Toast'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [agree, setAgree] = useState(true)
  const [loadingSend, setLoadingSend] = useState(false)
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [hasSent, setHasSent] = useState(false)

  // 新增：控制弹窗开关
  const [showTerms, setShowTerms] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const nav = useNavigate()
  const loc = useLocation()
  const { setToken, fetchProfile } = useAuth()

  const COOLDOWN_KEY = 'sms_cooldown_until' // 过期时间戳(毫秒)

  const setCooldownUntil = (seconds: number) => {
    const until = Date.now() + seconds * 1000
    localStorage.setItem(COOLDOWN_KEY, String(until))
    setCooldown(seconds)
  }

  const syncCooldownFromStorage = () => {
    const raw = localStorage.getItem(COOLDOWN_KEY)
    if (!raw) return
    const until = Number(raw)
    const remain = Math.ceil((until - Date.now()) / 1000)
    if (remain > 0) setCooldown(remain)
    else localStorage.removeItem(COOLDOWN_KEY)
  }


  // 倒计时
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setInterval(() => setCooldown(v => Math.max(0, v - 1)), 1000)
    return () => clearInterval(t)
  }, [cooldown])

  const validPhone = /^1\d{10}$/.test(phone)
  const validCode = code.length === 6 // 如果后端要求6位，就 >=6
  const toast = useToast()


  useEffect(() => {
    syncCooldownFromStorage()
    // 可选：页面可见性变化时也同步一次，防止后台切回来时间不准
    const onVis = () => syncCooldownFromStorage()
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])


  const onSend = async () => {
  if (!validPhone) return toast('请输入正确的11位手机号','error')

  // 本地冷却命中：不打后端
  if (cooldown > 0) {
    return toast(`发送过于频繁，请 ${cooldown}s 后再试`, 'error')
  }

  // 乐观开启 60s，本地立即生效，防止连点并发
  setCooldownUntil(60)
  setLoadingSend(true)
  try {
    const res = await sendCode(phone) as any
    // 后端可能返回 { ttl: 60 } / { ttl: 43 } 之类
    const ttl = typeof res?.ttl === 'number' && res.ttl > 0 ? res.ttl : 60
    setCooldownUntil(ttl)                 // 与后端一致
    toast('验证码已发送','success')                  // 默认 success
  } catch (e: any) {
    // 如果后端因频率限制报错，可能也会携带剩余秒数
    const serverTtl =
      typeof e?.ttl === 'number' && e.ttl > 0
        ? e.ttl
        : (typeof e?.response?.data?.ttl === 'number' ? e.response.data.ttl : 0)

    if (serverTtl > 0) {
      setCooldownUntil(serverTtl)
      toast(`发送过于频繁，请 ${serverTtl}s 后再试`, 'error')
    } else {
      // 真失败：恢复可点，并清掉存储
      setCooldown(0)
      localStorage.removeItem(COOLDOWN_KEY)
      toast(e?.message || '发送失败', 'error')
    }
  } finally {
    setLoadingSend(false)
  }
}



  const onLogin = async () => {
    if (!agree) return toast('请先勾选并同意协议','error')
    if (!validPhone || !validCode) return toast('请填写合法的手机号与验证码','error')
    setLoadingLogin(true)
    try {
      // 调用后端登录接口
      await loginWithCode(phone, code)
      // 登录成功后，用手机号或固定字符串作为标识写入 token，以兼容后端基于 session 的登录机制
      setToken(phone || 'session')
      // 尝试拉取用户资料。若后端未提供相关接口，错误会被内部捕获并忽略
      try {
        await fetchProfile()
      } catch (_) {
        // 忽略资料获取失败，它不会阻止登录流程
      }

      toast('登录成功','success')
      // 成功后跳转到原页面或个人主页
      const redirect = (loc.state as any)?.from?.pathname || '/account'
      nav(redirect, { replace: true })
    } catch (e: any) {
      toast(e?.message || '登录失败','error')
    } finally {
      setLoadingLogin(false)
    }
  }


  const sendBtnText =
    cooldown > 0 ? `${cooldown}s` : hasSent ? '重发验证码' : '获取验证码'

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onLogin()
  }

  // 复用：验证码输入块（保持你之前的布局修正）
  const VerifyInputRow = (
    <div className="group">
      <label className="block text-sm text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
        验证码
      </label>

      <div className="border-b border-gray-300 focus-within:border-emerald-500 focus-within:shadow-[0_1px_0_0_rgba(16,185,129,0.8)] transition-all">
        <div className="flex items-center py-2 pr-1">
          <input
            className="flex-1 bg-transparent outline-none text-base sm:text-lg text-gray-900 
                       placeholder:text-gray-400 caret-emerald-500 selection:bg-emerald-100"
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
            className={`shrink-0 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-semibold transition-all
              ${cooldown > 0
                ? 'bg-gray-100 text-gray-400 ring-1 ring-gray-200 cursor-not-allowed'
                : 'bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2'}`}
            style={{
              marginRight: '2px',
              lineHeight: '1.1rem',
            }}
          >
            {sendBtnText}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* 登录卡片 */}
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="translate-y-[-40px] w-full max-w-lg bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-8">

          {/* 标题区 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <KeyRound className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">登录 / 注册</h1>
              <p className="text-sm text-gray-400 mt-1">验证码通过后将自动注册</p>
            </div>
          </div>

          {/* 表单区 */}
          <div className="space-y-6 pt-2">
            {/* 手机号 */}
            <div className="group">
              <label className="block text-sm text-gray-400 mb-2 group-focus-within:text-emerald-600 transition-colors">
                手机号
              </label>
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

            {/* 验证码 + 发送按钮 */}
            {VerifyInputRow}
          </div>

          {/* 登录按钮 */}
          <div className="space-y-4 pt-4">
            <button
              onClick={onLogin}
              disabled={loadingLogin}
              className="w-full h-12 sm:h-14 rounded-2xl text-white text-base sm:text-lg font-semibold
                         bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm hover:shadow active:opacity-95 disabled:opacity-70"
            >
              {loadingLogin ? '登录中…' : '登录'}
            </button>

            {/* 同意协议 */}
            <div className="pt-2">
              <label className="flex items-start justify-center gap-2 text-xs sm:text-sm text-gray-500 flex-wrap text-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-emerald-500 mt-0.5"
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                />
                <span className="leading-relaxed">
                  我已阅读并同意
                  <button
                    type="button"
                    className="text-emerald-600 hover:underline px-1"
                    onClick={() => setShowTerms(true)}
                  >
                    用户协议
                  </button>
                  和
                  <button
                    type="button"
                    className="text-emerald-600 hover:underline px-1"
                    onClick={() => setShowPrivacy(true)}
                  >
                    隐私政策
                  </button>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 模态弹窗：用户协议 ===== */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">用户协议</h2>
              <p className="text-xs text-gray-400 mt-1">请仔细阅读以下内容</p>
            </div>

            {/* 可滚动正文 */}
            <div className="p-5 flex-1 overflow-y-auto text-sm leading-relaxed text-gray-700 space-y-4">
              <p>欢迎使用本拼车平台。本协议主要说明您在使用本服务时的权利和义务。</p>

              <p className="font-semibold text-gray-900">1. 服务内容</p>
              <p>我们为华科大学子提供拼车信息发布和匹配服务，本平台本身不直接提供载客运输服务。</p>

              <p className="font-semibold text-gray-900">2. 信息真实性</p>
              <p>您承诺发布的出发地、目的地、时间、联系方式等为真实有效，不得恶意骚扰、欺骗他人。</p>

              <p className="font-semibold text-gray-900">3. 出行安全</p>
              <p>请在实际出行前自行确认对方身份和行程安排。平台不为线下出行本身承担交通或人身安全责任。</p>

              <p className="font-semibold text-gray-900">4. 账号处理</p>
              <p>如发现骗钱、放鸽子、辱骂、骚扰等行为，平台有权限制或封禁账号。</p>

              <p className="font-semibold text-gray-900">5. 协议更新</p>
              <p>我们可能会根据运营情况更新本协议。继续使用即视为你同意更新内容。</p>

              <p className="text-xs text-gray-400">
                如果你不同意本协议，请停止使用本服务。
              </p>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow active:opacity-90"
              >
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 模态弹窗：隐私政策 ===== */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">隐私政策</h2>
              <p className="text-xs text-gray-400 mt-1">我们如何处理你的信息</p>
            </div>

            {/* 可滚动正文 */}
            <div className="p-5 flex-1 overflow-y-auto text-sm leading-relaxed text-gray-700 space-y-4">
              <p>我们非常重视你的隐私，本政策解释我们会收集什么信息、怎么用、以及如何保护。</p>

              <p className="font-semibold text-gray-900">1. 我们会收集的信息</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>手机号（用于登录和拼车沟通）</li>
                <li>昵称、学院、性别等资料（对拼车对象可见）</li>
                <li>行程信息，如出发地/目的地/时间</li>
              </ul>

              <p className="font-semibold text-gray-900">2. 我们如何使用</p>
              <p>用于拼车信息撮合、联系方式展示、以及必要时联系你处理风险行为。</p>

              <p className="font-semibold text-gray-900">3. 我们不会做的事</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>不会售卖你的个人信息</li>
                <li>不会无授权公开你的手机号给所有人</li>
              </ul>

              <p className="font-semibold text-gray-900">4. 你的权利</p>
              <p>你可以在“我的资料”页面修改信息，也可以随时退出登录。</p>

              <p className="font-semibold text-gray-900">5. 安全提醒</p>
              <p>不要把验证码转发给他人。如果你未满18岁，请征得监护人同意并告知行程。</p>

              <p className="text-xs text-gray-400">
                若你对信息使用有疑问，请停止使用本服务并联系管理员。
              </p>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow active:opacity-90"
              >
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
