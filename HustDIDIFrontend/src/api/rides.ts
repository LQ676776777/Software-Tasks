// src/api/rides.ts

import client from './client'
import type { Ride, RideStatus } from '@/types'
import { normalizePageData } from './result'

export interface RideQuery {
  origin?: string
  destination?: string
  date?: string // yyyy-MM-dd
  page?: number
  size?: number
  keyword?: string
}

export async function listRides(q: RideQuery) {
  // 对于 listRides，你的 normalizePageData 已经处理得很好，通常不需要改动。
  // 但为了风格统一，也可以加上类型提示。
  const data = await client.get('/carpool/list', { params: q })
  const { total, items } = normalizePageData<Ride>(data)
  return { total, items }
}

export async function getRide(id: number) {
  const data = await client.get<Ride>(`/carpool/${id}`)
  return data // 现在 data 的类型就是 Ride，不再需要 as Ride
}

export async function createRide(payload: Partial<Ride>) {
  // 修改点: 告诉 client.post 我们期望返回的 data 是 Ride 类型
  const data = await client.post<Ride>('/carpool', payload)
  return data // 类型正确，无需转换
}

export async function updateRideStatus(id: number, status: RideStatus) {
  // 修改点: 告诉 client.put 我们期望返回的 data 是 Ride 类型
  const data = await client.put<Ride>(`/carpool/${id}/status`, { status })
  return data // 类型正确，无需转换
}