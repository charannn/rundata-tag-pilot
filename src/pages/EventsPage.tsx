// File: src/pages/EventsPage.tsx
import React, { useState } from 'react'
import { useTagPilotStore } from '../store/useTagPilotStore'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Table, THead, TBody, TR, TH, TD } from '../components/ui/Table'

function AIModal({ onCreate }:{onCreate:()=>void}){
  const [prompt, setPrompt] = useState('')
  const addEvent = useTagPilotStore(s=>s.addEvent)
  function generate(){
    if(!prompt) return
    const lower = prompt.toLowerCase()
    let name='custom_event', payload={}
    if(lower.includes('add to cart')|| lower.includes('add-to-cart')|| lower.includes('add_to_cart')) { name='add_to_cart_ai'; payload={ productId:'string', quantity:'number' } }
    else if(lower.includes('purchase')) { name='purchase_ai'; payload={ transactionId:'string', value:'number', currency:'string' } }
    else if(lower.includes('signup') || lower.includes('sign up')) { name='signup_ai'; payload={ method:'string' } }
    addEvent({ name, description: prompt, payloadStructure: payload })
    setPrompt('')
    onCreate()
  }
  return (
    <div className="p-2 border rounded space-y-2">
      <div className="text-sm font-medium">AI Tag Generator (mock)</div>
      <Textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Describe the event e.g. Track when user clicks add-to-cart" />
      <div className="flex justify-end"><Button onClick={generate}>Generate</Button></div>
    </div>
  )
}

export default function EventsPage(){
  const { events, addEvent, deleteEvent } = useTagPilotStore()
  const [name,setName]=useState(''), [desc,setDesc]=useState(''), [payloadStr,setPayloadStr]=useState('{}')
  function create(){
    try {
      const payload = JSON.parse(payloadStr)
      addEvent({ name, description: desc, payloadStructure: payload })
      setName(''); setDesc(''); setPayloadStr('{}')
    } catch(e){
      alert('Invalid JSON for payload structure')
    }
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Events</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Table>
            <THead>
              <TR><TH>Event</TH><TH>Description</TH><TH>Payload</TH><TH>Actions</TH></TR>
            </THead>
            <TBody>
              {events.map(e=>(
                <TR key={e.id}>
                  <TD><div className="font-medium">{e.name}</div></TD>
                  <TD>{e.description}</TD>
                  <TD><code className="text-xs">{Object.entries(e.payloadStructure).map(([k,v])=>`${k}:${v}`).join(', ')}</code></TD>
                  <TD><button className="text-red-600" onClick={()=>deleteEvent(e.id)}>Delete</button></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        <div>
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Create Event</div>
            <Input placeholder="name e.g. purchase" value={name} onChange={e=>setName(e.target.value)} />
            <Input placeholder="description" value={desc} onChange={e=>setDesc(e.target.value)} className="mt-2" />
            <Textarea rows={4} value={payloadStr} onChange={e=>setPayloadStr(e.target.value)} className="mt-2" />
            <div className="flex gap-2 mt-2">
              <Button onClick={create}>Create</Button>
            </div>
          </div>

          <AIModal onCreate={()=>{}} />
        </div>
      </div>
    </div>
  )
}
