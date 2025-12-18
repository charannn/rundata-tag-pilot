;(function () {
  if (window.tagpilot) return

  window.tagpilot = {
    queue: [],

    track(event, data = {}) {
      this.queue.push({
        event,
        data,
        ts: Date.now(),
      })
    },
  }
})()
