
import client from './client'

export async function sendCode(phone: string) {
  const data = await client.post('/auth/sendCode', { phone })
  return data as { ok?: boolean }
}

export async function loginWithCode(phone: string, code: string) {
  const data = await client.post('/auth/login', { phone, code })
  // `data` can be { token } or a string token — keep both compatible
  const token = (data && typeof data === 'object') ? data.token : data
  return { token } as { token: string }
}

export async function getProfile() {
  const data = await client.get('/user/me')
  return data
}

export async function updateProfile(payload: any) {
  const data = await client.put('/user/me', payload)
  return data
}
