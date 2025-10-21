// src/pages/RideDetailPage.tsx

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRide } from '@/api/rides'
import type { Ride } from '@/types'
import dayjs from 'dayjs'
import { MapPin, ArrowRight, Calendar, Armchair, FileText, User, Phone, Frown } from 'lucide-react'

export default function RideDetailPage() {
  const { id } = useParams()
  const [ride, setRide] = useState<Ride | null>(null)
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

  const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
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

  const StatusBadge = ({ status }: { status: string }) => {
    const statusMap: { [key: string]: string } = {
      'AVAILABLE': 'bg-emerald-100 text-emerald-700',
      'FULL': 'bg-orange-100 text-orange-700',
      'COMPLETED': 'bg-gray-100 text-gray-600',
      'CANCELLED': 'bg-red-100 text-red-600',
    }
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusMap[status] || 'bg-gray-100'}`}>{status}</span>
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  )

  if (!ride) return (
    <div className="text-center text-gray-400 py-20 flex flex-col items-center gap-4">
      <Frown className="w-20 h-20 text-gray-300" />
      <span className="text-lg">哦噢，这个拼车单不存在或已被删除</span>
      <Link to="/" className="mt-4 px-6 py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-emerald-500 to-teal-500">返回首页</Link>
    </div>
  )



  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-8 pb-32">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* 头部信息 - 采用 PageHeader 的内部样式 */}
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center flex-wrap gap-2">
                <span>{ride.origin}</span>
                <ArrowRight className="w-6 h-6 text-gray-300 shrink-0" />
                <span>{ride.destination}</span>
              </h1>
              <p className="text-sm text-gray-400 mt-1">拼车行程详情</p>
            </div>
          </div>
          <div className="shrink-0 pt-1">
            <StatusBadge status={ride.status} />
          </div>
        </header>

        {/* 详细信息列表 */}
        <div className="space-y-4 pt-4">
          <DetailItem icon={Calendar} label="出发时间" value={dayjs(ride.departureTime).format('YYYY年MM月DD日 HH:mm')} />
          <DetailItem icon={Armchair} label="剩余座位" value={`${ride.seats} 个`} />
          {ride.note && <DetailItem icon={FileText} label="备注信息" value={ride.note} />}
        </div>
        
        {/* 车主信息 */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
           {/* 假设 ride.user 存在，实际需要后端返回 */}
           <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
             <User className="w-7 h-7 text-emerald-600"/>
           </div>
           <div>
             <div className="font-semibold text-gray-800">{ride.publisher?.nickname || '匿名车主'}</div>
             <div className="text-sm text-gray-500">{ride.publisher?.faculty || '信息未填写'}</div>
           </div>
        </div>
      </div>

      {/* 底部固定操作栏 */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center p-4 bg-white/80 backdrop-blur-sm border-t">
        <button className="w-full max-w-sm h-12 rounded-2xl text-white text-lg font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg hover:shadow-xl active:opacity-95 disabled:opacity-70">
          <Phone size={20} />
          联系车主
        </button>
      </div>
    </div>
  )
}