import { jwt } from '@elysiajs/jwt'

export const jwtconfig = jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'default',
    sub: 'auth',
    iss: process.env.APP_URL || 'example.com',
    exp: '7d',
})

/**
 * Fungsi untuk generate access token
 */
export const generateToken = async (jwt: any, payload: any) => {
    return await jwt.sign(payload, {
        sub: 'auth',
        exp: '7d', // bisa juga pakai process.env.JWT_EXPIRES_IN
    })
}

/**
 * Fungsi untuk generate refresh token
 */
export const generateRefreshToken = async (jwt: any, payload: any) => {
    return await jwt.sign(payload, {
        sub: 'refresh',
        exp: '30d', // biasanya refresh token lebih panjang
    })
}