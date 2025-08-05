import { t } from 'elysia';
export function listDocumentation() {
  return {
    tags: ['Data Users (Pengguna)'],
    summary: 'Daftar Pengguna',
    description: `
Endpoint ini digunakan untuk mengambil daftar data pengguna dari sistem.

### Autentikasi:
- Wajib menggunakan token JWT yang dikirim melalui header:
\`Authorization: Bearer <token>\`

### Parameter Query:
- \`page\` (opsional, default: \`1\`): Halaman data yang diminta.
- \`limit\` (opsional, default: \`10\`): Jumlah data per halaman.

### Respons Sukses (200):
- Menyediakan data pengguna dalam array beserta informasi paginasi.
    `.trim(),
    responses: {
      200: {
        description: 'Data pengguna berhasil diambil.',
        content: {
          'application/json': {
            examples: {
              success: {
                value: {
                  data: [
                    {
                      id: '207',
                      company_id: '2',
                      name: 'M NAFIS SYAFUDIN',
                      nip: '24020230',
                      email: 'napissyapudin@gmail.com',
                      email_verified_at: null,
                      avatar: 'avatar-users/24020230.png',
                      status: 'active',
                      device_id: null,
                      created_at: '2025-02-28 17:26:08',
                      updated_at: '2025-04-21 10:24:59',
                    },
                  ],
                  meta: {
                    total: 193,
                    page: 1,
                    limit: 10,
                    last_page: 20,
                  },
                },
              },
            },
          },
        },
      },
      401: {
        description: 'Token JWT tidak valid atau tidak dikirim.',
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
                  message: 'Unauthorized: token tidak valid.',
                },
              },
            },
          },
        },
      },
    },
  };
}
