import { t } from "elysia";

export const FormQRPayload = t.Object({
  company_id: t.Optional(t.Number()),
  departement_id: t.Optional(t.Number()),
});

export const FormQRSubmitPayload = t.Object({
  company_id: t.Number(),
  departement_id: t.Number(),
  shift_id: t.Number(),
  type: t.Enum({
    in: 'in',
    out: 'out',
  }),
});
export const FormFacePayload = t.Object({
  company_id: t.Optional(t.Number()),
  departement_id: t.Optional(t.Number()),
  timework_id: t.Optional(t.Number()),
});

export const FormFaceSubmitPayload = t.Object({
  time_id: t.String(),
  time: t.String(),
  lat: t.String(),
  long: t.String(),
  type: t.Enum({
    in: 'in',
    out: 'out',
  }),
  image: t.File({ format: 'image/*' }),
  user_id: t.String(),
  company_id: t.String(),
  departement_id: t.String(),
});
export const FormFaceSubmitDataPayload = t.Object({
  time_id: t.Number(),
  time: t.String(),
  lat: t.Number(),
  long: t.Number(),
  type: t.Enum({
    in: 'in',
    out: 'out',
  }),
  image: t.String(),
  user_id: t.Number(),
});