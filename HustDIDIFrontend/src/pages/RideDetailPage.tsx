
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRide } from '@/api/rides'
import type { Ride } from '@/types'
import dayjs from 'dayjs'

export default function RideDetailPage() {
  const { id } = useParams()
  const [ride, setRide] = useState<Ride | null>(null)

  useEffect(() => {
    (async () => setRide(await getRide(Number(id))))()
  }, [id])

  if (!ride) return <div className="text-gray-500">加载中...</div>

  return (
    <div className="bg-white border rounded-2xl p-6">
      <h1 className="text-xl font-bold">{ride.origin} → {ride.destination}</h1>
      <div className="mt-2 text-gray-600">出发时间：{dayjs(ride.departureTime).format('YYYY-MM-DD HH:mm')}</div>
      <div className="mt-2">座位：{ride.seats}</div>
      {ride.note && <div className="mt-2">备注：{ride.note}</div>}
      <div className="mt-4 text-sm text-gray-500">状态：{ride.status}</div>
    </div>
  )
}
