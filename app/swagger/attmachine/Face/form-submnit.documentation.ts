import { t } from 'elysia';
import { FormFaceSubmitPayload } from '../../../types/attmachine/form.type';

export function formFaceSubmitDocumentation() {
  return {
    tags: ['Attendance Face Machine'],
    summary: 'Mengirim data formulir face detector absensi',
    description: `
Endpoint ini digunakan oleh mesin absensi untuk mengirimkan detail absensi
dan membuat kode QR unik.

### Body Permintaan (Request Body):
- **company_id**: ID perusahaan yang dipilih (tipe BigInt).
- **departement_id**: ID departemen yang dipilih (tipe BigInt).
- **shift_id**: ID shift/timework yang dipilih (tipe BigInt).
- **type**: Jenis absensi, hanya bisa 'in' atau 'out'.
- **image**: File gambar (wajah).

### Respons Sukses (200):
- **data**: Objek berisi data absensi QR yang berhasil dibuat.
- **message**: Pesan sukses.

### Respons Error:
- **400 Bad Request**: Jika data di body permintaan tidak valid atau ada yang hilang.
- **500 Internal Server Error**: Jika terjadi kesalahan tak terduga di server.
`.trim(),
    consumes: ['multipart/form-data'],
    body: FormFaceSubmitPayload,

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
