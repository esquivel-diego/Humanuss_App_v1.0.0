import express from 'express'
import cors from 'cors'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dbFile = join(__dirname, 'db.json')
const adapter = new JSONFile(dbFile)
const db = new Low(adapter)

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

// Inicializar base de datos
await db.read()
db.data ||= {}
db.data.solicitudes ||= []
db.data.marcajes ||= []
db.data.admins ||= []
db.data.empleados ||= []

// ---------------------------
// RUTAS SOLICITUDES
// ---------------------------

// GET /solicitudes?empleadoId=...
app.get('/solicitudes', (req, res) => {
  const { empleadoId } = req.query
  if (!empleadoId) {
    return res.status(400).json({ error: 'Falta empleadoId' })
  }

  const solicitudes = db.data.solicitudes.filter(
    (s) => s.userId === empleadoId
  )

  return res.json({ recordset: solicitudes })
})

// POST /solicitudes
app.post('/solicitudes', async (req, res) => {
  const solicitud = req.body
  if (!solicitud || !solicitud.userId || !solicitud.date || !solicitud.type) {
    return res.status(400).json({ error: 'Solicitud inválida' })
  }

  const nueva = {
    id: Date.now(),
    ...solicitud,
  }

  db.data.solicitudes.push(nueva)
  await db.write()

  return res.status(201).json({ ok: true, solicitud: nueva })
})

// ---------------------------
// RUTAS MARCAJES
// ---------------------------

// POST /marcajes
app.post('/marcajes', async (req, res) => {
  const { empleadoId, fecha, hora, tipo } = req.body

  if (!empleadoId || !fecha || !hora || !['E', 'S'].includes(tipo)) {
    return res.status(400).json({ error: 'Marcaje inválido' })
  }

  const marcaje = {
    id: Date.now(),
    empleadoId,
    fecha,
    hora,
    tipo,
  }

  db.data.marcajes.push(marcaje)
  await db.write()

  return res.status(201).json({ ok: true, marcaje })
})

// GET /marcajes/:empleadoId
app.get('/marcajes/:empleadoId', (req, res) => {
  const { empleadoId } = req.params
  if (!empleadoId) {
    return res.status(400).json({ error: 'Falta empleadoId' })
  }

  const registros = db.data.marcajes.filter(
    (m) => m.empleadoId === empleadoId
  )

  return res.json({ recordset: registros })
})

// ---------------------------
// RUTAS DE USUARIOS Y EMPLEADOS
// ---------------------------

// GET /admin-users
app.get('/admin-users', (req, res) => {
  res.json({ ids: db.data.admins || [] })
})

// GET /empleados
app.get('/empleados', (req, res) => {
  res.json({ recordset: db.data.empleados || [] })
})

// POST /empleados (crear o actualizar)
app.post('/empleados', async (req, res) => {
  const nuevo = req.body
  if (!nuevo || !nuevo.id || !nuevo.name) {
    return res.status(400).json({ error: 'Empleado inválido' })
  }

  const nuevoEmpleado = {
    id: nuevo.id,
    name: nuevo.name,
    position: nuevo.position ?? '',
    email: nuevo.email ?? '',
    photoUrl: nuevo.photoUrl ?? '',
  }

  const index = db.data.empleados.findIndex((e) => e.id === nuevo.id)

  if (index >= 0) {
    db.data.empleados[index] = nuevoEmpleado // 🔁 Actualizar
  } else {
    db.data.empleados.push(nuevoEmpleado) // ➕ Agregar nuevo
  }

  await db.write()
  return res.status(201).json({ ok: true, empleado: nuevoEmpleado })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🟢 Servidor backend corriendo en http://localhost:${PORT}`)
})
