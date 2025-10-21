
import { useEffect, useState } from 'react'
import { listRides } from '@/api/rides'
import type { Ride } from '@/types'
import RideCard from '@/components/RideCard'

export default function RideListPage() {
  const [items, setItems] = useState<Ride[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    (async () => {
      const { items, total } = await listRides({ page, size: 10 })
      setItems(items); setTotal(total)
    })()
  }, [page])

  return (
    <div className="space-y-4">
      {/* 页面内容 */}
      <div className="space-y-4 pb-28">   {/* 注意这里增加 pb-28 预留底部空间 */}
        <h1 className="text-xl font-bold">最新拼车</h1>
        {items.length === 0 && <div className="text-center text-gray-500 py-8">暂无拼车单</div>}
        {items.map(r => <RideCard key={r.id} ride={r} />)}
      </div>

      {/* 固定分页按钮 */}
      <div className="fixed bottom-16 left-0 right-0 flex justify-center gap-2 bg-gray-50 border-t py-3">
        <button
          className="px-4 py-2 rounded-lg border bg-white active:scale-95 transition"
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          上一页
        </button>
        <span className="text-sm self-center">
          第 {page} 页 / 共 {Math.ceil(total / 10) || 1} 页
        </span>
        <button
          className="px-4 py-2 rounded-lg border bg-white active:scale-95 transition"
          onClick={() => setPage(p => p + 1)}
          disabled={page * 10 >= total}
        >
          下一页
        </button>
      </div>

    </div>
  )
}
