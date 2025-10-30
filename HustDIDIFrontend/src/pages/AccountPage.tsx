// src/pages/AccountPage.tsx

import { useEffect, useState } from 'react'
import useAuth from '@/store/auth'
import { listMyRides, updateRide } from '@/api/rides'
import type { CarPool } from '@/types'
import { UserCircle, LogOut, Clock, Frown, Car, MapPin, ArrowRight, Calendar, CheckCircle2, Trash2 } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { useToast } from '@/components/Toast'

export default function AccountPage() {
  const nav = useNavigate()
  const { profile, fetchProfile, logout } = useAuth()

  // 我的行程单分页数据
  const [items, setItems] = useState<CarPool[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loadingList, setLoadingList] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null) // 正在修改哪一条

  const totalPages = Math.ceil(total / 5) || 1

  // 进页面拉个人信息
  useEffect(() => {
    (async () => {
      try {
        await fetchProfile()
      } catch (err) {
        console.error('fetchProfile 出错', err)
      }
    })()
  }, [fetchProfile])

  // 拉“我发布的拼车单”
  const loadMyRides = async (targetPage = page) => {
    setLoadingList(true)
    try {
      const { items, total } = await listMyRides({ current: targetPage })
      setItems(items)
      setTotal(total)
    } catch (err) {
      console.error('listMyRides 出错', err)
      setItems([])
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    loadMyRides(page)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleLogout = () => {
    logout()
    nav('/login', { replace: true })
  }

  // --- 工具: 显示状态badge ---
  const renderStateBadge = (state: number) => {
    const textMap: Record<number, string> = {
      0: '进行中',
      1: '已完成',
      2: '已过期',
      3: '已删除',
    }
    const colorMap: Record<number, string> = {
      0: 'bg-emerald-100 text-emerald-700',
      1: 'bg-blue-100 text-blue-700',
      2: 'bg-gray-100 text-gray-600',
      3: 'bg-red-100 text-red-600',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[state] || 'bg-gray-100 text-gray-600'}`}
      >
        {textMap[state] ?? state}
      </span>
    )
  }

  // --- 操作按钮: 标记为完成 ---
  const markDone = async (rideId: number) => {
    const toast = useToast()
    if (!window.confirm('确认把这个行程标记为“已完成”吗？')) return
    try {
      setUpdatingId(rideId)
      await updateRide({ id: rideId, state: 1 })
      // 更新本地列表，避免整页白闪
      setItems(prev =>
        prev.map(r => (r.id === rideId ? { ...r, state: 1 } : r))
      )
    } catch (err: any) {
      toast(err?.message || '操作失败','error')
    } finally {
      setUpdatingId(null)
    }
  }

  // --- 操作按钮: 删除 ---
  const markDelete = async (rideId: number) => {
    const toast = useToast()
    if (!window.confirm('确认删除这个行程吗？删除后乘客将无法看到它。')) return
    try {
      setUpdatingId(rideId)
      await updateRide({ id: rideId, state: 3 })
      // ✅ 删除成功后，从前端列表移除这条记录
      setItems(prev => prev.filter(r => r.id !== rideId))
    } catch (err: any) {
      toast(err?.message || '操作失败','error')
    } finally {
      setUpdatingId(null)
    }
  }


  // --- 渲染我自己的拼车卡片（替代原来的 <RideCard />） ---
  const MyRideCard = ({ ride }: { ride: CarPool }) => {
    return (
      <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
        {/* 头部：起点 -> 终点 + 状态 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 flex flex-wrap items-center gap-1 text-base leading-tight">
                  <span>{ride.startPlace}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{ride.destination}</span>
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{dayjs(ride.dateTime).format('MM月DD日 HH:mm')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            {renderStateBadge(ride.state as number)}
          </div>
        </div>

        {/* 操作按钮区 */}
        <div className="mt-4 flex flex-wrap gap-2">
          {/* 完成按钮：state=1 */}
          <button
            disabled={updatingId === ride.id || ride.state === 1 || ride.state === 3}
            onClick={() => markDone(ride.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ring-1 
              ${
                ride.state === 1 || ride.state === 3
                  ? 'text-gray-400 ring-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'text-emerald-600 ring-emerald-400 bg-white hover:ring-emerald-500 active:ring-2'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{updatingId === ride.id ? '处理中…' : '完成'}</span>
          </button>

          {/* 删除按钮：state=3 */}
          <button
            disabled={updatingId === ride.id || ride.state === 3}
            onClick={() => markDelete(ride.id)}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ring-1
              ${
                ride.state === 3
                  ? 'text-gray-400 ring-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'text-red-600 ring-red-300 bg-white hover:ring-red-400 active:ring-2'
              }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>{updatingId === ride.id ? '处理中…' : '删除'}</span>
          </button>

          {/* 去详情链接 */}
          <Link
            to={`/carpool/${ride.id}`}
            className="ml-auto flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ring-1
                       text-gray-600 ring-gray-300 bg-white hover:ring-gray-400 active:ring-2"
          >
            详情
          </Link>
        </div>
      </div>
    )
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
            <div className="font-semibold text-gray-900 break-all">
              {profile?.phoneNumber || profile?.phone || '—'}
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
            <div className="font-semibold text-gray-900 break-all">
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

        {/* 列表渲染，用我们自定义的 MyRideCard */}
        {items.map(r => (
          <MyRideCard key={r.id} ride={r} />
        ))}
      </div>

      {/* 分页器（固定在底部导航上方） */}
      {total > 0 && (
        <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center gap-2 bg-white/80 backdrop-blur-sm border-t py-3 px-4">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page <= 1 || loadingList}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <span className="text-sm text-gray-600 font-medium">
            第 {page} 页 / 共 {totalPages} 页
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= totalPages || loadingList}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}
