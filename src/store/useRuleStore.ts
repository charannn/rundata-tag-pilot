import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Rule } from "../rules/ruleTypes"
import { uid } from "../lib/utils"

interface RuleStore {
  rules: Rule[]
  addRule: (rule: Omit<Rule, "id">) => string
  updateRule: (id: string, patch: Partial<Rule>) => void
  deleteRule: (id: string) => void
  toggleRule: (id: string) => void
}

export const useRuleStore = create<RuleStore>()(
  persist(
    (set) => ({
      rules: [],

      addRule: (rule) => {
  const id = uid("rule-")

  set(s => ({
    rules: [...s.rules, { ...rule, id }]
  }))

  return id
},


      updateRule: (id, patch) =>
        set((s) => ({
          rules: s.rules.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          )
        })),

      deleteRule: (id) =>
        set((s) => ({
          rules: s.rules.filter((r) => r.id !== id)
        })),

      toggleRule: (id) =>
        set((s) => ({
          rules: s.rules.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
          )
        }))
    }),
    { name: "tagpilot-rules" }
  )
)
