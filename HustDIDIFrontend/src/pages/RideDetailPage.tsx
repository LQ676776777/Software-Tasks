// src/pages/RideDetailPage.tsx

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRide } from '@/api/rides'
import { getUserById } from '@/api/auth' // ⬅ 新增：拉用户详情
import type { CarPool, User } from '@/types'
import dayjs from 'dayjs'
import { MapPin, ArrowRight, Calendar, Frown, UserCircle, Phone, School, BadgeInfo } from 'lucide-react'

export default function RideDetailPage() {
  const { id } = useParams()
  const [ride, setRide] = useState<CarPool | null>(null)
  const [publisher, setPublisher] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingUser, setLoadingUser] = useState(true)

  // 1. 先拿拼车单详情
  useEffect(() => {
    (async () => {
      try {
        if (!id) return
        const rideData = await getRide(Number(id))
        setRide(rideData)
      } catch (error) {
        console.error("Failed to fetch ride details:", error)
        setRide(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  // 2. 再根据拼车单里的 userId 拉用户信息
  useEffect(() => {
    (async () => {
      if (!ride) return
      // 用后端拼车返回的“发布者id”字段
      const publisherId = (ride as any).userId
      if (!publisherId) {
        // 如果拼车单里根本没有提供用户id，那就没法查
        setLoadingUser(false)
        return
      }

      setLoadingUser(true)
      try {
        const userData = await getUserById(publisherId)
        setPublisher(userData)
      } catch (err) {
        console.error('Failed to fetch publisher info:', err)
        setPublisher(null)
      } finally {
        setLoadingUser(false)
      }
    })()
  }, [ride])

  // 小组件：详情行
  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-full">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1 border-b pb-3">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-base text-gray-800 font-medium mt-1 break-all">{value}</div>
      </div>
    </div>
  )

  // 小组件：状态 badge
  const StatusBadge = ({ state }: { state: number }) => {
    const clsMap: Record<number, string> = {
      0: 'bg-emerald-100 text-emerald-700',
      1: 'bg-orange-100 text-orange-700',
      2: 'bg-gray-100 text-gray-600',
      3: 'bg-red-100 text-red-600'
    }
    const textMap: Record<number, string> = {
      0: '进行中',
      1: '已完成',
      2: '已过期',
      3: '已删除'
    }
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${clsMap[state] || 'bg-gray-100 text-gray-600'}`}>
        {textMap[state] ?? state}
      </span>
    )
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )

  if (!ride)
    return (
      <div className="text-center text-gray-400 py-20 flex flex-col items-center gap-4">
        <Frown className="w-20 h-20 text-gray-300" />
        <span className="text-lg">哦噢，这个拼车单不存在或已被删除</span>
        <Link
          to="/"
          className="mt-4 px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-500"
        >
          返回首页
        </Link>
      </div>
    )

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8 pb-32">
      {/* 行程信息卡片 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6 mb-6">
        {/* 头部信息 */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center flex-wrap gap-2">
                <span>{ride.startPlace}</span>
                <ArrowRight className="w-6 h-6 text-gray-300 shrink-0" />
                <span>{ride.destination}</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">拼车行程详情</p>
            </div>
          </div>
          <div className="shrink-0 pt-1">
            <StatusBadge state={ride.state} />
          </div>
        </header>

        {/* 详细信息 */}
        <div className="space-y-4 pt-4">
          <DetailItem
            icon={Calendar}
            label="出发时间"
            value={dayjs(ride.dateTime).format('YYYY年MM月DD日 HH:mm')}
          />
          {/* 你后端还有的字段，比如备注、空位数，也可以继续加 DetailItem */}
        </div>
      </div>

      {/* 发布者信息卡片 */}
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-4">
        <header className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
            <UserCircle className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span>发布者信息</span>
              <BadgeInfo className="w-5 h-5 text-gray-400" />
            </h2>
            <p className="text-sm text-gray-400 mt-1">联系对方确认拼车细节</p>
          </div>
        </header>

        {loadingUser ? (
          <div className="text-sm text-gray-400 py-4">正在加载发布者信息…</div>
        ) : !publisher ? (
          <div className="text-sm text-gray-400 py-4">无法获取发布者信息</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base text-gray-700">
            <div>
              <div className="text-gray-400 text-xs mb-1">昵称</div>
              <div className="font-semibold text-gray-900 break-all">
                {publisher.userName || '未填写'}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-xs mb-1">手机号</div>
              <div className="font-semibold text-gray-900 flex items-center gap-1 break-all">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>{publisher.phoneNumber || '—'}</span>
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-xs mb-1">性别</div>
              <div className="font-semibold text-gray-900">
                {publisher.gender || '未填写'}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-xs mb-1">学院</div>
              <div className="font-semibold text-gray-900 flex items-center gap-1 break-all">
                <School className="w-4 h-4 text-emerald-600" />
                <span>{publisher.schoolName || '未填写'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
