import React from "react"
import { NavLink } from "react-router-dom"
import {
  Layout,
  BarChart3,
  Code,
  Zap,
  Settings,
  Gavel
} from "lucide-react"

import { useTagPilotStore } from "../../store/useTagPilotStore"
import { useRuleStore } from "../../store/useRuleStore"

const items = [
  { name: "Dashboard", to: "/app/dashboard", icon: Layout },
  { name: "Events", to: "/app/events", icon: BarChart3 },
  { name: "Tags", to: "/app/tags", icon: Code },
  { name: "Rules", to: "/app/rules", icon: Gavel },
  { name: "Debug", to: "/app/debug", icon: Zap },
  { name: "Settings", to: "/app/settings", icon: Settings },
]

export default function Sidebar(): JSX.Element {
  const { events, tags } = useTagPilotStore()
  const { rules } = useRuleStore()

  return (
    <div className="h-full p-4 flex flex-col bg-white border-r">
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
        {items.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.name}</span>

              {/* Counts */}
              {item.name === "Events" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">
                  {events.length}
                </span>
              )}

              {item.name === "Tags" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">
                  {tags.length}
                </span>
              )}

              {item.name === "Rules" && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">
                  {rules.length}
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
