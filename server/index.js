// File: server/index.js
// Optional mock server: run with `npm run server`
// Very small Express server to accept POSTed events when SEND_TO_API = true
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.post('/api/event', (req,res)=>{
  console.log('[Mock API] Received event:', req.body)
  res.json({ ok:true })
})
const port = process.env.PORT || 3000
app.listen(port, ()=>console.log('TagPilot mock API listening on', port))
