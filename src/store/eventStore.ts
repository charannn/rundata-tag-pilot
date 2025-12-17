import { create } from "zustand"
import { TagPilotEvent } from "~/lib/events"


type EventStore = {
  events: TagPilotEvent[]
  addEvent: (e: TagPilotEvent) => void
  clear: () => void
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  addEvent: (e) =>
    set((s) => ({ events: [e, ...s.events].slice(0, 200) })),
  clear: () => set({ events: [] }),
}))
