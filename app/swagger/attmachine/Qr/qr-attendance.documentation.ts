import { t } from 'elysia';

export function QrAttendanceDocumentation() {
  return {
    tags: ['Attendance Machine'],
    summary: 'Mengirim data in/out absensi',
    description: `
Endpoint ini digunakan oleh mobile aplikasi untuk mengirimkan data absensi ke server.

### Body Permintaan (Request Body):
- **user_id**: ID pengguna yang dipilih (tipe BigInt).
- **token_id**: ID token dari hasil generate yang telah dilakukan sebelumnya pada mesin absensi yang dipilih (tipe BigInt).
- **type**: Jenis absensi, hanya bisa 'in' atau 'out'.

### Respons Sukses (200):
- **data**: Objek berisi data absensi QR yang berhasil dibuat.
- **message**: Pesan sukses.

### Respons Error:
- **400 Bad Request**: Jika data di body permintaan tidak valid atau ada yang hilang.
- **500 Internal Server Error**: Jika terjadi kesalahan tak terduga di server.
`.trim(),
    body: t.Object({
      user_id: t.BigInt(),
      token_id: t.BigInt(),
      type: t.Enum({ in: 'in', out: 'out' }),
    }),
    response: {
      200: t.Object({
        success: t.Boolean(),
        message: t.String(),
        data: t.Object({
          id: t.String(),
          type: t.String(),
          departement_id: t.String(),
          timework_id: t.String(),
          token: t.String(),
          for_presence: t.String(),
          expires_at: t.String(),
          created_at: t.Nullable(t.String()),
          updated_at: t.Nullable(t.String()),
        }),
      }),
    },
  };
}