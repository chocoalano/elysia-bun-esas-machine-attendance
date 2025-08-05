import { t } from 'elysia';

export function formFaceDocumentation() {
  return {
    tags: ['Attendance Face Machine'],
    summary: 'Mendapatkan data formulir face detector absensi berdasarkan pilihan',
    description: `
Endpoint ini digunakan oleh mesin absensi untuk mendapatkan data form yang
diperlukan untuk absensi QR code.

Endpoint ini akan mengambil daftar departemen, shift, dan data terkait lainnya
berdasarkan ID perusahaan, departemen, atau shift yang dipilih.

### Permintaan (Request):
- Pengguna dapat memberikan **company_id**, **departement_id**, dan **timework_id**
  sebagai parameter query. Semua parameter bersifat opsional.

### Respons Sukses (200):
- **data**: Objek yang berisi detail formulir absensi yang diperlukan.
- **message**: Pesan sukses.

### Respons Error:
- **400 Bad Request**: Jika parameter query yang diberikan tidak valid.
- **500 Internal Server Error**: Jika terjadi kesalahan tak terduga di server.
`.trim(),
    query: t.Object({
      company_id: t.Optional(t.BigInt({
        description: 'ID perusahaan yang dipilih.',
      })),
      departement_id: t.Optional(t.BigInt({
        description: 'ID departemen yang dipilih.',
      })),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        message: t.String(),
        data: t.Object({
          company: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            latitude: t.Nullable(t.String()),
            longitude: t.Nullable(t.String()),
            radius: t.Nullable(t.String()),
            full_address: t.Nullable(t.String()),
            created_at: t.Nullable(t.String()),
            updated_at: t.Nullable(t.String()),
          })),
          departement: t.Array(t.Object({
            id: t.String(),
            company_id: t.String(),
            name: t.String(),
            created_at: t.Nullable(t.String()),
            updated_at: t.Nullable(t.String()),
          })),
          shifts: t.Array(t.Object({
            id: t.String(),
            company_id: t.String(),
            departemen_id: t.String(),
            name: t.String(),
            in: t.String(),
            out: t.String(),
            created_at: t.Nullable(t.String()),
            updated_at: t.Nullable(t.String()),
          })),
          users: t.Array(t.Object({
            id: t.Number(),
            company_id: t.Number(),
            name: t.String(),
            nip: t.String(),
            email: t.String(),
            email_verified_at: t.Nullable(t.String()),
            password: t.Nullable(t.String()),
            avatar: t.Nullable(t.String()),
            status: t.Nullable(t.String()),
            remember_token: t.Nullable(t.String()),
            device_id: t.Nullable(t.String()),
            created_at: t.Nullable(t.String()),
            updated_at: t.Nullable(t.String())
          })),
          types: t.Array(t.Object({
            name: t.String(),
            value: t.String(),
          })),
        }),
      }),
    },
  };
}