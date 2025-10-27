
import { Link } from 'react-router-dom'
import type { CarPool } from '@/types'
import dayjs from 'dayjs'

/**
 * 显示单个拼车卡片。
 *
 * 使用后端的 CarPool 数据模型：显示出发地、目的地和出发时间等核心信息。
 */
export default function RideCard({ ride }: { ride: CarPool }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="font-semibold">
          {ride.startPlace} → {ride.destination}
        </div>
        {/* 状态字段为整型，可根据业务需要映射文字，这里直接输出 */}
        <span className="text-xs px-2 py-1 rounded bg-gray-100">{ride.state}</span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        出发：{dayjs(ride.dateTime).format('YYYY-MM-DD HH:mm')}
      </div>
      <div className="mt-3 text-right">
        {/* 详情页路由调整为 /carpool/:id */}
        <Link to={`/carpool/${ride.id}`} className="text-blue-600 text-sm">
          查看详情
        </Link>
      </div>
    </div>
  )
}
