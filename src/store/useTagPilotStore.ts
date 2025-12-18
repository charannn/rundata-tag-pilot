import { create } from "zustand"
import { persist } from "zustand/middleware"
import { EventDef, TagDef, TagPilotSettings, LiveEvent } from "../lib/types"
import { uid } from "../lib/utils"

/* ---------------------------------------------
   Store State
---------------------------------------------- */
interface State {
  events: EventDef[]
  tags: TagDef[]
  settings: TagPilotSettings
  liveEvents: LiveEvent[]

  addEvent: (ev: Omit<EventDef, "id" | "createdAt">) => void
  deleteEvent: (id: string) => void

  addTag: (
    tag: Omit<TagDef, "id" | "createdAt" | "enabled"> & {
      enabled?: boolean
      ruleIds?: string[]
    }
  ) => void

  updateTag: (id: string, updates: Partial<TagDef>) => void
  deleteTag: (id: string) => void
  toggleTag: (id: string) => void

  toggleDebugMode: () => void

  addLiveEvent: (ev: Omit<LiveEvent, "id">) => void
  clearLiveEvents: () => void
}

/* ---------------------------------------------
   Initial Data
---------------------------------------------- */
const initialEvents: EventDef[] = [
  {
    id: "evt-1",
    name: "purchase",
    description: "Completed purchase",
    payloadStructure: {
      transactionId: "string",
      value: "number",
      currency: "string"
    },
    createdAt: Date.now() - 60000
  },
  {
    id: "evt-2",
    name: "add_to_cart",
    description: "Added product to cart",
    payloadStructure: {
      productId: "string",
      quantity: "number"
    },
    createdAt: Date.now() - 30000
  }
]

const initialTags: TagDef[] = [
  {
    id: "tag-1",
    name: "FB Pixel - Purchase",
    description: "FB purchase pixel",
    type: "script",
    code: "console.log('FB Pixel fired', eventData)",
    triggerCondition: `event === "purchase"`,
    enabled: true,
    ruleIds: [],
    createdAt: Date.now() - 60000
  }
]

/* ---------------------------------------------
   Store
---------------------------------------------- */
export const useTagPilotStore = create<State>()(
  persist(
    (set, get) => ({
      events: initialEvents,
      tags: initialTags,
      settings: { debugMode: false },
      liveEvents: [],

      /* Events */
      addEvent: (ev) =>
        set(s => ({
          events: [
            ...s.events,
            { ...ev, id: uid("evt-"), createdAt: Date.now() }
          ]
        })),

      deleteEvent: (id) =>
        set(s => ({
          events: s.events.filter(e => e.id !== id)
        })),

      /* Tags */
      addTag: (tag) =>
        set(s => ({
          tags: [
            ...s.tags,
            {
              ...tag,
              id: uid("tag-"),
              enabled: tag.enabled ?? true,
              ruleIds: tag.ruleIds ?? [],
              createdAt: Date.now()
            }
          ]
        })),

      updateTag: (id, updates) =>
        set(s => ({
          tags: s.tags.map(t =>
            t.id === id ? { ...t, ...updates } : t
          )
        })),
      
      toggleTag: (id) =>
  set(s => ({
    tags: s.tags.map(t =>
      t.id === id
        ? { ...t, enabled: !t.enabled }
        : t
    )
  })),

      deleteTag: (id) =>
        set(s => ({
          tags: s.tags.filter(t => t.id !== id)
        })),

      /* Debug */
      toggleDebugMode: () =>
        set(s => ({
          settings: {
            ...s.settings,
            debugMode: !s.settings.debugMode
          }
        })),

      addLiveEvent: (ev) =>
        set(s => ({
          liveEvents: [
            { ...ev, id: uid("live-") },
            ...s.liveEvents
          ].slice(0, 200)
        })),

      clearLiveEvents: () => set({ liveEvents: [] })
    }),
    {
      name: "tagpilot-storage",
      partialize: (state) => ({
        events: state.events,
        tags: state.tags,
        settings: state.settings
      })
    }
  )
)
