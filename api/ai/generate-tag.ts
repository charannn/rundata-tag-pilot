import OpenAI from "openai"
import type { IncomingMessage, ServerResponse } from "http"

/* ---------------------------------------------
   AI SYSTEM PROMPT (PRODUCTION GRADE)
---------------------------------------------- */
const SYSTEM_PROMPT = `
You are an expert Google Tag Manager engineer.

Your task:
Generate a JavaScript tag definition based on a user request.

STRICT RULES:
- Respond with ONLY valid JSON
- NO markdown
- NO explanations
- NO comments outside JSON
- Do NOT hallucinate rules
- Use safe, browser-compatible JavaScript only

JSON SCHEMA (MUST MATCH):

{
  "name": string,
  "description": string,
  "type": "script",
  "code": string,
  "suggestedRules": string[],
  "confidence": number,
  "explanation": string
}

GUIDELINES:
- code must reference (event, eventData)
- confidence must be between 0 and 1
- suggestedRules should be human-readable rule names
`

/* ---------------------------------------------
   OpenAI Client
---------------------------------------------- */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/* ---------------------------------------------
   API Handler
---------------------------------------------- */
export default async function handler(
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  try {
    if (req.method !== "POST") {
      res.statusCode = 405
      return res.end("Method Not Allowed")
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body

    const prompt = body?.prompt

    if (!prompt || prompt.length < 5) {
      res.statusCode = 400
      return res.end(
        JSON.stringify({ error: "Invalid prompt" })
      )
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `User request:\n${prompt}`
        }
      ]
    })

    let raw = completion.choices[0].message.content || ""

    // 🛡️ Safety: remove code fences if model adds them
    raw = raw
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/, "")
      .trim()

    const parsed = JSON.parse(raw)

    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.end(JSON.stringify(parsed))
  } catch (err: any) {
    console.error("AI TAG ERROR:", err)

    res.statusCode = 500
    res.end(
      JSON.stringify({
        error: "AI tag generation failed"
      })
    )
  }
}
