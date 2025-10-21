
export type Result<T=any> = {
  code?: number;              // e.g. 0 / 200 for success
  status?: number | string;   // some backends use 'status'
  success?: boolean;          // some backends use boolean success
  message?: string;
  msg?: string;
  data: T;
  // extra: timestamp, requestId, etc. will be preserved on response.data
  [k: string]: any;
}

/** Determine success from flexible backend */
export function isOk(res: Result<any>): boolean {
  if (typeof res.success === 'boolean') return res.success
  if (typeof res.code === 'number') return res.code === 0 || res.code === 200
  if (typeof res.status === 'number') return res.status === 0 || res.status === 200
  if (typeof res.status === 'string') return res.status.toLowerCase() === 'ok' || res.status === '200'
  // default optimistic only if data exists
  return !!res.data
}

export function getMessage(res: Result<any>): string {
  return res.message || res.msg || ''
}

// Normalize page data: works with {total, items} | {total, list} | {count, rows} | array
export function normalizePageData<T=any>(data: any) {
  if (!data) return { total: 0, items: [] as T[] }
  if (Array.isArray(data)) return { total: data.length, items: data as T[] }
  const total = data.total ?? data.totalCount ?? data.count ?? data.recordsTotal ?? 0
  const items = data.items ?? data.list ?? data.rows ?? data.records ?? []
  return { total, items: items as T[] }
}
