// src/pages/RideDetailPage.tsx

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRide } from '@/api/rides'
import type { CarPool } from '@/types'
import dayjs from 'dayjs'
import { MapPin, ArrowRight, Calendar, Frown } from 'lucide-react'

export default function RideDetailPage() {
  const { id } = useParams()
  const [ride, setRide] = useState<CarPool | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        if (id) {
          const rideData = await getRide(Number(id))
          setRide(rideData)
        }
      } catch (error) {
        console.error("Failed to fetch ride details:", error)
        setRide(null) // 获取失败时，确保 ride 为 null
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | number }) => (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 flex items-center justify-center bg-emerald-50 rounded-full">
        <Icon className="w-5 h-5 text-emerald-600" />
      </div>
      <div className="flex-1 border-b pb-3">
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-base text-gray-800 font-medium mt-1">{value}</div>
      </div>
    </div>
  )

  // 将后端的 state 数字映射为文案，可根据实际业务修改
  const StatusBadge = ({ state }: { state: number }) => {
    const clsMap: { [key: number]: string } = {
      0: 'bg-emerald-100 text-emerald-700',
      1: 'bg-orange-100 text-orange-700',
      2: 'bg-gray-100 text-gray-600',
      3: 'bg-red-100 text-red-600'
    }
    const textMap: { [key: number]: string } = {
      0: '进行中',
      1: '已完成',
      2: '已过期',
      3: '已删除'
    }
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${clsMap[state] || 'bg-gray-100'}`}>
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
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6">
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

        {/* 详细信息列表 */}
        <div className="space-y-4 pt-4">
          <DetailItem
            icon={Calendar}
            label="出发时间"
            value={dayjs(ride.dateTime).format('YYYY年MM月DD日 HH:mm')}
          />
          {/* 如需扩展更多字段，可在此添加 */}
        </div>
      </div>
    </div>
  )
}