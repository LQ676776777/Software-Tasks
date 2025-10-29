// src/pages/RideListPage.tsx

import { useEffect, useState } from 'react'
import { listRides } from '@/api/rides'
import type { CarPool } from '@/types'
import PageHeader from '@/components/PageHeader'
import { Car, MapPin, ArrowRight, Calendar, Frown } from 'lucide-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export default function RideListPage() {
  const [items, setItems] = useState<CarPool[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const totalPages = Math.ceil(total / 5) || 1

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { items, total } = await listRides({ current: page })
        setItems(items)
        setTotal(total)
      } catch (error) {
        console.error("Failed to fetch rides:", error)
        setItems([])
      } finally {
        setLoading(false)
      }
    })()
  }, [page])

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

  const RideCard = ({ ride }: { ride: CarPool }) => (
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
      <div className="mt-4 flex items-center justify-between">
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

  const renderPagination = () => (
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
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-32">
      <PageHeader
        icon={Car}
        title="最新拼车"
        subtitle="看看有没有同路的小伙伴"
      />

      <div className="space-y-4">
        {loading && <div className="text-center text-gray-500 py-8">正在加载中...</div>}

        {!loading && items.length === 0 && (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-4">
            <Frown className="w-16 h-16 text-gray-300" />
            <span>暂时还没有拼车单哦</span>
          </div>
        )}

        {items.map(r => (
          <RideCard key={r.id} ride={r} />
        ))}
      </div>

      {total > 0 && renderPagination()}
    </div>
  )
}
