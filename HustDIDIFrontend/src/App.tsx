
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import RideListPage from '@/pages/RideListPage'
import RideDetailPage from '@/pages/RideDetailPage'
import PublishRidePage from '@/pages/PublishRidePage'
import ProfilePage from '@/pages/ProfilePage'
import SearchPage from '@/pages/SearchPage'
import useAuth from '@/store/auth'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed } = useAuth()
  const location = useLocation()
  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="font-bold">校园拼车</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/search">搜索</Link>
            <Link to="/publish">发布</Link>
            <Link to="/profile">我的</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<RideListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/rides/:id" element={<RideDetailPage />} />
          <Route path="/publish" element={<RequireAuth><PublishRidePage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
