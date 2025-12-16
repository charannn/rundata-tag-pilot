// File: src/store/useTagPilotStore.ts
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { EventDef, TagDef, TagPilotSettings, LiveEvent } from '../lib/types'
import { uid } from '../lib/utils'

interface State {
  events: EventDef[]
  tags: TagDef[]
  settings: TagPilotSettings
  liveEvents: LiveEvent[]
  addEvent: (ev: Omit<EventDef, 'id' | 'createdAt'>) => void
  deleteEvent: (id: string) => void
  addTag: (tag: Omit<TagDef, 'id' | 'createdAt' | 'enabled'> & { enabled?: boolean }) => void
  deleteTag: (id: string) => void
  toggleDebugMode: () => void
  addLiveEvent: (ev: Omit<LiveEvent, 'id'>) => void
  clearLiveEvents: () => void
}

const initialEvents: EventDef[] = [
  { id: 'evt-1', name: 'purchase', description: 'Completed purchase', payloadStructure: { transactionId: 'string', value: 'number', currency: 'string' }, createdAt: Date.now() - 60000 },
  { id: 'evt-2', name: 'add_to_cart', description: 'Added product to cart', payloadStructure: { productId: 'string', quantity: 'number' }, createdAt: Date.now() - 30000 }
]

const initialTags: TagDef[] = [
  { id: 'tag-1', name: 'FB Pixel - Purchase', description: 'FB purchase pixel', type: 'script', code: "console.log('FB Pixel fired', eventData)", triggerCondition: `event === "purchase"`, enabled: true, createdAt: Date.now() - 60000 }
]

export const useTagPilotStore = create<State>()(
  persist(
    (set, get) => ({
      events: initialEvents,
      tags: initialTags,
      settings: { debugMode: false },
      liveEvents: [],
      addEvent: (ev) => set(s => ({ events: [...s.events, { ...ev, id: uid('evt-'), createdAt: Date.now() }] })),
      deleteEvent: (id) => set(s => ({ events: s.events.filter(e => e.id !== id) })),
      addTag: (tag) => set(s => ({ tags: [...s.tags, { ...tag, id: uid('tag-'), enabled: tag.enabled ?? true, createdAt: Date.now() }] })),
      deleteTag: (id) => set(s => ({ tags: s.tags.filter(t => t.id !== id) })),
      toggleDebugMode: () => set(s => ({ settings: { ...s.settings, debugMode: !s.settings.debugMode } })),
      addLiveEvent: (ev) => set(s => ({ liveEvents: [{ ...ev, id: uid('live-') }, ...s.liveEvents].slice(0, 200) })),
      clearLiveEvents: () => set({ liveEvents: [] })
    }),
    { name: 'tagpilot-storage', whitelist: ['events', 'tags', 'settings'] }
  )
)
