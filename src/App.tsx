import { HashRouter, Routes, Route } from 'react-router-dom'
import { DashboardProvider } from './context/DashboardContext'
import DashboardPage from './pages/DashboardPage'
import ChurchDetailPage from './pages/ChurchDetailPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <DashboardProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/church/:id" element={<ChurchDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </HashRouter>
    </DashboardProvider>
  )
}
