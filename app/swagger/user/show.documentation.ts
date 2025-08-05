import { t } from 'elysia';

export function showDocumentation() {
  return {
    tags: ['Data Users (Pengguna)'],
    summary: 'Lihat data Pengguna',
    description: `
Endpoint ini digunakan untuk mengambil detail data pengguna dari sistem.

### Autentikasi:
- Wajib menggunakan token JWT yang dikirim melalui header:
\`Authorization: Bearer <token>\`

### Parameter Query:
- \`id\` (default: \`1\`): Halaman data yang diminta.

### Respons Sukses (200):
- Menyediakan data pengguna dalam object informasi detail data.
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
