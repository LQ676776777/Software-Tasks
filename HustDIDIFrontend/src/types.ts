
export type RideStatus = 'ONGOING' | 'EXPIRED' | 'FINISHED' | 'DELETED'

export interface Ride {
  id: number
  origin: string
  destination: string
  departureTime: string // ISO
  seats: number
  price?: number
  note?: string
  status: RideStatus
  publisherId: number
  createdAt?: string
  publisher: User
}

export interface User {
  id: number
  phone: string
  nickname?: string
  avatar?: string
  faculty?: string
}
