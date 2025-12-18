import { useRuleStore } from "../store/useRuleStore"
import Button from "../components/ui/Button"
import { RuleCondition } from "../rules/ruleTypes"
import ConditionRow from "../rules/ConditionRow"

/* ---------------------------------------------
   Rules Page
---------------------------------------------- */
export default function RulesPage() {
  const { rules, addRule, updateRule, deleteRule, toggleRule } =
    useRuleStore()

  const createRule = () => {
    addRule({
      name: "New Rule",
      enabled: true,
      groups: [
        {
          id: crypto.randomUUID(),
          operator: "AND",
          conditions: [
            { field: "event", operator: "equals", value: "" }
          ]
        }
      ]
    })
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Rules</h1>
        <Button onClick={createRule}>+ New Rule</Button>
      </div>

      {/* Rules */}
      {rules.map(rule => (
        <div
          key={rule.id}
          className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        >
          {/* Neon Header */}
          <div className="px-6 py-4 flex justify-between items-center
            bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600
            text-white"
          >
            <input
              value={rule.name}
              onChange={e =>
                updateRule(rule.id, { name: e.target.value })
              }
              className="bg-transparent outline-none font-semibold text-lg"
            />

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleRule(rule.id)}
                className={`text-xs font-bold px-3 py-1 rounded-full
                  ${rule.enabled
                    ? "bg-green-400 text-black"
                    : "bg-black/30 text-white"}`}
              >
                {rule.enabled ? "ENABLED" : "DISABLED"}
              </button>

              <Button
                variant="ghost"
                onClick={() => deleteRule(rule.id)}
                className="text-white hover:bg-white/10"
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Condition Groups */}
          <div className="p-6 space-y-6 bg-slate-50">
            {rule.groups.map((group, gIdx) => (
              <ConditionGroupCard
                key={group.id}
                group={group}
                onChange={updated => {
                  const next = [...rule.groups]
                  next[gIdx] = updated
                  updateRule(rule.id, { groups: next })
                }}
                onDelete={() =>
                  updateRule(rule.id, {
                    groups: rule.groups.filter((_, i) => i !== gIdx)
                  })
                }
              />
            ))}

            <Button
              variant="secondary"
              onClick={() =>
                updateRule(rule.id, {
                  groups: [
                    ...rule.groups,
                    {
                      id: crypto.randomUUID(),
                      operator: "AND",
                      conditions: [
                        { field: "event", operator: "equals", value: "" }
                      ]
                    }
                  ]
                })
              }
            >
              + Add Condition Group
            </Button>
          </div>
        </div>
      ))}

      {rules.length === 0 && (
        <div className="text-slate-500">
          No rules created yet.
        </div>
      )}
    </div>
  )
}

/* ---------------------------------------------
   Condition Group Card
---------------------------------------------- */
function ConditionGroupCard({
  group,
  onChange,
  onDelete
}: {
  group: {
    id: string
    operator: "AND" | "OR"
    conditions: RuleCondition[]
  }
  onChange: (g: any) => void
  onDelete: () => void
}) {
  return (
    <div className="bg-white rounded-xl border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-700">
          Match
        </span>

        <div className="flex items-center gap-2">
          <select
            value={group.operator}
            onChange={e =>
              onChange({ ...group, operator: e.target.value })
            }
            className="text-xs font-semibold px-3 py-1 rounded-full
              bg-violet-100 text-violet-700 border"
          >
            <option value="AND">ALL (AND)</option>
            <option value="OR">ANY (OR)</option>
          </select>

          <Button
            variant="ghost"
            onClick={onDelete}
            className="text-red-600"
          >
            Remove
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {group.conditions.map((cond, idx) => (
          <ConditionRow
            key={idx}
            condition={cond}
            onChange={updated => {
              const next = [...group.conditions]
              next[idx] = updated
              onChange({ ...group, conditions: next })
            }}
            onDelete={() =>
              onChange({
                ...group,
                conditions: group.conditions.filter((_, i) => i !== idx)
              })
            }
          />
        ))}
      </div>

      <Button
        variant="ghost"
        onClick={() =>
          onChange({
            ...group,
            conditions: [
              ...group.conditions,
              { field: "", operator: "equals", value: "" }
            ]
          })
        }
      >
        + Add Condition
      </Button>
    </div>
  )
}
