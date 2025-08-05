// libs/s3.ts
import { S3Client } from '@aws-sdk/client-s3'

export const s3 = new S3Client({
  region: process.env.SPACES_REGION ?? 'sgp1',
  endpoint: process.env.SPACES_ENDPOINT ?? 'https://sgp1.digitaloceanspaces.com',
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
})
