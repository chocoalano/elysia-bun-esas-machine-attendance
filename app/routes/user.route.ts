import { Elysia, t } from 'elysia';
import { UserPayload, PaginationQuerySchema } from '../types/users/users.type';
import { UserController } from '../controllers/user.controller';
import { listDocumentation } from '../swagger/user/list.documentation';
import { addDocumentation } from '../swagger/user/add.documentation';
import { showDocumentation } from '../swagger/user/show.documentation';
import { putDocumentation } from '../swagger/user/put.documentation';
import { deleteDocumentation } from '../swagger/user/delete.documentation';
import { auth } from '../middlewares/auth';
import { avatarDocumentation } from '../swagger/user/avatar.documentation';

export const userRoutes = new Elysia({ prefix: '/users' })
  .post('/avatar/:id', async ({ params, body }) => await UserController.avatar(params.id, body), {
    params: t.Object({ id: t.Number() }),
    body: t.Object({file: t.File({ format : 'image/*' }) }),
    detail: avatarDocumentation()
  })
  .use(auth)
  .get('/', async ({ query }) => await UserController.index(query), {
    query: PaginationQuerySchema,
    detail: listDocumentation(),
  })
  .get('/:id', async ({ params }) => await UserController.show(params.id), {
    params: t.Object({ id: t.Number() }),
    detail: showDocumentation(),
  })
  .post('/', async ({ body }) => await UserController.store(body), {
    body: UserPayload,
    detail: addDocumentation()
  })
  .put('/:id', async ({ params, body }) => await UserController.update(params.id, body), {
    params: t.Object({ id: t.Number() }),
    body: UserPayload,
    detail: putDocumentation(),
  })
  .delete('/:id', async ({ params }) => await UserController.destroy(params.id), {
    params: t.Object({ id: t.Number() }),
    detail: deleteDocumentation(),
  });
