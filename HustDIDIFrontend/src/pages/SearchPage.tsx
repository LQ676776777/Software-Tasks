
import { useEffect, useMemo, useState } from 'react'
import { listRides } from '@/api/rides'
import RideCard from '@/components/RideCard'
import type { Ride } from '@/types'

export default function SearchPage() {
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [items, setItems] = useState<Ride[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const q = useMemo(() => ({ origin, destination, date, keyword, page, size: 10 }), [origin,destination,date,keyword,page])

  useEffect(() => {
    (async () => {
      const { items, total } = await listRides(q)
      setItems(items); setTotal(total)
    })()
  }, [q])

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">搜索拼车</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        <input className="border rounded p-2" placeholder="出发地" value={origin} onChange={e=>setOrigin(e.target.value)} />
        <input className="border rounded p-2" placeholder="目的地" value={destination} onChange={e=>setDestination(e.target.value)} />
        <input className="border rounded p-2" type="date" value={date} onChange={e=>setDate(e.target.value)} />
        <input className="border rounded p-2" placeholder="关键词" value={keyword} onChange={e=>setKeyword(e.target.value)} />
      </div>
      <div className="text-sm text-gray-600">已为你找到 {total} 条结果</div>
      <div className="space-y-3">
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
