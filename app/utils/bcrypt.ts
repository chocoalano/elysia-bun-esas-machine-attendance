import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 12;

export const hash = async (value: string): Promise<string> => {
    const stringhash = await bcrypt.hash(value, SALT_ROUNDS);
    return await passReplace2yTo2b(stringhash)
};
export const compare = async (value1: string, value2: string): Promise<boolean> => {
    const hashFromLaravel = await passReplace2yTo2b(value2);
    return await bcrypt.compare(value1, hashFromLaravel)
};
export const passReplace2yTo2b = async (value: string): Promise<string> => {
    return value.replace('$2y$', '$2b$')
};