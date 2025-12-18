import React, { useState } from "react"
import { useTagPilotStore } from "../store/useTagPilotStore"
import { useRuleStore } from "../store/useRuleStore"
import { simulateTag } from "../lib/debugEngine"
import Button from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"

/* ---------------------------------------------
   Tags Page — GTM Style + Neon AI (Phase 3)
---------------------------------------------- */
export default function TagsPage() {
  const { tags, addTag, updateTag, deleteTag } = useTagPilotStore()
  const { rules, addRule } = useRuleStore()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = tags.find(t => t.id === selectedId)

  /* ---------------- AI STATE ---------------- */
  const [command, setCommand] = useState("")
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [preview, setPreview] = useState<any>(null)

  /* ---------------- EDIT / SIMULATION ---------------- */
  const [editCode, setEditCode] = useState(false)
  const [simulateEvent, setSimulateEvent] = useState("page_view")
  const [simResult, setSimResult] = useState<any>(null)

  /* ---------------- CREATE EMPTY TAG ---------------- */
  function createEmptyTag() {
    addTag({
      name: "New Tag",
      description: "",
      type: "script",
      code: "",
      triggerCondition: "page_view",
      ruleIds: [],
      enabled: true
    })
  }

  /* ---------------- AI GENERATE ---------------- */
  async function generateWithAI() {
    if (!command.trim()) return

    setLoadingAI(true)
    setAiError(null)

    try {
      const res = await fetch("/api/ai/generate-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: command })
      })

      if (!res.ok) throw new Error("AI generation failed")

      const data = await res.json()
      setPreview(data)
    } catch (err: any) {
      setAiError(err.message || "AI error")
    } finally {
      setLoadingAI(false)
    }
  }

  /* ---------------- SAVE AI TAG + AUTO RULES ---------------- */
  function saveGeneratedTag() {
    if (!preview) return

    const createdRuleIds: string[] = []

    preview.suggestedRules?.forEach((rule: any) => {
      const id = addRule(rule)
      createdRuleIds.push(id)
    })

    addTag({
      name: preview.name,
      description: preview.description,
      type: "script",
      code: preview.code,
      triggerCondition: preview.triggerEvent ?? "page_view",
      ruleIds: createdRuleIds,
      enabled: true
    })

    setPreview(null)
    setCommand("")
  }

  /* ---------------- AI REFINE ---------------- */
  async function refineWithAI(tag: any) {
    setLoadingAI(true)
    setAiError(null)

    try {
      const res = await fetch("/api/ai/refine-tag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag, rules })
      })

      if (!res.ok) throw new Error("AI refine failed")

      const data = await res.json()
      setPreview(data)
    } catch (e: any) {
      setAiError(e.message || "AI refine error")
    } finally {
      setLoadingAI(false)
    }
  }

  /* ---------------- EVENT SIMULATION ---------------- */
  function simulate() {
    if (!selected?.code) return

    const result = simulateTag(
      selected.code,
      simulateEvent,
      { value: 100, currency: "INR" }
    )

    setSimResult(result)
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">

      {/* ================= NEON AI GENERATOR ================= */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white shadow-lg space-y-4">
        <h1 className="text-xl font-semibold">Generate Tag with AI</h1>

        <div className="flex gap-3">
          <Input
            placeholder='e.g. "Track Meta purchase with value & currency"'
            value={command}
            onChange={e => setCommand(e.target.value)}
            className="bg-white/90 text-slate-900"
          />
          <Button onClick={generateWithAI} disabled={loadingAI} className="bg-black text-white">
            {loadingAI ? "Generating…" : "Generate"}
          </Button>
        </div>

        {aiError && <div className="text-red-200 text-sm">{aiError}</div>}

        {/* -------- AI PREVIEW -------- */}
        {preview && (
          <div className="bg-white rounded-xl p-4 text-slate-900 space-y-3">
            <div className="flex justify-between items-center">
              <div className="font-semibold">{preview.name}</div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Confidence {Math.round((preview.confidence ?? 0) * 100)}%
              </span>
            </div>

            <div className="text-sm">{preview.description}</div>

            <div className="bg-slate-900 text-slate-100 rounded-lg border border-slate-700">
              <pre className="p-3 text-xs font-mono whitespace-pre-wrap">
                {preview.code}
              </pre>
            </div>

            {preview.explanation && (
              <div className="text-sm">
                <strong>Why this tag:</strong> {preview.explanation}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={saveGeneratedTag}>Save Tag</Button>
              <Button variant="ghost" onClick={() => setPreview(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ================= TAGS + CONFIG ================= */}
      <div className="grid grid-cols-[1fr_420px] gap-6 h-[75vh]">

        {/* -------- TAG LIST -------- */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Triggers</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {tags.map(tag => (
                <tr
                  key={tag.id}
                  onClick={() => setSelectedId(tag.id)}
                  className={`cursor-pointer hover:bg-slate-50 ${
                    selectedId === tag.id ? "bg-violet-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-violet-700">
                    {tag.name}
                  </td>
                  <td className="px-4 py-3">
                    {tag.triggerCondition || "page_view"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tag.enabled ? "bg-green-100 text-green-700" : "bg-slate-200"
                    }`}>
                      {tag.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* -------- CONFIG PANEL -------- */}
        <div className="bg-white rounded-xl border shadow-sm overflow-auto">
          {!selected ? (
            <div className="p-6 text-slate-400">Select a tag</div>
          ) : (
            <>
              <div className="px-6 py-4 bg-gradient-to-r from-fuchsia-600 via-violet-600 to-indigo-600 text-white flex justify-between">
                <Input
                  value={selected.name}
                  onChange={e => updateTag(selected.id, { name: e.target.value })}
                  className="bg-transparent border-none text-white font-semibold"
                />
                <Button variant="ghost" onClick={() => deleteTag(selected.id)}>
                  Delete
                </Button>
              </div>

              <div className="p-6 space-y-4">

                {/* REFINE + SIMULATE */}
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => refineWithAI(selected)}>
                    ✨ Refine with AI
                  </Button>

                  <Input
                    value={simulateEvent}
                    onChange={e => setSimulateEvent(e.target.value)}
                    className="w-40"
                  />

                  <Button onClick={simulate}>▶ Simulate</Button>
                </div>

                {simResult && (
                  <div className={`p-3 rounded-lg text-sm ${
                    simResult.fired
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}>
                    {simResult.fired
                      ? `Tag "${selected.name}" fired for "${simulateEvent}"`
                      : `❌ ${simResult.error}`}
                  </div>
                )}

                {/* CODE */}
                {editCode ? (
                  <Textarea
                    rows={8}
                    value={selected.code}
                    onChange={e => updateTag(selected.id, { code: e.target.value })}
                    className="font-mono"
                  />
                ) : (
                  <div className="bg-slate-900 text-slate-100 rounded-lg border">
                    <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
                      {selected.code || "// No code"}
                    </pre>
                  </div>
                )}

                <button
                  className="text-xs text-violet-600"
                  onClick={() => setEditCode(v => !v)}
                >
                  {editCode ? "Done" : "Edit Code"}
                </button>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
