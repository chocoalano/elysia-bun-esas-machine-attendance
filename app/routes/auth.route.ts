import { Elysia, t } from 'elysia';
import { AuthController } from '../controllers/auth.controller';
import { UserLoginPayload } from '../types/users/users.type';
import { jwtconfig } from '../utils/jwt';
import { auth } from '../middlewares/auth';
import { loginDocumentation } from '../swagger/auth/login.documentation';
import { profileDocumentation } from '../swagger/auth/profile.documentation';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwtconfig)

  // LOGIN
  .post('/login', async ({ jwt, body }) => await AuthController.login(jwt, body), {
    body: UserLoginPayload,
    detail: loginDocumentation(),
  })

  // PROFILE
  .use(auth)
  .get('/profile', async ({ user }) => await AuthController.profile(user), {
    detail: profileDocumentation(),
  });
