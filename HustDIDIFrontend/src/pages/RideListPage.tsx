
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
      <h1 className="text-xl font-bold">最新拼车</h1>
      {items.map(r => <RideCard key={r.id} ride={r} />)}
      <div className="flex justify-center gap-2 pt-4">
        <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>Math.max(1,p-1))}>上一页</button>
        <span className="text-sm self-center">第 {page} 页 / 共 {Math.ceil(total/10)||1} 页</span>
        <button className="px-3 py-1 border rounded" onClick={()=>setPage(p=>p+1)} disabled={page*10>=total}>下一页</button>
      </div>
    </div>
  )
}
