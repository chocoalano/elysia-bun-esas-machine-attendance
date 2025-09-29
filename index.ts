import { Elysia } from 'elysia';
import swagger from '@elysiajs/swagger';
import { userRoutes } from './app/routes/user.route';
import { authRoutes } from './app/routes/auth.route';
import { attmachineRoute } from './app/routes/attmachine.route';
import { prisma, withRetry } from './app/utils/db';

const app = new Elysia()
  .use(swagger({
    path: '/docs',
    documentation: {
      info: {
        title: 'Esas API',
        version: '1.0.0',
      },
    },
  }))
  .get('/health/db', async () => {
    // (opsional) set zona waktu sesi
    await prisma.$executeRawUnsafe("SET time_zone = '+07:00'")
    const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now`

    if (!rows || rows.length === 0) {
      throw new Error("Query NOW() gagal")
    }
    return { ok: true, now: rows[0]!.now }
  })
  .use(userRoutes)
  .use(authRoutes)
  .use(attmachineRoute)
  .listen(3000);

console.log('🚀 Server running at http://localhost:3000');
