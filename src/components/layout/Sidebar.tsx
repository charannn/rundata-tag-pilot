// File: src/components/layout/Sidebar.tsx
import React from "react"
import { NavLink } from "react-router-dom"
import { Layout, BarChart3, Code, Zap, Settings } from "lucide-react"
import { useTagPilotStore } from "../../store/useTagPilotStore"

const items = [
  { name: "Dashboard", to: "/app/dashboard", icon: Layout },
  { name: "Events", to: "/app/events", icon: BarChart3 },
  { name: "Tags", to: "/app/tags", icon: Code },
  { name: "Debug", to: "/app/debug", icon: Zap },
  { name: "Settings", to: "/app/settings", icon: Settings },
]

export default function Sidebar(): JSX.Element {
  const { events, tags } = useTagPilotStore()

  return (
    <div className="h-full p-4 flex flex-col bg-white">
      {/* Brand */}
      <div className="mb-6 text-xl font-bold flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"
          />
        </svg>
        <span>
          Rundata <span className="text-violet-600">Tag Pilot</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {items.map((i) => {
          const Icon = i.icon
          return (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-semibold"
                    : "hover:bg-slate-50 text-slate-700"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{i.name}</span>

              {i.name === "Events" && (
                <span className="text-xs px-2 rounded bg-slate-100">
                  {events.length}
                </span>
              )}

              {i.name === "Tags" && (
                <span className="text-xs px-2 rounded bg-slate-100">
                  {tags.length}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="text-xs text-slate-500 mt-4">
        Rundata Tag Pilot • Local demo (stores in localStorage)
      </div>
    </div>
  )
}
