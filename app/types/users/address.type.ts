import { t } from 'elysia';

// Enum untuk jenis identitas
export const addressType = {
  ktp: 'ktp',
  sim: 'sim',
  passport: 'passport'
} as const;

export const AddressPayload = t.Object({
  user_id: t.BigInt(),
  identity_type: t.Enum(addressType),
  identity_numbers: t.String(),
  province: t.String(),
  city: t.String(),
  citizen_address: t.String(),
  residential_address: t.String(),
});
