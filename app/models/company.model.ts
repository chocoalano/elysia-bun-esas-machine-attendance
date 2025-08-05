import { PrismaClient } from '@prisma/client';
import type { Companies } from '../types/type';

const prisma = new PrismaClient();
type CompanyInput = typeof Companies.static;

export const CompanyModel = {
    all: () => prisma.companies.findMany(),

    findbynip: (name: string) => prisma.companies.findUnique({
        where: {
            name
        }
    }),

    find: (id: number) => prisma.companies.findUnique({ where: { id } }),

    create: (data: CompanyInput) => prisma.companies.create({
        data: {
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
            full_address: data.full_address,
        },
    }),

    update: (id: number, data: Partial<CompanyInput>) => prisma.companies.update({
        where: { id },
        data: {
            name: data.name,
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
            full_address: data.full_address,
        },
    }),

    delete: (id: number) => prisma.companies.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.companies.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.companies.count(),
};
