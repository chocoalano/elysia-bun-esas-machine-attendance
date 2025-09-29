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
    await withRetry(() => prisma.$queryRawUnsafe('SELECT 1'))
    return { ok: true, db: 'healthy' }
  })
  .use(userRoutes)
  .use(authRoutes)
  .use(attmachineRoute)
  .listen(3000);

console.log('🚀 Server running at http://localhost:3000');
