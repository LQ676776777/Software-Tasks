// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/pages/LoginPage"
import RideListPage from "@/pages/RideListPage"
import RideDetailPage from "@/pages/RideDetailPage"
import PublishRidePage from "@/pages/PublishRidePage"
import ProfilePage from "@/pages/ProfilePage"
import SearchPage from "@/pages/SearchPage"
import useAuth from "@/store/auth"
import BottomNav from "@/components/BottomNav"

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthed } = useAuth()
  return isAuthed ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区域：为底部导航预留空间 pb-24，并限制手机宽度 */}
      <main className="mx-auto max-w-md px-4 pt-4 pb-24">
        <Routes>
          <Route path="/" element={<RideListPage />} />
          <Route path="/search" element={<SearchPage />} />
          {/* 详情页路径修改为 /carpool/:id，对应后端的 carpool 查询 */}
          <Route path="/carpool/:id" element={<RideDetailPage />} />
          <Route path="/publish" element={<RequireAuth><PublishRidePage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          {/* <Route path="/publish" element={<PublishRidePage />} />
          <Route path="/profile" element={<ProfilePage />} /> */}


          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 固定底部导航 */}
      <BottomNav />
    </div>
  )
}
