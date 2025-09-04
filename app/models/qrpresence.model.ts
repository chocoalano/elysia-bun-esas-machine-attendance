import { PrismaClient } from '@prisma/client';
import type { FormQRSubmitPayload } from '../types/attmachine/form.type';
import { hash } from 'bcrypt';
import { formatDate, formatDateNow, timeAfterNow } from '../utils/supports';

const prisma = new PrismaClient();
type QrPresenceInput = typeof FormQRSubmitPayload.static;

export const QrPresenceModel = {
    all: () => prisma.qr_presences.findMany(),

    find: (id: number) => prisma.qr_presences.findUnique({ where: { id } }),

    create: async (data: QrPresenceInput) => {
        const token = await hash(formatDateNow().toString(), 12)
        const inserted = await prisma.$transaction(
            async (tx) => {
                await tx.$executeRaw`
                CALL InsertQrPresence(
                    ${data.type},
                    ${data.departement_id},
                    ${data.shift_id},
                    ${token}
                )`
                // Ambil baris terbaru untuk token ini
                const [row] = await tx.$queryRaw<Array<{
                    id: number
                    type: string
                    departement_id: number
                    timework_id: number
                    token: string
                    for_presence: string | null
                    expires_at: string | null
                    created_at: string
                    updated_at: string
                }>>`
                    SELECT
                        id, type, departement_id, timework_id, token,
                        DATE_FORMAT(for_presence, '%Y-%m-%d %H:%i:%s') AS for_presence,
                        DATE_FORMAT(expires_at,   '%Y-%m-%d %H:%i:%s') AS expires_at,
                        DATE_FORMAT(created_at,   '%Y-%m-%d %H:%i:%s') AS created_at,
                        DATE_FORMAT(updated_at,   '%Y-%m-%d %H:%i:%s') AS updated_at
                    FROM \`qr_presences\`
                    WHERE token = ${token}
                    ORDER BY id DESC
                    LIMIT 1
                    `;

                if (!row) throw new Error('Gagal mengambil data QR yang baru dibuat')
                return row;
            }
        )
        return inserted
    },

    update: async (id: number, data: Partial<QrPresenceInput>) => {
        const token = await hash(formatDateNow().toString(), 12)
        await prisma.$executeRaw`
            UPDATE qr_presences SET 
            type=${data.type},
            departement_id=${data.departement_id},
            timework_id=${data.shift_id},
            token=${token},
            for_presence=${formatDateNow()},
            expires_at=${timeAfterNow(10)},
            updated_at=${formatDateNow()} 
            WHERE id=${id}
        )`;
        const rows = await prisma.$queryRaw<
            Array<{
                id: bigint;
                type: string;
                departement_id: bigint;
                timework_id: bigint;
                token: string;
                for_presence: string;
                expires_at: string;
                created_at: string;
                updated_at: string;
            }>
        >`
            SELECT
            id,
            type,
            departement_id,
            timework_id,
            token,
            DATE_FORMAT(for_presence, '%Y-%m-%d %H:%i:%s') AS for_presence,
            DATE_FORMAT(expires_at,  '%Y-%m-%d %H:%i:%s') AS expires_at,
            DATE_FORMAT(created_at,  '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(updated_at,  '%Y-%m-%d %H:%i:%s') AS updated_at
            FROM qr_presences
            WHERE id = ${id}
            LIMIT 1
        `;

        return rows[0] ?? null;
    },

    delete: (id: number) => prisma.qr_presences.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.qr_presences.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.qr_presences.count(),
};

