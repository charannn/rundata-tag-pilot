import { RuleCondition } from "./ruleTypes"

export function evaluateCondition(
  condition: RuleCondition,
  event: string,
  data: Record<string, any>
) {
  const actual =
    condition.field === "event"
      ? event
      : data?.[condition.field]

  let matched = false

  switch (condition.operator) {
    case "equals":
      matched = actual === condition.value
      break
    case "not_equals":
      matched = actual !== condition.value
      break
    case "greater_than":
      matched = Number(actual) > Number(condition.value)
      break
    case "less_than":
      matched = Number(actual) < Number(condition.value)
      break
    case "contains":
      matched = String(actual).includes(String(condition.value))
      break
    case "exists":
      matched = actual !== undefined
      break
  }

  return {
    field: condition.field,
    operator: condition.operator,
    expected: condition.value,
    actual,
    matched,
    reason: matched
      ? "Condition matched"
      : `Expected ${condition.field} ${condition.operator} ${condition.value}`
  }
}
