import type { ElementType } from 'react'

interface PageHeaderProps {
  icon: ElementType // 接收一个图标组件，例如 lucide-react 的 Car
  title: string
  subtitle: string
}

export default function PageHeader({ icon: Icon, title, subtitle }: PageHeaderProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shrink-0">
          <Icon className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}