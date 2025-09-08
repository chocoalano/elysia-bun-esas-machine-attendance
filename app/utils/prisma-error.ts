// utils/prisma-error.ts
import { Prisma } from '@prisma/client'

export function extractSqlSignalMessage(err: unknown): string | null {
  // Prisma P2010 sering membawa pesan MySQL di string error
  const msg = (err as any)?.message ?? ''
  // Cari pola: Message: `...`
  const m = msg.match(/Message:\s*`([^`]+)`/i)
  if (m?.[1]) return m[1].trim()
  // Beberapa versi menaruh di meta.message
  const metaMsg = (err as any)?.meta?.message
  if (typeof metaMsg === 'string' && metaMsg.trim()) return metaMsg.trim()
  return null
}

export function mapPrismaError(err: unknown): { status: number; message: string; code?: string } {
  // Error bisnis dari SP (SIGNAL SQLSTATE '45000') → P2010 / 1644
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2010') {
      const detail = extractSqlSignalMessage(err) || 'Kesalahan bisnis dari database'
      return { status: 400, message: detail, code: err.code }
    }
    // Beberapa kode umum lain (opsional)
    if (err.code === 'P2028') return { status: 408, message: 'Transaksi kedaluwarsa/timeout', code: err.code }
    if (err.code === 'P2002') return { status: 409, message: 'Data duplikat (unique constraint)', code: err.code }
    if (err.code === 'P1001') return { status: 503, message: 'Tidak bisa konek ke database', code: err.code }
    return { status: 500, message: `Prisma error ${err.code}`, code: err.code }
  }

  // MySQL2 / driver error (opsional)
  const sqlState = (err as any)?.sqlState || (err as any)?.code
  if (sqlState === '45000') {
    const detail = extractSqlSignalMessage(err) || 'Kesalahan bisnis dari database'
    return { status: 400, message: detail }
  }

  // Fallback
  return { status: 500, message: 'Terjadi kesalahan internal' }
}
