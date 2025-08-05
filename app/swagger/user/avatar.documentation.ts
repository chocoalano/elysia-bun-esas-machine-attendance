import { t } from 'elysia';

export function avatarDocumentation() {
  return {
    tags: ['Data Users (Pengguna)'],
    summary: 'Upload avatar pengguna',
    description: `
Endpoint ini digunakan untuk memperbaharui avatar data pengguna ke dalam sistem.

### Permintaan:
- Gunakan multipart/form-data.
- Sertakan file avatar dengan field \`image\`.

### Respons Sukses (200):
- Informasi avatar pengguna yang berhasil diperbarui.

### Autentikasi Selanjutnya:
- Gunakan header \`Authorization: Bearer <token>\` untuk autentikasi.
`.trim(),
    body: t.Object({
      image: t.File({
        type: ['image/png', 'image/jpeg'],
        description: 'Avatar image file',
        maxSize: 5 * 1024 * 1024, // Optional: 5MB limit
      }),
    }),
    responses: {
      200: {
        description: 'Berhasil upload avatar',
        content: {
          'application/json': {
            schema: t.Object({
              success: t.Boolean(),
              message: t.String(),
              url: t.String(),
            }),
            examples: {
              success: {
                value: {
                  success: true,
                  message: 'Avatar uploaded successfully',
                  url: `https://${process.env.SPACES_BUCKET!}.sgp1.digitaloceanspaces.com/uploads/filename.png`,
                },
              },
            },
          },
        },
      },
    },
  };
}
