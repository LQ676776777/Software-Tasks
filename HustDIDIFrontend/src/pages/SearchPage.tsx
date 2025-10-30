import { useEffect, useState } from 'react'
import { searchRides } from '@/api/rides'
import type { CarPool } from '@/types'
import { MapPin, ArrowRight, Calendar, Frown, Search as SearchIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

const PAGE_SIZE = 5

export default function SearchPage() {
  // 查询条件
  const [startLocation, setStartLocation] = useState('')
  const [endLocation, setEndLocation] = useState('')

  // 列表 & 分页
  const [items, setItems] = useState<CarPool[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const totalPages = Math.ceil(total / PAGE_SIZE) || 1

  // 查询
  useEffect(() => {
    const empty = !startLocation.trim() && !endLocation.trim()
    if (empty) {
      setItems([])
      setTotal(0)
      return
    }

    ;(async () => {
      setLoading(true)
      try {
        const { items, total } = await searchRides({
          startLocation,
          endLocation,
          current: page,
          size: PAGE_SIZE,
        })
        setItems(items)
        setTotal(total)
      } catch (err) {
        console.error('Search failed:', err)
        setItems([])
        setTotal(0)
      } finally {
        setLoading(false)
      }
    })()
  }, [startLocation, endLocation, page])

  // 与列表页一致的状态徽章
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
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[state] || 'bg-gray-100 text-gray-600'}`}>
        {textMap[state] ?? state}
      </span>
    )
  }

  // 与列表页一致的卡片
  const RideCard = ({ ride }: { ride: CarPool }) => (
    <div className="bg-white rounded-2xl shadow p-4 border border-gray-100">
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
        <div className="shrink-0">{renderStateBadge(ride.state as number)}</div>
      </div>

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

  // 与列表页一致的分页条（底部固定）
  const renderPagination = () => (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center items-center gap-2 bg-white/80 backdrop-blur-sm border-t py-3 px-4">
      <button
        onClick={() => setPage(p => p - 1)}
        disabled={page <= 1 || loading}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        上一页
      </button>
      <span className="text-sm text-gray-600 font-medium">
        第 {page} 页 / 共 {totalPages} 页
      </span>
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={page >= totalPages || loading}
        className="px-4 py-2 rounded-xl text-sm font-semibold transition bg-white text-emerald-600 ring-1 ring-emerald-400 hover:ring-emerald-500 active:ring-2 disabled:ring-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      >
        下一页
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-32">
      {/* 搜索面板（保留你原来的样式） */}
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <SearchIcon className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">精确查找</h1>
            <p className="text-sm text-gray-400 mt-1">输入条件，快速找到你的行程（支持模糊搜索）</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="group">
            <label className="block text-sm text-gray-400 mb-1 group-focus-within:text-emerald-600 transition-colors">出发地</label>
            <div className="border-b border-gray-200 focus-within:border-emerald-500 transition-all">
              <input
                className="w-full bg-transparent outline-none text-base text-gray-900 caret-emerald-500 py-2 placeholder:text-gray-400"
                placeholder="例如：东区食堂"
                value={startLocation}
                onChange={(e) => { setStartLocation(e.target.value); setPage(1) }}
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm text-gray-400 mb-1 group-focus-within:text-emerald-600 transition-colors">目的地</label>
            <div className="border-b border-gray-200 focus-within:border-emerald-500 transition-all">
              <input
                className="w-full bg-transparent outline-none text-base text-gray-900 caret-emerald-500 py-2 placeholder:text-gray-400"
                placeholder="例如：光谷广场"
                value={endLocation}
                onChange={(e) => { setEndLocation(e.target.value); setPage(1) }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 列表区域（样式与列表页一致） */}
      <div className="space-y-4">
        {loading && <div className="text-center text-gray-500 py-8">正在加载中...</div>}

        {!loading && items.length === 0 && (startLocation || endLocation) && (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-4">
            <Frown className="w-16 h-16 text-gray-300" />
            <span>没有找到符合条件的拼车单</span>
          </div>
        )}

        {items.map(r => <RideCard key={r.id} ride={r} />)}
      </div>

      {total > 0 && renderPagination()}
    </div>
  )
}
