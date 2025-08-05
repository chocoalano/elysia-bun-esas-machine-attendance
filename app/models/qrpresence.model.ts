import { PrismaClient } from '@prisma/client';
import type { FormSubmitPayload } from '../types/attmachine/form.type';
import moment from 'moment';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();
type QrPresenceInput = typeof FormSubmitPayload.static;

export const QrPresenceModel = {
    all: () => prisma.qr_presences.findMany(),

    find: (id: number) => prisma.qr_presences.findUnique({ where: { id } }),

    create: async (data: QrPresenceInput) => prisma.qr_presences.create({
        data: {
            token: await hash(new Date().toString(), 12),
            type: data.type,
            departement_id: data.departement_id,
            timework_id: data.shift_id,
            for_presence: new Date(),
            expires_at: moment().add(10, 'seconds').toDate(),
            created_at: new Date(),
            updated_at: new Date(),
        },
    }),

    update: async (id: number, data: Partial<QrPresenceInput>) => prisma.qr_presences.update({
        where: { id },
        data: {
            token: await hash(new Date().toString(), 12),
            type: data.type,
            departement_id: data.departement_id,
            timework_id: data.shift_id,
            for_presence: new Date(),
            expires_at: moment().add(10, 'seconds').toDate(),
            updated_at: new Date(),
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
