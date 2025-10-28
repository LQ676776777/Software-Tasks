// src/pages/RideListPage.tsx

import { useEffect, useState } from 'react'
import { listRides } from '@/api/rides'
import type { CarPool } from '@/types'
import RideCard from '@/components/RideCard'
import PageHeader from '@/components/PageHeader'
import { Car, Frown } from 'lucide-react' // 引入图标

export default function RideListPage() {
  const [items, setItems] = useState<CarPool[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true) // 新增 loading 状态

  const totalPages = Math.ceil(total / 5) || 1

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        // 调用新的分页查询接口，current 表示页码
        const { items, total } = await listRides({ current: page })
        setItems(items)
        setTotal(total)
      } catch (error) {
        console.error("Failed to fetch rides:", error)
        setItems([]) // 出错时清空列表
      } finally {
        setLoading(false)
      }
    })()
  }, [page])

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
      {/* 2. 使用 PageHeader 组件替换原来的标题 */}
      <PageHeader
        icon={Car}
        title="最新拼车"
        subtitle="看看有没有同路的小伙伴"
      />

      {/* 列表内容 */}
      <div className="space-y-4">
        {loading && <div className="text-center text-gray-500 py-8">正在加载中...</div>}
        {!loading && items.length === 0 && (
          <div className="text-center text-gray-400 py-12 flex flex-col items-center gap-4">
            <Frown className="w-16 h-16 text-gray-300" />
            <span>暂时还没有拼车单哦</span>
          </div>
        )}
        {items.map(r => <RideCard key={r.id} ride={r} />)}
      </div>

      {total > 0 && renderPagination()}
    </div>
  )
}