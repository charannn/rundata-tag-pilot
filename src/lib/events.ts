export type TagPilotEvent = {
  id: string
  name: string
  timestamp: number
  page: {
    url: string
    path: string
    referrer?: string
  }
  properties: Record<string, any>
  meta: {
    source: "sdk" | "manual"
    debug: boolean
  }
}
