import { RuleResult } from "../rules/ruleTypes"

export interface LiveEvent {
  id: string
  event: string
  data: any
  ts: number
  firedTags?: string[]
  notFiredTags?: string[]

  // NEW
  ruleResults?: RuleResult[]
}


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
