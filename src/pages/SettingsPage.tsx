// File: src/pages/SettingsPage.tsx
import React from 'react'
import { useTagPilotStore } from '../store/useTagPilotStore'
import Button from '../components/ui/Button'

export default function SettingsPage(){
  const { events, tags } = useTagPilotStore()
  function copySDK(){
    const snippet = `<script src="/tagpilot-sdk.js"></script>`
    navigator.clipboard.writeText(snippet).then(()=>alert('Copied SDK include to clipboard'))
  }
  function clearAll(){
    if(!confirm('Clear TagPilot data from this browser?')) return
    localStorage.removeItem('tagpilot-storage')
    location.reload()
  }
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h3 className="font-semibold">Data</h3>
          <div className="text-sm mt-2">Events: {events.length}</div>
          <div className="text-sm">Tags: {tags.length}</div>
          <div className="mt-4"><Button onClick={clearAll}>Clear All Data</Button></div>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold">SDK</h3>
          <div className="text-sm mt-2">Include the TagPilot SDK on your pages:</div>
          <pre className="text-xs bg-slate-50 p-2 rounded mt-2">{`<script src="/tagpilot-sdk.js"></script>`}</pre>
          <div className="mt-4"><Button onClick={copySDK}>Copy Include</Button></div>
        </div>
      </div>
    </div>
  )
}
