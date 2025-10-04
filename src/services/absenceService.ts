// src/services/absenceService.ts
import { fetchJson } from '@utils/apiClient'

export type AusenciaTipo =
    | 'Médico'
    | 'Personal'
    | 'Luto'
    | 'Matrimonio'
    | 'Maternidad/Paternidad'
    | 'Citación judicial'
    | 'Otros'

/** YYYY-MM-DD en hora local */
export const toLocalYMD = (d = new Date()): string => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

/** Mapea el “Tipo de ausencia” del select al código del backend */
export const mapAbsenceTypeToCode = (t: AusenciaTipo): string => {
    const map: Record<AusenciaTipo, string> = {
        'Médico': '01',
        'Personal': '02',
        'Luto': '03',
        'Matrimonio': '04',
        'Maternidad/Paternidad': '05',
        'Citación judicial': '06',
        'Otros': '99',
    }
    return map[t] ?? '99'
}

export type AusenciaPostBody = {
    CODIGO_MOT: string
    FECHA_SOLICITUD: string
    FECHA_AUSENTE_I_SOL: string
    FECHA_AUSENTE_F_SOL: string
    OBSERVACIONES: string
    TIPO_SOLICITUD: 'P'
    USUARIO_GENERO: string
}

/**
 * POST oficial v2: /v2/AUSENCIA_SOLICITUD
 * (El token lo agrega apiClient automáticamente)
 */
export const postAusenciaSolicitud = async (payload: AusenciaPostBody) => {
    console.log('📤 Enviando ausencia:', payload)
    const res = await fetchJson('/v2/AUSENCIA_SOLICITUD', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
    console.log('✅ Respuesta ausencia:', res)
    return res
}
