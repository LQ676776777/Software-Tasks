// src/api/result.ts
/**
 * 通用的后端响应类型定义。
 *
 * 后端统一返回 Result 对象，包含：
 *  - success: 标识请求是否成功
 *  - errorMsg: 失败时的错误描述
 *  - data: 返回的业务数据，可以是单个对象或数组
 *  - total: 当 data 为列表时返回的总条数，用于分页
 *  其余属性会被原样保留，方便后续扩展。
 */
export type Result<T = any> = {
  success: boolean
  errorMsg?: string
  data: T
  total?: number
  [k: string]: any
}

/** 判断响应是否成功 */
export function isOk(res: Result<any>): boolean {
  return !!res && res.success === true
}

/** 提取错误消息，默认为空字符串 */
export function getMessage(res: Result<any>): string {
  return res.errorMsg || ''
}

/**
 * 将包含 Result 的分页结果格式化为 { total, items }。
 * 如果传入的对象具备 data/total 字段，则优先使用；
 * 否则兼容旧逻辑，直接处理传入的 data 本身。
 */
export function normalizePageData<T = any>(resp: Result<any> | any) {
  // 当传入的是整个响应时，从中获取 data 和 total
  if (resp && typeof resp === 'object' && 'data' in resp) {
    const arr = resp.data as any
    const total = resp.total ?? (Array.isArray(arr) ? arr.length : 0)
    const items = Array.isArray(arr) ? arr : []
    return { total, items: items as T[] }
  }
  // 兼容传入的是数据本身的情况
  const data = resp as any
  if (!data) return { total: 0, items: [] as T[] }
  if (Array.isArray(data)) return { total: data.length, items: data as T[] }
  const total = data.total ?? data.totalCount ?? data.count ?? data.recordsTotal ?? 0
  const items = data.items ?? data.list ?? data.rows ?? data.records ?? []
  return { total, items: items as T[] }
}