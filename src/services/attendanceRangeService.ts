// src/services/attendanceRangeService.ts
import { fetchJson } from "@utils/apiClient"
import { toLocalYMD } from "@services/marcajeService"

// Respuesta cruda del endpoint de rango
interface MarcajeRangeItem {
  FECHA: string;            // "YYYY-MM-DDT00:00:00.000Z"
  HORA: string | null;      // "HH:mm:ss" (local, lo guarda el backend)
  // Algunos backends usan TIPO, otros ENTRADASALIDA (001/""/002/E/S/IN/OUT)
  TIPO?: string | null;
  ENTRADASALIDA?: string | null;
  EntradaSalida?: string | null;
  Tipo?: string | null;
  tipo?: string | null;
  LATITUD?: number | null;
  LONGITUD?: number | null;
}

// Lo que consume la tabla (con múltiples IN y último OUT)
export interface DayEntryMulti {
  day: string;          // Ej: "Lun 06/10"
  checkIns: string[];   // ["08:05","12:30","14:01"]
  lastCheckOut: string; // último OUT ENCONTRADO, según orden del backend
}

// ---- helpers ----
const pad2 = (n: number) => String(n).padStart(2, "0")

const toHHMM = (hms?: string | null): string => {
  if (!hms || typeof hms !== "string") return ""
  const [h, m] = hms.split(":")
  if (h == null || m == null) return ""
  const hh = Number(h), mm = Number(m)
  if (Number.isNaN(hh) || Number.isNaN(mm)) return ""
  return `${pad2(hh)}:${pad2(mm)}`
}

// Detecta el campo de tipo de forma robusta (TIPO, ENTRADASALIDA, etc.)
const extractRawTipo = (r: MarcajeRangeItem): string | null => {
  return (
    r.TIPO ??
    r.ENTRADASALIDA ??
    r.EntradaSalida ??
    r.Tipo ??
    r.tipo ??
    null
  )
}

// Nota: checkout en tu POST se envía con ENTRADASALIDA = "" (vacío).
// Aquí tratamos "" explícitamente como OUT. También mapeamos 001/E/IN a IN y 002/S/OUT a OUT.
const normalizeTipo = (raw?: string | null): "IN" | "OUT" | "" => {
  if (raw === "") return "OUT" // checkout con cadena vacía
  if (!raw) return ""          // null/undefined: no clasificable
  const t = String(raw).toUpperCase().trim()
  if (t === "IN" || t === "E" || t === "001") return "IN"
  if (t === "OUT" || t === "S" || t === "002") return "OUT"
  return ""
}

const dayLabelEs = (d: Date): string => {
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "short" })
    .format(d)
    .replace(/\.$/, "") // "lun." -> "lun"
  const dd = pad2(d.getDate())
  const mm = pad2(d.getMonth() + 1)
  return `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${dd}/${mm}`
}

// ---- API ----
export const getMarcajesRange = async (
  fromYmd: string,
  toYmd: string
): Promise<MarcajeRangeItem[]> => {
  const res = await fetchJson<{ ok: boolean; recordset?: MarcajeRangeItem[] }>(
    `/v2/MARCAJE/${fromYmd}/${toYmd}`
  )
  return res?.recordset ?? []
}

/**
 * Devuelve 8 días: hoy y 7 previos.
 * Por día:
 *  - checkIns: TODOS los IN (ordenados por hora asc solo para visual)
 *  - lastCheckOut: el ÚLTIMO OUT **en el orden recibido del backend** (último marcado)
 *
 * Importante: NO ordenamos los OUTs; el último checkout corresponde al último registro OUT recibido.
 */
export const getAttendanceLast8DaysAllIns = async (): Promise<DayEntryMulti[]> => {
  const endDate = new Date()
  const startDate = new Date(endDate)
  startDate.setDate(endDate.getDate() - 7)

  const startYmd = toLocalYMD(startDate)
  const endYmd = toLocalYMD(endDate)

  const rows = await getMarcajesRange(startYmd, endYmd)

  // Indexar por YYYY-MM-DD
  const byYmd: Record<string, { ins: string[]; lastOut: string }> = {}

  for (const r of rows) {
    const ymd = (r.FECHA || "").slice(0, 10)
    if (!ymd) continue

    const tipo = normalizeTipo(extractRawTipo(r))
    const hhmm = toHHMM(r.HORA)

    if (!byYmd[ymd]) byYmd[ymd] = { ins: [], lastOut: "" }

    if (tipo === "IN" && hhmm) {
      byYmd[ymd].ins.push(hhmm)
    } else if (tipo === "OUT" && hhmm) {
      // sobrescribe siempre: el último OUT recibido gana (último marcado)
      byYmd[ymd].lastOut = hhmm
    }
  }

  // Construir lista cronológica desde hace 7 días hasta hoy (8 filas)
  const result: DayEntryMulti[] = []
  const d = new Date(startDate)
  for (let i = 0; i < 8; i++) {
    const ymd = toLocalYMD(d)
    const ins = (byYmd[ymd]?.ins ?? []).sort() // solo INs ordenados para visual
    const lastOut = byYmd[ymd]?.lastOut ?? ""

    result.push({
      day: dayLabelEs(d),
      checkIns: ins,
      lastCheckOut: lastOut,
    })

    d.setDate(d.getDate() + 1)
  }

  return result
}

// Mantengo también la versión “simple” por compatibilidad
export interface DayEntrySimple {
  day: string
  checkIn: string
  checkOut: string
}
export const getAttendanceLast8Days = async (): Promise<DayEntrySimple[]> => {
  const raw = await getAttendanceLast8DaysAllIns()
  return raw.map(r => ({
    day: r.day,
    checkIn: r.checkIns[0] ?? "",
    checkOut: r.lastCheckOut ?? "",
  }))
}
