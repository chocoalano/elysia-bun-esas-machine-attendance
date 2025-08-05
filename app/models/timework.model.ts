import { PrismaClient } from '@prisma/client';
import type { TimeWorkes } from '../types/type';

const prisma = new PrismaClient();
type TimeworkInput = typeof TimeWorkes.static;

export const TimeworkModel = {
    all: () => prisma.time_workes.findMany(),

    find: (id: number) => prisma.time_workes.findUnique({ where: { id } }),

    findBy: (company_id: number, departemen_id: number) => prisma.time_workes.findMany({
        where: {
            company_id,
            departemen_id
        }
    }),

    create: (data: TimeworkInput) => prisma.time_workes.create({
        data: {
            company_id: data.company_id,
            departemen_id: data.departemen_id,
            name: data.name,
            in: data.in,
            out: data.out,
        },
    }),

    update: (id: number, data: Partial<TimeworkInput>) => prisma.time_workes.update({
        where: { id },
        data: {
            company_id: data.company_id,
            departemen_id: data.departemen_id,
            name: data.name,
            in: data.in,
            out: data.out,
        },
    }),

    delete: (id: number) => prisma.time_workes.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.time_workes.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.time_workes.count(),
};
