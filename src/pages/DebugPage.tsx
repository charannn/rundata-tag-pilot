// File: src/pages/DebugPage.tsx
import React, { useEffect, useState } from "react"
import { useTagPilotStore } from "../store/useTagPilotStore"
import Button from "../components/ui/Button"

/* ---------------------------------------------
   Demo trigger evaluator (Phase 2A)
---------------------------------------------- */
function evaluateTags(event: string, data: any, tags: any[]) {
  const fired: string[] = []
  const notFired: string[] = []

  for (const tag of tags) {
    if (!tag.enabled) {
      notFired.push(tag.name)
      continue
    }

    try {
      const fn = new Function(
        "event",
        "eventData",
        `return (${tag.triggerCondition})`
      )
      fn(event, data) ? fired.push(tag.name) : notFired.push(tag.name)
    } catch {
      notFired.push(tag.name)
    }
  }

  return { fired, notFired }
}

/* ---------------------------------------------
   Debug Page — Stable GTM-style Preview
---------------------------------------------- */
export default function DebugPage() {
  const {
    settings,
    toggleDebugMode,
    liveEvents,
    addLiveEvent,
    clearLiveEvents,
    tags
  } = useTagPilotStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)

  /* Poll SDK queue */
  useEffect(() => {
    if (!settings.debugMode) return

    const interval = setInterval(() => {
      const tp = (window as any).tagpilot
      if (!tp || !Array.isArray(tp.queue) || !tp.queue.length) return

      tp.queue.splice(0).forEach((item: any) => {
        const res = evaluateTags(item.event, item.data, tags)

        addLiveEvent({
          event: item.event,
          data: item.data,
          ts: item.ts ?? Date.now(),
          firedTags: res.fired,
          notFiredTags: res.notFired
        })
      })
    }, 400)

    return () => clearInterval(interval)
  }, [settings.debugMode, tags, addLiveEvent])

  /* Auto-select latest event */
  useEffect(() => {
    if (liveEvents.length && !selectedId) {
      setSelectedId(liveEvents[0].id)
    }
  }, [liveEvents, selectedId])

  const selected = liveEvents.find(e => e.id === selectedId)

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Debug Preview</h1>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              settings.debugMode ? "text-green-600" : "text-slate-500"
            }`}
          >
            {settings.debugMode ? "Preview ON" : "Preview OFF"}
          </span>

          <Button onClick={toggleDebugMode}>
            {settings.debugMode ? "Stop" : "Start"}
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-[300px_1fr] gap-6 h-[75vh]">

        {/* LEFT: EVENT TIMELINE */}
        <aside className="bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
          {/* Sticky Neon Header */}
          <div className="
            sticky top-0 z-10
            px-5 py-3
            bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600
            text-white
            flex items-center justify-between
            rounded-t-2xl
            shadow-lg
          ">
            <span className="text-sm font-semibold tracking-widest uppercase">
              Event Timeline
            </span>

            <span className="
              flex items-center gap-2
              text-[11px] font-bold
              px-3 py-1 rounded-full
              bg-black/25
            ">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              LIVE
            </span>
          </div>

          {/* Scrollable List */}
          <div className="overflow-y-auto divide-y">
            {liveEvents.map(ev => {
              const active = ev.id === selectedId

              return (
                <button
                  key={ev.id}
                  onClick={() => setSelectedId(ev.id)}
                  className={`
                    relative w-full text-left px-4 py-3
                    transition
                    ${active ? "bg-violet-50" : "hover:bg-slate-50"}
                  `}
                >
                  {/* Active bar */}
                  {active && (
                    <span className="
                      absolute left-0 top-0 h-full w-1
                      bg-gradient-to-b from-fuchsia-500 to-indigo-500
                    " />
                  )}

                  <div className="flex items-center gap-3">
                    {active && (
                      <span className="
                        h-2.5 w-2.5 rounded-full
                        bg-indigo-600
                        shadow-[0_0_10px_rgba(99,102,241,0.8)]
                      " />
                    )}

                    <div>
                      <div className="text-sm font-medium text-slate-800">
                        {ev.event}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(ev.ts).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}

            {liveEvents.length === 0 && (
              <div className="p-4 text-sm text-slate-500">
                Waiting for events…
              </div>
            )}
          </div>
        </aside>

        {/* RIGHT: EVENT DETAILS */}
        <main className="bg-white rounded-xl border shadow-sm overflow-auto">
          {!selected ? (
            <div className="p-8 text-slate-500 text-sm">
              Select an event to inspect
            </div>
          ) : (
            <>
              <div className="
                px-6 py-4 flex justify-between
                bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600
                text-white
              ">
                <span className="font-semibold uppercase tracking-wide">
                  {selected.event}
                </span>
                <span className="text-sm opacity-90">
                  {new Date(selected.ts).toLocaleTimeString()}
                </span>
              </div>

              <div className="p-6 space-y-6 bg-slate-50">
                <section className="bg-white rounded-xl p-4 border">
                  <h3 className="font-semibold text-green-700 mb-2">
                    Tags Fired
                  </h3>
                  {selected.firedTags?.length
                    ? selected.firedTags.map(t => (
                        <span
                          key={t}
                          className="inline-block mr-2 mb-2 px-3 py-1.5
                            text-sm rounded-full bg-green-100 text-green-800
                            border border-green-300 font-medium"
                        >
                          {t}
                        </span>
                      ))
                    : <div className="text-sm text-slate-400">No tags fired</div>}
                </section>

                <section className="bg-slate-900 rounded-xl border border-slate-700">
                  <div className="px-4 py-2 text-sm font-semibold text-slate-300 border-b border-slate-700">
                    Event Data
                  </div>
                  <pre className="p-4 text-sm text-slate-100 overflow-auto">
                    {JSON.stringify(selected.data, null, 2)}
                  </pre>
                </section>
              </div>
            </>
          )}
        </main>
      </div>

      <div className="flex justify-end">
        <Button onClick={clearLiveEvents}>Clear Preview</Button>
      </div>
    </div>
  )
}
