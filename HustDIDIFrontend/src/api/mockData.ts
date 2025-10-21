// src/api/mockData.ts

import type { Ride, User } from '@/types'
import dayjs from 'dayjs'

// 伪造一些用户
export const mockUsers: User[] = [
  { id: 101, phone: '13800138001', nickname: '张三', faculty: '计算机学院' },
  { id: 102, phone: '13800138002', nickname: '李四', faculty: '机械学院' },
  { id: 103, phone: '13800138003', nickname: '王五', faculty: '软件学院' },
]

// 伪造一个拼车单列表
export const mockRides: Ride[] = [
  {
    id: 1,
    origin: '韵苑食堂',
    destination: '光谷广场',
    departureTime: dayjs().add(2, 'hour').toISOString(),
    seats: 2,
    price: 10,
    status: 'ONGOING',
    publisherId: 101,
    publisher: mockUsers[0], // 直接嵌入用户信息，方便前端使用
    createdAt: dayjs().subtract(10, 'minute').toISOString(),
  },
  {
    id: 2,
    origin: '东区操场',
    destination: '武汉火车站',
    departureTime: dayjs().add(4, 'hour').toISOString(),
    seats: 1,
    price: 25,
    note: '仅限女生，无大件行李。',
    status: 'ONGOING',
    publisherId: 102,
    publisher: mockUsers[1],
    createdAt: dayjs().subtract(1, 'hour').toISOString(),
  },
  {
    id: 3,
    origin: '西区教学楼',
    destination: '天河机场',
    departureTime: dayjs().add(1, 'day').toISOString(),
    seats: 0,
    price: 50,
    note: '已满，请勿联系。',
    status: 'EXPIRED',
    publisherId: 103,
    publisher: mockUsers[2],
    createdAt: dayjs().subtract(3, 'hour').toISOString(),
  },
  {
    id: 4,
    origin: '紫菘公寓',
    destination: '汉口江滩',
    departureTime: dayjs().add(2, 'day').toISOString(),
    seats: 3,
    status: 'FINISHED',
    publisherId: 101,
    publisher: mockUsers[0],
    createdAt: dayjs().subtract(5, 'hour').toISOString(),
  }
]