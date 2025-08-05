import { t } from 'elysia';

export function loginDocumentation() {
  return {
    tags: ['Autentikasi'],
    summary: 'Login Pengguna',
    description: `
Endpoint ini digunakan untuk login pengguna ke dalam sistem.

### Permintaan:
- Pengguna harus mengirimkan **NIP** dan **kata sandi** yang valid melalui body request dalam format JSON.

### Respons Sukses (200):
- Token JWT untuk otorisasi endpoint lain.
- Informasi pengguna seperti ID, nama, email, dan NIP.

### Autentikasi Selanjutnya:
- Token JWT harus disimpan oleh client (misalnya di localStorage atau cookies) dan digunakan dalam header \`Authorization: Bearer <token>\` untuk mengakses endpoint yang memerlukan autentikasi.
    `.trim(),
    body: t.Object({
      nip: t.String({ minLength: 4, description: 'Nomor Induk Pegawai pengguna' }),
      password: t.String({ minLength: 6, description: 'Kata sandi akun pengguna' }),
    }),
    responses: {
      200: {
        description: 'Berhasil login dan mendapatkan token serta data pengguna.',
        content: {
          'application/json': {
            schema: t.Object({
              success: t.Boolean(),
              message: t.String(),
              token: t.String({ description: 'Token JWT untuk autentikasi' }),
              user: t.Object({
                id: t.String({ description: 'ID unik pengguna' }),
                name: t.String({ description: 'Nama lengkap pengguna' }),
                email: t.String({ format: 'email', description: 'Alamat email pengguna' }),
                nip: t.String({ description: 'Nomor Induk Pegawai' }),
              }),
            }),
            examples: {
              success: {
                value: {
                  success: true,
                  message: 'Login successful',
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  user: {
                    id: '1',
                    name: 'Budi Santoso',
                    email: 'budi@example.com',
                    nip: '19820301',
                  },
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
