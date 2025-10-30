import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, AlertTriangle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  show: boolean
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }
  return ctx.toast
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ToastState>({
    show: false,
    message: '',
    type: 'info',
  })

  // 暴露给外部调用的函数
  const toast = useCallback((message: string, type: ToastType = 'info') => {
    setState({ show: true, message, type })
  }, [])

  // 自动隐藏
  useEffect(() => {
    if (!state.show) return
    const t = setTimeout(() => {
      setState(s => ({ ...s, show: false }))
    }, 2000) // 2秒后消失
    return () => clearTimeout(t)
  }, [state.show])

  // 颜色风格根据 type 变
  const styleMap: Record<ToastType, { bg: string; text: string; icon: JSX.Element }> = {
    success: {
      bg: 'bg-emerald-600/90',
      text: 'text-white',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
    error: {
      bg: 'bg-red-600/90',
      text: 'text-white',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: 'bg-gray-800/90',
      text: 'text-white',
      icon: <CheckCircle className="w-5 h-5 text-white" />,
    },
  }

  const style = styleMap[state.type]

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast 本体 */}
      {/* fixed + bottom-20: 悬浮在屏幕内，不是浏览器顶部 */}
      <div
        className={`fixed left-0 right-0 bottom-24 z-[9999] flex justify-center pointer-events-none transition-all duration-300
          ${state.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <div
          className={`max-w-[80%] sm:max-w-sm ${style.bg} ${style.text} rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 text-sm font-medium leading-snug`}
        >
          <div className="shrink-0 mt-0.5">{style.icon}</div>
          <div className="whitespace-pre-line break-words">{state.message}</div>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
