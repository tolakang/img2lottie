import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import convertRouter from './routes/convert.js'

config()

const app = express()
const PORT = process.env.PORT || 5177

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.use('/api', convertRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
