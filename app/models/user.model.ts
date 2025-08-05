import { PrismaClient } from '@prisma/client';
import type { UserPayload } from '../types/users/users.type';

const prisma = new PrismaClient();
type UserInput = typeof UserPayload.static;

export const UserModel = {
    all: () => prisma.users.findMany(),

    findbynip: (nip: string) => prisma.users.findUnique({
        where: {
            nip,
            status: 'active'
        }
    }),

    find: (id: number) => prisma.users.findUnique({ where: { id } }),
    
    findByCompanyDept: (company_id: number, departement_id: number) => prisma.users.findMany({
        where: {
            company_id: company_id,
            user_employes: {
                some: {
                    departement_id: departement_id,
                },
            },
        },
    }),

    create: (data: UserInput) => prisma.users.create({
        data: {
            company_id: data.company_id,
            name: data.name,
            nip: data.nip,
            email: data.email,
            email_verified_at: data.email_verified_at ?? null,
            password: data.password,
            status: data.status,
            remember_token: data.remember_token ?? null,
            device_id: data.device_id ?? null,
            avatar: 'avatars/avatar.png', // tambahkan ini jika avatar opsional
        },
    }),

    update: (id: number, data: Partial<UserInput>) => prisma.users.update({
        where: { id },
        data: {
            company_id: data.company_id,
            name: data.name,
            nip: data.nip,
            email: data.email,
            email_verified_at: data.email_verified_at,
            password: data.password,
            status: data.status,
            remember_token: data.remember_token,
            device_id: data.device_id,
            avatar: (data as any).avatar, // optional jika ingin diupdate
        },
    }),

    delete: (id: number) => prisma.users.delete({ where: { id } }),

    paginate: (skip: number, take: number) => prisma.users.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
    }),

    count: () => prisma.users.count(),

    avatar: (id: number, avatarUrl: string) => prisma.users.update({
        where: { id },
        data: { avatar: avatarUrl },
    }),
};
