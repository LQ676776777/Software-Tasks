// src/components/BottomNav.tsx
import { NavLink } from "react-router-dom"
import { Home, Search, PlusCircle, User } from "lucide-react"

// 小工具：简易 class 拼接
function cx(...arr: Array<string | false | undefined>) {
  return arr.filter(Boolean).join(" ")
}

/**
 * 说明：
 * - 使用 NavLink 的 className 回调来获取 isActive，自动高亮当前路由
 * - 使用 fixed + safe-area 适配 iOS 底部手势区
 * - 触控尺寸：高度 h-16 (>=48px)，符合移动端可触达面积
 */
export default function BottomNav() {
  const baseItem =
    "flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs"

  const activeCls = "text-blue-600"
  const inactiveCls = "text-gray-500"

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-10 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="mx-auto max-w-md h-16 flex">
        <NavLink
          to="/"
          end
          className={({ isActive }) => cx(baseItem, isActive ? activeCls : inactiveCls)}
        >
          <Home size={20} />
          <span>首页</span>
        </NavLink>

        <NavLink
          to="/search"
          className={({ isActive }) => cx(baseItem, isActive ? activeCls : inactiveCls)}
        >
          <Search size={20} />
          <span>搜索</span>
        </NavLink>

        <NavLink
          to="/publish"
          className={({ isActive }) => cx(baseItem, isActive ? activeCls : inactiveCls)}
        >
          <PlusCircle size={20} />
          <span>发布</span>
        </NavLink>

        <NavLink
          to="/account"
          className={({ isActive }) => cx(baseItem, isActive ? activeCls : inactiveCls)}
        >
          <User size={20} />
          <span>我的</span>
        </NavLink>
      </nav>

      {/* iOS 安全区适配：给底部增加安全区填充 */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </footer>
  )
}
