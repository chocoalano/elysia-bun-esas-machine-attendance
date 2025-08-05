import { UserModel } from '../models/user.model';
import type { UserLoginPayload } from "../types/users/users.type";
import { compare } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';
import { normalizeData, response } from '../utils/supports';

type UserInput = typeof UserLoginPayload.static;

export const AuthController = {
    login: async (jwt: any, data: UserInput) => {
        try {
            const user = await UserModel.findbynip(data.nip);
            if (!user) {
                return response(false, 'Akun tidak dikenal', data, 401)
            }
            const isPasswordValid = await compare(data.password, user.password)
            if (!isPasswordValid) {
                return response(false, 'Password tidak salah', data, 401)
            }
            const token = await generateToken(jwt, normalizeData(user))
            const { password, remember_token, ...safeUser } = user;
            return response(true, 'Login berhasil', { token, user: normalizeData({ ...safeUser }) }, 200)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },
    profile: async (auth: any) => {
        try {
            const { password, remember_token, ...safeUser } = auth;
            return response(true, 'Data profil berhasil dimuat', normalizeData({ ...safeUser }), 200)
        } catch (error) {
            return response(false, 'Terjadi kesalahan server', {}, 500)
        }
    },
};