import { Routes, Route, Navigate } from "react-router-dom"
import DashboardPage from "@/pages/DashboardPage"
import TradesPage from "@/pages/TradesPage"
import AnalyticsPage from "@/pages/AnalyticsPage"

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/trades" element={<TradesPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  )
}
