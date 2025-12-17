// File: src/pages/DebugPage.tsx
import React, { useEffect } from "react"
import { useTagPilotStore } from "../store/useTagPilotStore"
import Button from "../components/ui/Button"

/* ---------------------------------------------
   Demo trigger evaluator (safe + isolated)
---------------------------------------------- */
function simulateTagFires(
  event: string,
  data: any,
  tags: any[]
): string[] {
  const fired: string[] = []

  for (const tag of tags) {
    if (!tag?.enabled) continue

    try {
      /**
       * NOTE:
       * This is intentionally sandboxed for demo/debug mode only.
       * Later phases should replace this with a real rule engine.
       */
      const fn = new Function(
        "event",
        "eventData",
        `return (${tag.triggerCondition})`
      )

      const ok = Boolean(fn(event, data))
      if (ok) fired.push(tag.name)
    } catch {
      // silently ignore invalid rules in debug mode
    }
  }

  return fired
}

/* ---------------------------------------------
   Debug Page
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

  /* -------------------------------------------
     Poll SDK queue when debug mode is ON
  -------------------------------------------- */
  useEffect(() => {
    if (!settings.debugMode) return

    const interval = setInterval(() => {
      const tp = (window as any).tagpilot

      if (!tp || !Array.isArray(tp.queue) || tp.queue.length === 0) return

      // drain queue safely
      const items = tp.queue.splice(0)

      items.forEach((item: any) => {
        const fired = simulateTagFires(item.event, item.data, tags)

        addLiveEvent({
          event: item.event,
          data: item.data,
          ts: item.ts ?? Date.now(),
          firedTags: fired
        })
      })
    }, 400)

    return () => clearInterval(interval)
  }, [settings.debugMode, tags, addLiveEvent])

  /* -------------------------------------------
     UI
  -------------------------------------------- */
  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Panel</h1>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            {settings.debugMode ? "ON" : "OFF"}
          </span>
          <Button onClick={toggleDebugMode}>
            {settings.debugMode ? "Turn Off" : "Turn On"}
          </Button>
        </div>
      </div>

      {/* Live Stream */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Live Stream</h3>
          <Button onClick={clearLiveEvents}>Clear</Button>
        </div>

        <div className="border rounded p-3 max-h-[60vh] overflow-auto">
          {liveEvents.map((ev) => (
            <div key={ev.id} className="border-b py-3 space-y-1">
              <div className="flex justify-between">
                <div className="font-medium">{ev.event}</div>
                <div className="text-xs text-slate-500">
                  {new Date(ev.ts).toLocaleTimeString()}
                </div>
              </div>

              <pre className="text-xs bg-slate-50 p-2 rounded">
                {JSON.stringify(ev.data, null, 2)}
              </pre>

              <div className="text-xs text-slate-600">
                Tags Fired:{" "}
                {ev.firedTags?.length
                  ? ev.firedTags.join(", ")
                  : "—"}
              </div>
            </div>
          ))}

          {liveEvents.length === 0 && (
            <div className="text-sm text-slate-500">
              No events captured.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
