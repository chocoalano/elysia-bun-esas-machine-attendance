// src/router/attmachine.router.ts

import { Elysia } from 'elysia';
import { AttmachineController } from '../controllers/attmachine.controller';
import { formQrDocumentation } from '../swagger/attmachine/Qr/form.documentation';
import { formQrSubmitDocumentation } from '../swagger/attmachine/Qr/form-submnit.documentation';
import { FormFacePayload, FormFaceSubmitPayload, FormQRPayload, FormQRSubmitPayload, FormQRSubmitPresencePayload } from '../types/attmachine/form.type';
import { formFaceDocumentation } from '../swagger/attmachine/Face/form.documentation';
import { formFaceSubmitDocumentation } from '../swagger/attmachine/Face/form-submnit.documentation';
import { onErrorHandler } from '../utils/validator/onerror';
import { QrAttendanceDocumentation } from '../swagger/attmachine/Qr/qr-attendance.documentation';

export const attmachineRoute = new Elysia({ prefix: '/attmachine' })
  .onError(onErrorHandler)
  .get('/qr-form', async ({ query }) => await AttmachineController.qr_form(query), {
    query: FormQRPayload,
    detail: formQrDocumentation(),
  })
  .post('/qr-form', async ({ body }) => await AttmachineController.qr_submit(body), {
    body: FormQRSubmitPayload,
    detail: formQrSubmitDocumentation(),
  })
  .post('/qr-presence', async ({ body }) => await AttmachineController.qr_presence(body), {
    body: FormQRSubmitPresencePayload,
    detail: QrAttendanceDocumentation(),
  })
  .get('/face-form', async ({ query }) => await AttmachineController.face_form(query), {
    query: FormFacePayload,
    detail: formFaceDocumentation(),
  })
  .post('/face-form', async ({ body }) => await AttmachineController.face_submit(body), {
    body: FormFaceSubmitPayload,
    detail: formFaceSubmitDocumentation(),
  });
