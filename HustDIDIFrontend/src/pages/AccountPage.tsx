// src/pages/AccountPage.tsx

import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'
import { listMyRides } from '@/api/rides' 
import type { CarPool } from '@/types'
import RideCard from '@/components/RideCard'
import { UserCircle, LogOut, Clock, Frown, Car } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'

export default function AccountPage() {
  const nav = useNavigate()
  const { profile, fetchProfile, logout } = useAuth()

  // 我的行程单分页数据
  const [items, setItems] = useState<CarPool[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingList, setLoadingList] = useState(true)

  const totalPages = Math.ceil(total / 5) || 1

  // 拉个人信息（如果还没加载过）
useEffect(() => {
  // ✅ 一进页面就尝试刷新个人信息
  (async () => {
    try {
      await fetchProfile()
    } catch (err) {
      console.error('fetchProfile 出错', err)
    }
  })()
}, [fetchProfile])


  // 拉“我发布的拼车单”
useEffect(() => {
  // ✅ 一进页面就查“我发布的拼车”
  (async () => {
    setLoadingList(true)
    try {
      const { items, total } = await listMyRides({ current: page })
      setItems(items)
      setTotal(total)
    } catch (err) {
      console.error('listMyRides 出错', err)
      setItems([])
    } finally {
      setLoadingList(false)
    }
  })()
}, [page])

  const handleLogout = () => {
    logout()
    nav('/login', { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-32">
      {/* 顶部个人信息卡片 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <UserCircle className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">我的资料</h1>
              <p className="text-sm text-gray-400 mt-1">这些信息会展示给与你拼车的人</p>
            </div>
          </div>

          <Link
            to="/profile"
            className="text-sm font-semibold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl px-3 py-2 ring-1 ring-emerald-200"
          >
            编辑资料
          </Link>
        </div>

        {/* 信息区 */}
        <div className="grid grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
          <div>
            <div className="text-gray-400 text-xs mb-1">昵称</div>
            <div className="font-semibold text-gray-900">
              {profile?.userName || '未填写'}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs mb-1">手机号</div>
            <div className="font-semibold text-gray-900">
              {profile?.phoneNumber || '—'}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs mb-1">性别</div>
            <div className="font-semibold text-gray-900">
              {profile?.gender || '未填写'}
            </div>
          </div>

          <div>
            <div className="text-gray-400 text-xs mb-1">学院</div>
            <div className="font-semibold text-gray-900">
              {profile?.schoolName || '未填写'}
            </div>
          </div>
        </div>

        {/* 退出登录按钮 */}
        <div className="pt-6">
          <button
            onClick={handleLogout}
            className="w-full h-12 sm:h-14 rounded-2xl text-red-500 text-base sm:text-lg font-semibold flex items-center justify-center gap-2 bg-white ring-1 ring-red-300 hover:ring-red-400 active:ring-2 transition"
          >
            <LogOut size={20} />
            退出登录
          </button>
        </div>
      </div>

      {/* 我发布过的行程单 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Car className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">我发布的拼车</div>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>只显示你发过的单</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loadingList && (
          <div className="text-center text-gray-500 py-8">正在加载中...</div>
        )}

        {!loadingList && items.length === 0 && (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-4">
            <Frown className="w-16 h-16 text-gray-300" />
            <span>你还没有发布过行程单</span>
            <Link
              to="/publish"
              className="text-sm font-semibold text-emerald-600 hover:underline"
            >
              现在去发布
            </Link>
          </div>
        )}

        {items.map(r => (
          <RideCard key={r.id} ride={r} />
        ))}
      </div>

      {/* 分页器（固定在底部导航上方） */}
      {total > 0 && (
        <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center gap-2 bg-white/80 backdrop-blur-sm border-t py-3 px-4">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600 font-medium">
            第 {page} 页 / 共 {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
