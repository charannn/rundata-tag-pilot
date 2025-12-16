// File: public/tagpilot-sdk.js
/* TagPilot SDK - drop into the <head> of target websites */
(function () {
  if (window.tagpilot && window.tagpilot._initialized) return
  const SEND_TO_API = false // set true to POST to API_ENDPOINT
  const API_ENDPOINT = 'http://localhost:3000/api/event'

  function now(){ return Date.now() }

  window.tagpilot = {
    _initialized: true,
    queue: [],
    track: function(event, data){
      const item = { event, data: data || {}, ts: now() }
      try { this.queue.push(item) } catch(e){ /* noop */ }
      // non-blocking send
      if (SEND_TO_API) {
        try {
          fetch(API_ENDPOINT, { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify(item) }).catch(()=>{})
        } catch(e){}
      }
      if (typeof console !== 'undefined') console.log('[TagPilot SDK] track', item.event, item.data)
    },
    identify: function(userId, traits){
      this.track('identify', { userId, traits: traits||{} })
    },
    pageView: function(path){
      this.track('page_view', { path: path || location.pathname, title: document.title, referrer: document.referrer })
    }
  }
  // auto page view
  try { window.tagpilot.pageView() } catch(e) {}
})()
