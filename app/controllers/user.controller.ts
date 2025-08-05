import { UserModel } from '../models/user.model';
import { deleteFromSpace, formatDateTime, normalizeData, randomNumbersByDatetime, response, uploadToSpace } from '../utils/supports';
import { UserPayload, type PaginationParams } from '../types/users/users.type';
import { t } from 'elysia';
import { hash } from '../utils/bcrypt';

export const UserUpdatePayload = t.Partial(UserPayload);
type UserInput = typeof UserPayload.static;
type UserUpdateInput = typeof UserUpdatePayload.static;
const fileUpload = t.Object({ file: t.File({ format: 'image/*' }) })
type avatar = typeof fileUpload.static;

export const UserController = {
    index: async ({ page = 1, limit = 10 }: PaginationParams) => {
        try {
            const skip = (page - 1) * limit;

            const [data, total] = await Promise.all([
                UserModel.paginate(skip, limit),
                UserModel.count(),
            ]);

            const formattedData = data.map((item: any) => {
                const {
                    password,
                    remember_token,
                    created_at,
                    updated_at,
                    ...safeUser
                } = item;

                return {
                    ...safeUser,
                    created_at: formatDateTime(created_at),
                    updated_at: formatDateTime(updated_at),
                };
            });

            return response(
                true,
                'List data pengguna berhasil dimuat',
                normalizeData({
                    data: formattedData,
                    meta: {
                        total,
                        page,
                        limit,
                        last_page: Math.ceil(total / limit),
                    },
                }),
                200
            );
        } catch (error: any) {
            console.error('Error loading user data:', error);
            return response(
                false,
                'Terjadi kesalahan server',
                { message: error.message ?? 'Unknown error' },
                500
            );
        }
    },

    show: async (id: number) => {
        try {
            const user = await UserModel.find(id);
            if (!user) return null;

            const { password, remember_token, ...safeUser } = user;
            return response(true, 'Detail data pengguna berhasil dimuat', normalizeData({
                ...safeUser,
                created_at: formatDateTime(user.created_at),
                updated_at: formatDateTime(user.updated_at),
            }), 200)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },
    store: async (data: UserInput) => {
        try {
            const hashedPassword = await hash(data.password);
            const userData = {
                company_id: data.company_id,
                name: data.name,
                nip: data.nip,
                email: data.email,
                password: hashedPassword,
                status: data.status,
                device_id: data.device_id,
                email_verified_at: new Date()
            };
            const add = await UserModel.create(userData);
            return response(true, 'Tambah data pengguna berhasil', normalizeData(add), 201)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },

    update: async (id: number, data: UserUpdateInput) => {
        try {
            const userData = {
                ...(data.company_id !== undefined && { company_id: data.company_id }),
                ...(data.name && { name: data.name }),
                ...(data.nip && { nip: data.nip }),
                ...(data.email && { email: data.email }),
                ...(data.status && { status: data.status }),
                ...(data.device_id && { device_id: data.device_id }),
            };

            if (data.password) {
                const hashedPassword = await hash(data.password);
                Object.assign(userData, { password: hashedPassword });
            }

            const update = await UserModel.update(id, userData as UserInput);
            return response(true, 'Data pengguna berhasil diperbaharui', normalizeData(update), 200)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },

    destroy: async (id: number) => {
        try {
            const deleted = await UserModel.delete(id);
            return response(true, 'Data pengguna berhasil dihapus', normalizeData(deleted), 200)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },

    avatar: async (id: number, body: avatar) => {
        try {
            const file = body.file;
            if (!file || file.size === 0) {
                return response(false, 'File tidak valid', {}, 400);
            }
            const user = await UserModel.find(id);
            if (!user) return response(false, 'Pengguna tidak ditemukan', {}, 404);
            const fileName = `${user.nip}-${randomNumbersByDatetime()}.jpg`;
            if (user.avatar) {
                await deleteFromSpace(user.avatar)
            }
            const url = await uploadToSpace('avatars', file, fileName);
            const update = await UserModel.avatar(id, url);
            return response(true, 'Avatar pengguna berhasil diperbaharui', normalizeData(update), 200)
        } catch (error) {
            console.log(error);

            return response(false, 'Terjadi kesalahan server', {}, 500);
        }
    },
};
