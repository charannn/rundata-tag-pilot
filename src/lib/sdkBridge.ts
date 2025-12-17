import { useEventStore } from "~/store/eventStore"

export function emitEvent(name: string, properties = {}) {
  useEventStore.getState().addEvent({
    id: crypto.randomUUID(),
    name,
    timestamp: Date.now(),
    page: {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
    },
    properties,
    meta: {
      source: "sdk",
      debug: true,
    },
  })
}
