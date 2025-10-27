
/**
 * 前端统一的数据模型定义。
 *
 * 后端已经实现了一个 CarPool 域对象，其字段包括：
 *  - id:       主键，Long -> number
 *  - dateTime: 出发时间，LocalDateTime -> ISO 字符串
 *  - userId:   发布人 ID
 *  - startPlace: 出发地
 *  - destination: 目的地
 *  - state:   当前拼车状态（整型，可根据业务枚举映射成文案）
 *
 * 为了与后端保持一致，前端的类型定义从原来的 Ride/RideStatus 转换为 CarPool。
 */

export interface CarPool {
  /** 拼车单的唯一标识 */
  id: number
  /** 出发时间（ISO 格式字符串） */
  dateTime: string
  /** 发布人用户 ID */
  userId: number
  /** 出发地 */
  startPlace: string
  /** 目的地 */
  destination: string
  /** 当前状态，0/1/2 等整型，请在组件中根据需要自行映射显示 */
  state: number
  /** 标准化后的出发地（后端填充） */
  normalizedStartPlace?: string
  /** 标准化后的目的地（后端填充） */
  normalizedDestination?: string
}

/**
 * 用户对象与后端保持一致：
 *  - id:        用户 ID
 *  - schoolName: 学校名称
 *  - gender:     性别
 *  - phoneNumber: 手机号
 */
export interface User {
  id: number
  schoolName?: string
  gender?: string
  phoneNumber: string
}

/**
 * 为了兼容旧代码中引用 Ride 的地方，可以简单地将 Ride 定义为 CarPool。
 * 这样不必在所有文件中重命名 import，仍然使用 Ride 这一别名。
 */
export type Ride = CarPool

/** RideStatus 已废弃，保留该类型以避免编译错误 */
export type RideStatus = number
