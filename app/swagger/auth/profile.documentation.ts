import { t } from 'elysia';

export function profileDocumentation() {
  return {
    tags: ['Autentikasi'],
    summary: 'Profil Pengguna Login',
    description: `
Endpoint ini digunakan untuk mengambil profil pengguna yang sedang login berdasarkan token JWT.

**Autentikasi:**
- Diperlukan token JWT yang valid dikirim melalui header \`Authorization: Bearer <token>\`.

**Respon Sukses (200):**
- Informasi pengguna yang sedang login akan dikembalikan.

**Respon Gagal (401):**
- Jika token tidak valid atau tidak disediakan, permintaan akan ditolak.
    `.trim(),
    responses: {
      200: {
        description: 'Berhasil mendapatkan data pengguna yang sedang login.',
        content: {
          'application/json': {
            schema: t.Object({
              success: t.Boolean(),
              message: t.String(),
              user: t.Object({
                id: t.String({ description: 'ID unik pengguna' }),
                name: t.String({ description: 'Nama lengkap pengguna' }),
                email: t.String({ format: 'email', description: 'Alamat email pengguna' }),
                nip: t.String({ description: 'Nomor Induk Pegawai pengguna' }),
              }),
            }),
            examples: {
              success: {
                value: {
                  success: true,
                  message: 'Data user login berhasil diambil.',
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
        description: 'Token tidak valid atau tidak disediakan.',
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
                  message: 'Unauthorized: Token tidak valid atau tidak ditemukan.',
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  };
}
