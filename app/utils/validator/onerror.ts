import { response } from "../supports"
import { ValidationFormatter } from "./validation"

export const onErrorHandler = ({ code, error, set, request }: any) => {
  // console.error supaya tetap tercatat di log server
  if (code !== 'VALIDATION') {
    console.error('❌ onError:', { code, message: error?.message, stack: error?.stack })
  }

  // 422 — payload/query/body tidak lolos schema
  if (code === 'VALIDATION') {
    set.status = 422
    return response(
      false,
      'Validation failed',
      ValidationFormatter.toArr(error, { locale: 'id' }),
      422
    )
  }

  // 404 — route tidak ditemukan
  if (code === 'NOT_FOUND') {
    set.status = 404
    return response(
      false,
      'Endpoint tidak ditemukan',
      { path: (() => { try { return new URL(request?.url ?? '').pathname } catch { return undefined } })() },
      404
    )
  }

  if (code === 'P2010' && error?.message) {
    const customError = extractDbCustomError(error.message)
    
    if (customError) {
      // Menggunakan status 409 Conflict, yang cocok untuk batasan bisnis (sudah absen, dll.)
      set.status = 409 
      const isProd = process.env.NODE_ENV === 'production'
      return response(
        false,
        customError.dbMessage, // Pesan yang jelas dari database: "Aturan absensi: sudah absen masuk hari ini"
        isProd ? {} : { dbCode: customError.dbCode, originalCode: code },
        409
      )
    }
  }

  // 500 — error tak terduga / fallback
  set.status = 500
  const isProd = process.env.NODE_ENV === 'production'
  return response(
    false,
    'Terjadi kesalahan pada server',
    isProd
      ? {} // jangan expose detail di production
      : {
          code: code ?? 'INTERNAL_ERROR',
          message: error?.message,
          stack: error?.stack,
        },
    500
  )
}

const extractDbCustomError = (message: string) => {
  const match = message.match(/Raw query failed\. Code: `(\d+)`\. Message: `([^`]+)`/)
  if (match && match[1] && match[2]) {
    return {
      dbCode: match[1],
      dbMessage: match[2],
    }
  }
  return null
}
