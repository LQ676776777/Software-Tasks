import axios from 'axios'
import client from './client'
import type { User } from '@/types'


// export async function sendCode(phone: string) {
//   // 方式 A：查询参数（推荐）
//   // return client.post('/code', null, { params: { phone } })
//   // 方式 B：表单
//   const form = new URLSearchParams({ phone })
//   return client.post('/code', form, { headers: { 'Content-Type':'application/x-www-form-urlencoded' }})
// }

export async function sendCode(phone: string) {
  const form = new URLSearchParams({ phone })
  return axios.post('/api/code', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
}


export async function loginWithCode(phone: string, code: string) {
  // 直接发 JSON 就行
  const res = await client.post('/login', { phone, code })

  // 如果后端返回用户对象 / 成功标志，可以在这里统一处理
  // 例如 res.data = { code: 200, data: { id: 1, phone: '...' } }
  return res.data
}


// 根据当前后端约定，没有单独的 `/user/me` 接口。
// 如果需要获取当前登录用户信息，可以考虑在登录成功后从返回的 cookie/session 中获取，或在持久层中存储。
// 因此这里的 getProfile 返回 undefined。
export async function getProfile() {
  const res = await client.get('/user')

  // 如果后端返回用户对象 / 成功标志，可以在这里统一处理
  // 例如 res.data = { code: 200, data: { id: 1, phone: '...' } }
  return res.data
}

/**
 * 更新用户信息。后端通过 PUT /user 接收 User 对象进行更新。
 */
export async function updateProfile(payload: {
  userName?: string
  schoolName?: string
  gender?: string
}) {
  // 假设后端是 PUT /user
  const res = await client.put('/user', payload) as any
  return res.data
}


// 根据用户ID获取用户信息
export async function getUserById(userId: number) {
  const res = await client.get(`/user/${userId}`) as any
  // 假设后端返回的是 { success: true, data: { ...User } }
  return res.data
}




