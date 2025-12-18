import { RuleCondition, RuleOperator } from "../rules/ruleTypes"

interface Props {
  condition: RuleCondition
  onChange: (next: RuleCondition) => void
  onDelete: () => void
}

const OPERATORS: { label: string; value: RuleOperator }[] = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Less Than", value: "less_than" },
  { label: "Contains", value: "contains" },
  { label: "Exists", value: "exists" }
]

export default function ConditionRow({
  condition,
  onChange,
  onDelete
}: Props) {
  const needsValue = condition.operator !== "exists"

  return (
    <div className="flex items-center gap-3">
      {/* Field */}
      <input
        className="w-40 px-3 py-2 rounded-lg border text-sm"
        placeholder="field (event, value)"
        value={condition.field}
        onChange={(e) =>
          onChange({ ...condition, field: e.target.value })
        }
      />

      {/* Operator */}
      <select
        className="px-3 py-2 rounded-lg border text-sm"
        value={condition.operator}
        onChange={(e) =>
          onChange({
            ...condition,
            operator: e.target.value as RuleOperator
          })
        }
      >
        {OPERATORS.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>

      {/* Value */}
      {needsValue && (
        <input
          className="w-40 px-3 py-2 rounded-lg border text-sm"
          placeholder="value"
          value={condition.value ?? ""}
          onChange={(e) =>
            onChange({ ...condition, value: e.target.value })
          }
        />
      )}

      {/* Delete */}
      <button
        onClick={onDelete}
        className="ml-auto text-xs px-3 py-1 rounded-full
                   bg-red-100 text-red-600 font-semibold
                   hover:bg-red-200"
      >
        Remove
      </button>
    </div>
  )
}
