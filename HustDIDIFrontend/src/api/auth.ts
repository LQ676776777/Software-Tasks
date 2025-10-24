import axios from 'axios'
import client from './client'

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


export async function getProfile() {
  const data = await client.get('/user/me')
  return data
}

export async function updateProfile(payload: any) {
  const data = await client.put('/user/me', payload)
  return data
}
