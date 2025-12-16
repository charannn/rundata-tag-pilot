// File: src/pages/DebugPage.tsx
import React, { useEffect } from 'react'
import { useTagPilotStore } from '../store/useTagPilotStore'
import Button from '../components/ui/Button'

function simulateTagFires(event:string, data:any, tags:any[]){
  const fired:string[] = []
  for(const tag of tags){
    if(!tag.enabled) continue
    try{
      // Replace 'event' and 'eventData' with values via a Function for demo.
      const fn = new Function('event','eventData','return (' + tag.triggerCondition + ')')
      const ok = !!fn(event, data)
      if(ok) fired.push(tag.name)
    }catch(e){}
  }
  return fired
}

export default function DebugPage(){
  const { settings, toggleDebugMode, liveEvents, addLiveEvent, clearLiveEvents, tags } = useTagPilotStore()
  useEffect(()=>{
    if(!settings.debugMode) return
    const interval = setInterval(()=>{
      const g = (window as any).tagpilot
      if(g && Array.isArray(g.queue) && g.queue.length){
        const items = g.queue.splice(0)
        items.forEach((it:any)=>{
          const fired = simulateTagFires(it.event, it.data, tags)
          addLiveEvent({ event: it.event, data: it.data, ts: it.ts, firedTags: fired })
        })
      }
    }, 400)
    return ()=>clearInterval(interval)
  }, [settings.debugMode, addLiveEvent, tags])

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Debug Panel</h1>
        <div className="flex gap-2 items-center">
          <div className="text-sm">{settings.debugMode ? 'ON' : 'OFF'}</div>
          <Button onClick={toggleDebugMode}>{settings.debugMode ? 'Turn Off' : 'Turn On'}</Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Live Stream</h3>
          <div><Button onClick={clearLiveEvents}>Clear</Button></div>
        </div>
        <div className="border rounded p-3 max-h-[60vh] overflow-auto">
          {liveEvents.map(ev=>(
            <div key={ev.id} className="border-b py-2">
              <div className="flex justify-between"><div className="font-medium">{ev.event}</div><div className="text-xs">{new Date(ev.ts).toLocaleTimeString()}</div></div>
              <pre className="text-xs bg-slate-50 p-2 rounded mt-1">{JSON.stringify(ev.data, null, 2)}</pre>
              <div className="text-xs mt-1">Tags Fired: {ev.firedTags?.length ? ev.firedTags.join(', ') : '—'}</div>
            </div>
          ))}
          {liveEvents.length===0 && <div className="text-sm text-slate-500">No events captured.</div>}
        </div>
      </div>
    </div>
  )
}
