// File: src/pages/TagsPage.tsx
import React, { useState } from 'react'
import { useTagPilotStore } from '../store/useTagPilotStore'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'

function TagTester({ tag }:{ tag:any }){
  const [evt, setEvt] = useState('purchase')
  const [res, setRes] = useState<string|null>(null)
  function run(){
    // DEBUG ONLY: Simulated safe-ish evaluation using new Function in a sandbox-like manner.
    try {
      const condition = tag.triggerCondition
      // expose `event` and `eventData` variables
      const event = evt
      const eventData = {}
      const fn = new Function('event','eventData','return (' + condition + ')')
      const ok = !!fn(event, eventData)
      setRes(ok ? 'Fired' : 'Not fired')
    } catch(e:any){
      setRes('Error: '+e.message)
    }
  }
  return (
    <div className="mt-2 space-y-2">
      <div className="text-xs">Simulate event name</div>
      <Input value={evt} onChange={e=>setEvt(e.target.value)} />
      <div className="flex gap-2">
        <Button onClick={run}>Run</Button>
        <div className="text-sm self-center">{res}</div>
      </div>
    </div>
  )
}

export default function TagsPage(){
  const { tags, addTag, deleteTag } = useTagPilotStore()
  const [name,setName]=useState(''), [code,setCode]=useState(''), [cond,setCond]=useState('event === \"purchase\"')

  function create(){
    addTag({ name, description:'', type:'script', code, triggerCondition: cond })
    setName(''); setCode(''); setCond('event === \"purchase\"')
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Tags</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="space-y-3">
            {tags.map(t=>(
              <div key={t.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{t.name} {t.enabled? <span className="text-xs text-green-600">ON</span>:<span className="text-xs text-red-600">OFF</span>}</div>
                    <div className="text-xs text-slate-600">{t.triggerCondition}</div>
                  </div>
                  <div>
                    <button className="text-red-600" onClick={()=>deleteTag(t.id)}>Delete</button>
                  </div>
                </div>
                <div className="mt-2 text-xs"><code>{t.code}</code></div>
                <TagTester tag={t} />
              </div>
            ))}
            {tags.length===0 && <div className="text-sm text-slate-500">No tags yet</div>}
          </div>
        </div>

        <div>
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Create Tag</div>
            <Input placeholder="Tag name" value={name} onChange={e=>setName(e.target.value)} />
            <Input placeholder='Trigger condition e.g. event === "purchase"' value={cond} onChange={e=>setCond(e.target.value)} className="mt-2" />
            <Textarea rows={6} value={code} onChange={e=>setCode(e.target.value)} className="mt-2" />
            <div className="flex gap-2 mt-2">
              <Button onClick={create}>Create Tag</Button>
            </div>
          </div>
          <div className="text-xs text-slate-600">Note: Tag code execution is simulated in Debug panel only. Do NOT execute untrusted code in production.</div>
        </div>
      </div>
    </div>
  )
}
