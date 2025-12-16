// File: src/lib/types.ts
export type EventPayload = Record<string, any>

export interface EventDef {
  id: string
  name: string
  description?: string
  payloadStructure: Record<string, string>
  createdAt: number
}

export interface TagDef {
  id: string
  name: string
  description?: string
  type: 'script' | 'image' | 'html'
  code: string
  triggerCondition: string
  enabled: boolean
  createdAt: number
}

export interface TagPilotSettings {
  debugMode: boolean
}

export interface LiveEvent {
  id: string
  event: string
  data: any
  ts: number
  firedTags?: string[]
}

export interface TagPilotQueueItem {
  event: string
  data: any
  ts: number
}
