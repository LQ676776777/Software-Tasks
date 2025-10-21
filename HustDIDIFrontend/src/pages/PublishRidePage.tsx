
import { useState } from 'react'
import { createRide } from '@/api/rides'

export default function PublishRidePage() {
  const [form, setForm] = useState({ origin:'', destination:'', departureTime:'', seats:1, note:'' })

  const submit = async () => {
    try {
      await createRide(form as any)
      alert('发布成功')
      setForm({ origin:'', destination:'', departureTime:'', seats:1, note:'' })
    } catch (e:any) { alert(e.message) }
  }

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-2xl p-6 space-y-3">
      <h1 className="text-xl font-bold">发布拼车单</h1>
      <input className="w-full border rounded p-2" placeholder="出发地" value={form.origin} onChange={e=>setForm({...form, origin:e.target.value})}/>
      <input className="w-full border rounded p-2" placeholder="目的地" value={form.destination} onChange={e=>setForm({...form, destination:e.target.value})}/>
      <input className="w-full border rounded p-2" type="datetime-local" value={form.departureTime} onChange={e=>setForm({...form, departureTime:e.target.value})}/>
      <input className="w-full border rounded p-2" type="number" min={1} placeholder="座位数" value={form.seats} onChange={e=>setForm({...form, seats:Number(e.target.value)})}/>
      <textarea className="w-full border rounded p-2" placeholder="备注" value={form.note} onChange={e=>setForm({...form, note:e.target.value})}/>
      <button className="w-full bg-blue-600 text-white rounded py-2" onClick={submit}>发布</button>
    </div>
  )
}
