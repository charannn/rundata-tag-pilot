// File: src/App.tsx
import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"

import Sidebar from "./components/layout/Sidebar"
import LandingPage from "./pages/LandingPage"
import RulesPage from "./pages/RulesPage"
import DashboardPage from "./pages/DashboardPage"
import EventsPage from "./pages/EventsPage"
import TagsPage from "./pages/TagsPage"
import DebugPage from "./pages/DebugPage"
import SettingsPage from "./pages/SettingsPage"

/* ================= APP LAYOUT ================= */
function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-6">
        <Routes>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="tags" element={<TagsPage />} />
          <Route path="rules" element={<RulesPage />} />
          <Route path="debug" element={<DebugPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Default /app → /app/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}

/* ================= ROOT ROUTES ================= */
export default function App() {
  return (
    <Routes>
      {/* Marketing / Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Application */}
      <Route path="/app/*" element={<AppLayout />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
