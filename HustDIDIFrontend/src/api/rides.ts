
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
  // After interceptor: response is already unwrapped to `data`
  const data = await client.get('/carpool/list', { params: q })
  const { total, items } = normalizePageData<Ride>(data)
  return { total, items }
}

export async function getRide(id: number) {
  const data = await client.get(`/carpool/${id}`)
  return data as Ride
}

export async function createRide(payload: Partial<Ride>) {
  const data = await client.post('/carpool', payload)
  return data as Ride
}

export async function updateRideStatus(id: number, status: RideStatus) {
  const data = await client.put(`/carpool/${id}/status`, { status })
  return data as Ride
}
