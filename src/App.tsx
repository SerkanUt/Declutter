import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { ToastProvider } from './components/Toast'
import { Archive } from './pages/Archive'
import { Home } from './pages/Home'
import { Journal } from './pages/Journal'
import { Login } from './pages/Login'
import { Photos } from './pages/Photos'
import { User } from './pages/User'
import { AppProvider, useApp } from './state'

function Shell() {
  const { ready, unlocked, profile } = useApp()
  if (!ready) return null
  if (!unlocked || !profile) return <Navigate to="/login" replace />
  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <HashRouter>
          <div className="frame">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<Shell />}>
                <Route path="/" element={<Home />} />
                <Route path="/journal/:date?" element={<Journal />} />
                <Route path="/photos/:date?" element={<Photos />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/user" element={<User />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </HashRouter>
      </ToastProvider>
    </AppProvider>
  )
}
