type DebugResult = {
  tag: string
  event: string
  fired: boolean
  error?: string
}

export function simulateTag(
  tagCode: string,
  eventName: string,
  eventData: Record<string, any> = {}
): DebugResult {
  try {
    // mock dataLayer
    ;(window as any).dataLayer = (window as any).dataLayer || []

    const event = {
      event: eventName,
      ...eventData
    }

    // push event
    ;(window as any).dataLayer.push(event)

    // SAFELY execute tag code
    // (isolated function scope)
    new Function("event", "eventData", tagCode)(
      eventName,
      eventData
    )

    return {
      tag: "AI Tag",
      event: eventName,
      fired: true
    }
  } catch (err: any) {
    return {
      tag: "AI Tag",
      event: eventName,
      fired: false,
      error: err.message
    }
  }
}
