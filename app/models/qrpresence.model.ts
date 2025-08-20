import { PrismaClient } from '@prisma/client';
import type { FormQRSubmitPayload } from '../types/attmachine/form.type';
import { hash } from 'bcrypt';
import { formatDateNow, timeAfterNow } from '../utils/supports';

const prisma = new PrismaClient();
type QrPresenceInput = typeof FormQRSubmitPayload.static;

export const QrPresenceModel = {
    all: () => prisma.qr_presences.findMany(),

    find: (id: number) => prisma.qr_presences.findUnique({ where: { id } }),

    create: async (data: QrPresenceInput) => prisma.qr_presences.create({
        data: {
            token: await hash(new Date().toString(), 12),
            type: data.type,
            departement_id: data.departement_id,
            timework_id: data.shift_id,
            for_presence: formatDateNow(),
            expires_at: timeAfterNow(10),
            created_at: formatDateNow(),
            updated_at: formatDateNow(),
        },
    }),

    update: async (id: number, data: Partial<QrPresenceInput>) => prisma.qr_presences.update({
        where: { id },
        data: {
            token: await hash(new Date().toString(), 12),
            type: data.type,
            departement_id: data.departement_id,
            timework_id: data.shift_id,
            for_presence: formatDateNow(),
            expires_at: timeAfterNow(10),
            updated_at: formatDateNow(),
        },
    }),

    delete: (id: number) => prisma.qr_presences.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.qr_presences.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.qr_presences.count(),
};
