import { Rule, RuleResult } from "./ruleTypes"
import { evaluateCondition } from "./ruleEvaluator"

export function evaluateRules(
  rules: Rule[],
  event: string,
  data: Record<string, any>
): RuleResult[] {
  return rules.map((rule) => {
    if (!rule.enabled) {
      return {
        ruleId: rule.id,
        ruleName: rule.name,
        matched: false,
        conditionResults: []
      }
    }

    const conditionResults: ReturnType<typeof evaluateCondition>[] = []
    let matched = false

    for (const group of rule.groups) {
      const results = group.conditions.map((c) =>
        evaluateCondition(c, event, data)
      )

      conditionResults.push(...results)

      const groupMatched =
        group.operator === "AND"
          ? results.every(r => r.matched)
          : results.some(r => r.matched)

      if (groupMatched) {
        matched = true
        break
      }
    }

    return {
      ruleId: rule.id,
      ruleName: rule.name,
      matched,
      conditionResults
    }
  })
}
