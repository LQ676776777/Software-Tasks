// src/api/mockData.ts

import type { CarPool, User } from '@/types'
import dayjs from 'dayjs'

// 伪造一些用户
export const mockUsers: User[] = [
  { id: 101, phoneNumber: '13800138001', schoolName: '华中科技大学', gender: '男' },
  { id: 102, phoneNumber: '13800138002', schoolName: '华中科技大学', gender: '男' },
  { id: 103, phoneNumber: '13800138003', schoolName: '华中科技大学', gender: '男' },
]

// 伪造一个拼车单列表
export const mockRides: CarPool[] = [
  {
    id: 1,
    startPlace: '韵苑食堂',
    destination: '光谷广场',
    dateTime: dayjs().add(2, 'hour').toISOString(),
    userId: mockUsers[0].id,
    state: 0,
    normalizedStartPlace: '韵苑食堂',
    normalizedDestination: '光谷广场',
  },
  {
    id: 2,
    startPlace: '东区操场',
    destination: '武汉火车站',
    dateTime: dayjs().add(4, 'hour').toISOString(),
    userId: mockUsers[1].id,
    state: 0,
    normalizedStartPlace: '东区操场',
    normalizedDestination: '武汉火车站',
  },
  {
    id: 3,
    startPlace: '西区教学楼',
    destination: '天河机场',
    dateTime: dayjs().add(1, 'day').toISOString(),
    userId: mockUsers[2].id,
    state: 2,
    normalizedStartPlace: '西区教学楼',
    normalizedDestination: '天河机场',
  },
  {
    id: 4,
    startPlace: '紫菘公寓',
    destination: '汉口江滩',
    dateTime: dayjs().add(2, 'day').toISOString(),
    userId: mockUsers[0].id,
    state: 1,
    normalizedStartPlace: '紫菘公寓',
    normalizedDestination: '汉口江滩',
  },
]