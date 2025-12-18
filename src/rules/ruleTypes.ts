export type RuleOperator =
  | "equals"
  | "not_equals"
  | "greater_than"
  | "less_than"
  | "contains"
  | "exists"

export interface RuleCondition {
  field: string
  operator: RuleOperator
  value?: any
}

export interface RuleConditionGroup {
  id: string
  operator: "AND" | "OR"
  conditions: RuleCondition[]
}

export interface Rule {
  id: string
  name: string
  description?: string
  enabled: boolean
  groups: RuleConditionGroup[]
}


export interface ConditionResult {
  field: string
  operator: string
  expected?: any
  actual?: any
  matched: boolean
  reason: string
}

export interface RuleResult {
  ruleId: string
  ruleName: string
  matched: boolean
  conditionResults: ConditionResult[]
}
