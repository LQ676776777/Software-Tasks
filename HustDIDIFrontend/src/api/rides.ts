// src/api/rides.ts

import client from './client'
import type { CarPool } from '@/types'
import { normalizePageData } from './result'

/**
 * 分页查询所有拼车信息。
 * @param q current 表示页码（从 1 开始）
 */
export async function listRides(q: { current?: number } = {}) {
  const current = q.current ?? 1
  // 调用后端分页接口：/carpool/page?current=1
  const res = await client.get('/carpool/page', { params: { current } }) as any
  // 返回的对象形如 { success, data: CarPool[], total }
  const { total, items } = normalizePageData<CarPool>(res)
  return { total, items }
}

/**
 * 根据起止地点查询拼车信息（模糊匹配）。
 * 后端接口为 /carpool/matching?startLocation=xxx&endLocation=yyy&current=1
 */
export async function searchRides(q: { startLocation: string; endLocation: string; current?: number; size?: number}) {
  const { startLocation, endLocation } = q
  const current = q.current ?? 1
  const res = await client.get('/carpool/matching', { params: { startLocation, endLocation, current } }) as any
  // matching 接口返回的 payload 可能不带 total，normalizePageData 会自动计算 total
  const { total, items } = normalizePageData<CarPool>(res)
  return { total, items }
}

/**
 * 根据 ID 获取拼车详情。
 */
export async function getRide(id: number) {
  const res = await client.get(`/carpool/${id}`) as any
  // 响应 payload 为 { success, data: CarPool }
  return res.data as CarPool
}

/**
 * 发布新的拼车信息。
 * payload 只需包含 startPlace、destination、dateTime 等字段，userId 由后端从 session 中获取。
 */
export async function createRide(payload: Partial<CarPool>) {
  const res = await client.post('/carpool', payload) as any
  return res.data
}

/**
 * 更新拼车信息（包括状态）。
 */
export async function updateRide(payload: Partial<CarPool>) {
  const res = await client.put('/carpool', payload) as any
  return res.data
}

/* 拉取“我自己发过的拼车单”（个人中心页展示）。*/
export async function listMyRides(q: { current?: number } = {}) {
  const current = q.current ?? 1

  const res = await client.get('/carpool/mine', {
    params: { current }
  }) as any

  const { total, items } = normalizePageData<CarPool>(res)
  return { total, items }
}