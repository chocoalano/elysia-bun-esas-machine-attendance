// src/router/attmachine.router.ts

import { Elysia, status, t } from 'elysia';
import { AttmachineController } from '../controllers/attmachine.controller';
import { formQrDocumentation } from '../swagger/attmachine/Qr/form.documentation';
import { formQrSubmitDocumentation } from '../swagger/attmachine/Qr/form-submnit.documentation';
import { FormFacePayload, FormFaceSubmitPayload, FormQRPayload, FormQRSubmitPayload } from '../types/attmachine/form.type';
import { formFaceDocumentation } from '../swagger/attmachine/Face/form.documentation';
import { formFaceSubmitDocumentation } from '../swagger/attmachine/Face/form-submnit.documentation';

export const attmachineRoute = new Elysia({ prefix: '/attmachine' })
  .get('/qr-form', async ({ query }) => await AttmachineController.qr_form(query), {
    query: FormQRPayload,
    detail: formQrDocumentation(),
  })
  .post('/qr-form', async ({ body }) => await AttmachineController.qr_submit(body), {
    body: FormQRSubmitPayload,
    detail: formQrSubmitDocumentation(),
  })
  .get('/face-form', async ({ query }) => await AttmachineController.face_form(query), {
    query: FormFacePayload,
    detail: formFaceDocumentation(),
  })
  .post('/face-form', async ({ body }) => await AttmachineController.face_submit(body), {
    body: FormFaceSubmitPayload,
    detail: formFaceSubmitDocumentation(),
  });