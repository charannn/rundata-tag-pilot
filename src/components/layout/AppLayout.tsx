import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
