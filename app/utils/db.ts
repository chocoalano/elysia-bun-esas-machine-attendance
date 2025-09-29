// src/db.ts
import { Prisma, PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// ────────── Konfigurasi log file ──────────
const LOG_DIR = process.env.PRISMA_LOG_DIR ?? 'logs'
const LOG_NAME = process.env.PRISMA_LOG_FILE ?? 'prisma.log'
const MAX = Number(process.env.PRISMA_LOG_MAX_BYTES ?? 10 * 1024 * 1024)

const dir = path.isAbsolute(LOG_DIR) ? LOG_DIR : path.join(process.cwd(), LOG_DIR)
const file = path.join(dir, LOG_NAME)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const ts = () => new Date().toISOString()
const rotateIfNeeded = () => {
  try {
    if (fs.existsSync(file) && fs.statSync(file).size >= MAX) {
      const stamp = ts().replace(/[:.]/g, '-')
      fs.renameSync(file, path.join(dir, `${LOG_NAME.replace(/\.log$/i, '')}-${stamp}.log`))
    }
  } catch {}
}
const write = (line: string) => {
  try { rotateIfNeeded(); fs.appendFileSync(file, line) } catch {}
}

// ────────── Util error koneksi sementara ──────────
function isTransientPrismaError(err: unknown) {
  const e = err as any
  const code = e?.code as string | undefined
  const msg = String(e?.message ?? '').toLowerCase()

  if (code === 'P1001') return true // can't reach DB
  if (code === 'P1002') return true // query timeout
  if (msg.includes('etimedout')) return true
  if (msg.includes('econnreset')) return true
  if (msg.includes('read econnreset')) return true
  if (msg.includes('connection lost')) return true
  if (msg.includes('server closed the connection')) return true
  return false
}

// Retry ringan dengan exponential backoff
export async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (e) {
      lastErr = e
      if (!isTransientPrismaError(e) || i === attempts - 1) break
      const delay = 300 * 2 ** i
      await new Promise(r => setTimeout(r, delay)) // 300ms, 600ms, 1200ms
    }
  }
  throw lastErr
}

// ────────── Singleton + Hot-Swap PrismaClient ──────────
type PrismaClientCompat = PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientCompat }
let reconnecting = false
let heartbeatTimer: Timer | null = null

function attachLogListeners(client: PrismaClientCompat) {
  client.$on('error', (e: Prisma.LogEvent) => {
    write(`[${ts()}] [ERROR] ${e.message}\n`)
    // coba reconnect jika indikasi koneksi
    const lower = (e?.message ?? '').toLowerCase()
    if (lower.includes('connection') || lower.includes('timeout')) {
      void tryReconnect('log_error_event')
    }
  })
  client.$on('warn',  (e: Prisma.LogEvent) => write(`[${ts()}] [WARN]  ${e.message}\n`))
  client.$on('info',  (e: Prisma.LogEvent) => write(`[${ts()}] [INFO]  ${e.message}\n`))
  client.$on('query', (e: Prisma.QueryEvent) =>
    write(`[${ts()}] [QUERY] ${e.query} | Params:${e.params} | ${e.duration}ms\n`)
  )
}

function startHeartbeat(client: PrismaClientCompat) {
  stopHeartbeat()
  // ping tiap 30s untuk deteksi dini & menjaga koneksi tetap hangat
  heartbeatTimer = setInterval(async () => {
    try {
      // Hindari log bising: gunakan rawUnsafe agar simpel
      await client.$queryRawUnsafe('SELECT 1')
    } catch (e) {
      write(`[${ts()}] [HEARTBEAT-FAIL] ${String((e as any)?.message ?? e)}\n`)
      if (isTransientPrismaError(e)) {
        void tryReconnect('heartbeat_fail')
      }
    }
  }, 30_000) as unknown as Timer
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer as unknown as number)
    heartbeatTimer = null
  }
}

function createPrisma(): PrismaClientCompat {
  const client = new PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>({
    log: [
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'info' },
      { emit: 'event', level: 'query' }, // matikan di production bila bising
    ],
  })
  attachLogListeners(client)
  startHeartbeat(client)
  return client
}

async function tryReconnect(reason: string) {
  if (reconnecting) return
  reconnecting = true
  write(`[${ts()}] [RECONNECT] starting, reason=${reason}\n`)
  try {
    // Disconnect client lama (abaikan error)
    try { await prisma.$disconnect() } catch {}
    stopHeartbeat()

    // Buat client baru & connect
    const fresh = createPrisma()
    await fresh.$connect()

    // Hot-swap di global & export let
    globalForPrisma.prisma = fresh
    prisma = fresh

    write(`[${ts()}] [RECONNECT] success\n`)
  } catch (e) {
    write(`[${ts()}] [RECONNECT] failed :: ${(e as any)?.message ?? e}\n`)
  } finally {
    reconnecting = false
  }
}

// Inisialisasi awal singleton
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = createPrisma()
}

// gunakan let agar bisa di-hot-swap saat reconnect
export let prisma: PrismaClientCompat = globalForPrisma.prisma

// ────────── Graceful shutdown ──────────
for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, async () => {
    try { stopHeartbeat(); await prisma.$disconnect() } finally { process.exit(0) }
  })
}
