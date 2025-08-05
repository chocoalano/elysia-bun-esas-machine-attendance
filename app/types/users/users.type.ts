import { t } from 'elysia';

export const UserStatusEnum = {
    active: 'active',
    inactive: 'inactive',
} as const;

// Skema validasi UserPayload
export const UserPayload = t.Object({
    company_id: t.BigInt(),
    name: t.String(),
    nip: t.String(),
    email: t.String({ format: 'email' }),
    email_verified_at: t.Optional(t.Date()),
    password: t.String(),
    status: t.Enum(UserStatusEnum),
    remember_token: t.Optional(t.String()),
    device_id: t.Optional(t.String()),
})
// Skema validasi UserLoginPayload
export const UserLoginPayload = t.Object({
    nip: t.String(),
    password: t.String(),
});

// Schema untuk validasi query string (digunakan di route)
export const PaginationQuerySchema = t.Object({
    page: t.Optional(t.Numeric({ default: 1 })),
    limit: t.Optional(t.Numeric({ default: 10 })),
});

// Type untuk digunakan di controller sebagai input type hint
export type PaginationParams = typeof PaginationQuerySchema.static;
