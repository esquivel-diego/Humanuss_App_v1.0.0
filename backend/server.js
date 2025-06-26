// backend/server.js
import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Ruta a la base de datos JSON
const dbFile = join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)

// Inicializar servidor
const app = express()
const PORT = 4000

// Middlewares
app.use(cors())
app.use(express.json())

// Inicializar datos si no existen
await db.read()
db.data ||= { solicitudes: [] }

// GET /solicitudes?empleadoId=...
app.get('/solicitudes', (req, res) => {
  const { empleadoId } = req.query

  if (!empleadoId) {
    return res.status(400).json({ error: 'Falta empleadoId' })
  }

  const solicitudes = db.data.solicitudes?.filter(
    (s) => s.userId === empleadoId
  ) || []

  return res.json({ recordset: solicitudes })
})

// POST /solicitudes
app.post('/solicitudes', async (req, res) => {
  const solicitud = req.body

  if (!solicitud || !solicitud.userId || !solicitud.date || !solicitud.type) {
    return res.status(400).json({ error: 'Solicitud inválida' })
  }

  const nueva = {
    id: Date.now(), // ID único temporal
    ...solicitud,
  }

  db.data.solicitudes.push(nueva)
  await db.write()

  return res.status(201).json({ ok: true, solicitud: nueva })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor backend corriendo en http://localhost:${PORT}`)
})
