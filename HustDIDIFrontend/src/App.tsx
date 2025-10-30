import { Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import LoginPage from "@/pages/LoginPage"
import RideListPage from "@/pages/RideListPage"
import RideDetailPage from "@/pages/RideDetailPage"
import PublishRidePage from "@/pages/PublishRidePage"
import AccountPage from "@/pages/AccountPage"
import ProfilePage from "@/pages/ProfilePage"
import SearchPage from "@/pages/SearchPage"
import useAuth  from "@/store/auth"
import BottomNav from "@/components/BottomNav"
import { ToastProvider } from "@/components/Toast" 


// function RequireAuth({ children }: { children: JSX.Element }) {
//   const { isAuthed } = useAuth()
//   return isAuthed ? children : <Navigate to="/login" replace />
// }

function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, checkLogin } = useAuth()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    (async () => {
      try { await checkLogin() }
      catch { /* will redirect below */ }
      finally { setChecked(true) }
    })()
  }, [checkLogin])

  if (!checked) return <div className="p-8 text-gray-400">正在加载…</div>
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* 主内容区域 */}
        <main className="mx-auto max-w-md px-4 pt-4 pb-24">
          <Routes>
            <Route path="/" element={<RequireAuth><RideListPage /></RequireAuth>} />
            <Route path="/search" element={<RequireAuth><SearchPage /></RequireAuth>} />
            <Route path="/carpool/:id" element={<RequireAuth><RideDetailPage /></RequireAuth>} />
            <Route path="/publish" element={<RequireAuth><PublishRidePage /></RequireAuth>} />
            <Route path="/account" element={<RequireAuth><AccountPage /></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* 固定底部导航 */}
        <BottomNav />
      </div>
    </ToastProvider>
  )
}
