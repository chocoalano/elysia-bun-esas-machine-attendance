import { t } from 'elysia';

export function putDocumentation() {
  return {
    tags: ['Data Users (Pengguna)'],
    summary: 'Perbaharui data Pengguna',
    description: `
Endpoint ini digunakan untuk menambah data pengguna ke dalam sistem.

### Permintaan:
- Pengguna harus mengirimkan **PARAMETER DATA** yang valid melalui body request dalam format JSON.

### Respons Sukses (200):
- Informasi pengguna seperti ID, nama, email, dll.

### Autentikasi Selanjutnya:
- Token JWT harus disimpan oleh client (misalnya di localStorage atau cookies) dan digunakan dalam header \`Authorization: Bearer <token>\` untuk mengakses endpoint yang memerlukan autentikasi.
    `.trim(),
    body: t.Object({
      nip: t.String({ minLength: 4, description: 'Nomor Induk Pegawai pengguna' }),
      password: t.String({ minLength: 6, description: 'Kata sandi akun pengguna' }),
    }),
    responses: {
      200: {
        description: 'Berhasil memperbaharui serta data pengguna yang telah diperbaharui akan ditampilkan.',
        content: {
          'application/json': {
            examples: {
              success: {
                value: {
                  id: "207",
                  company_id: "2",
                  name: "M NAFIS SYAFUDIN",
                  nip: "24020230",
                  email: "napissyapudin@gmail.com",
                  email_verified_at: null,
                  avatar: "avatar-users/24020230.png",
                  status: "active",
                  device_id: null,
                  created_at: "2025-02-28 17:26:08",
                  updated_at: "2025-04-21 10:24:59"
                },
              },
            },
          },
        },
      },
      401: {
        description: 'NIP atau kata sandi salah.',
        content: {
          'application/json': {
            schema: t.Object({
              success: t.Boolean(),
              message: t.String(),
            }),
            examples: {
              unauthorized: {
                value: {
                  success: false,
                  message: 'Login gagal: NIP atau kata sandi salah.',
                },
              },
            },
          },
        },
      },
    },
  };
}
