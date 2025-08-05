import { PrismaClient } from '@prisma/client';
import type { Departements } from '../types/type';

const prisma = new PrismaClient();
type DepartementInput = typeof Departements.static;

export const DepartementModel = {
    all: () => prisma.departements.findMany(),

    find: (id: number) => prisma.departements.findUnique({ where: { id } }),

    findBy: (company_id: number) => prisma.departements.findMany({
        where: { company_id }
    }),

    create: (data: DepartementInput) => prisma.departements.create({
        data: {
            company_id: data.company_id,
            name: data.name,
        },
    }),

    update: (id: number, data: Partial<DepartementInput>) => prisma.departements.update({
        where: { id },
        data: {
            company_id: data.company_id,
            name: data.name,
        },
    }),

    delete: (id: number) => prisma.departements.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.departements.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.departements.count(),
};
