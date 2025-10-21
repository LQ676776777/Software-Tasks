
import { Link } from 'react-router-dom'
import type { Ride } from '@/types'
import dayjs from 'dayjs'

export default function RideCard({ ride }: { ride: Ride }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{ride.origin} → {ride.destination}</div>
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{ride.status}</span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        出发：{dayjs(ride.departureTime).format('YYYY-MM-DD HH:mm')} · 座位：{ride.seats}
      </div>
      {ride.note && <div className="mt-2 text-sm">{ride.note}</div>}
      <div className="mt-3 text-right">
        <Link to={`/rides/${ride.id}`} className="text-blue-600 text-sm">查看详情</Link>
      </div>
    </div>
  )
}
