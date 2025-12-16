// File: src/pages/DashboardPage.tsx
import React from 'react'
import { useTagPilotStore } from '../store/useTagPilotStore'
import { Card } from '../components/ui/Card'

export default function DashboardPage(){
  const { events, tags, liveEvents } = useTagPilotStore()
  const counts = liveEvents.reduce((acc:any, e)=>{ acc[e.event]= (acc[e.event]||0)+1; return acc },{})
  const top = Object.entries(counts).sort((a:any,b:any)=>b[1]-a[1]).slice(0,5)
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <Card><div className="text-xs">Defined Events</div><div className="text-2xl font-bold">{events.length}</div></Card>
        <Card><div className="text-xs">Defined Tags</div><div className="text-2xl font-bold">{tags.length}</div></Card>
        <Card><div className="text-xs">Live Events (stream)</div><div className="text-2xl font-bold">{liveEvents.length}</div></Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold mb-2">Top Events</h3>
          {top.length ? top.map(([k,v]:any)=>(<div key={k} className="flex justify-between py-1"><span>{k}</span><span className="font-semibold">{v}</span></div>)) : <div className="text-sm text-slate-500">No events yet.</div>}
        </Card>

        <Card>
          <h3 className="font-semibold mb-2">Live Feed</h3>
          <div className="max-h-48 overflow-auto">
            {liveEvents.map(ev=>(
              <div key={ev.id} className="py-2 border-b">
                <div className="font-medium">{ev.event}</div>
                <div className="text-xs text-slate-600">{new Date(ev.ts).toLocaleTimeString()}</div>
                <pre className="text-xs mt-1 bg-slate-50 p-2 rounded">{JSON.stringify(ev.data)}</pre>
              </div>
            ))}
            {liveEvents.length===0 && <div className="text-sm text-slate-500">No streamed events. Turn on Debug and push events from a test page.</div>}
          </div>
        </Card>
      </div>
    </div>
  )
}
