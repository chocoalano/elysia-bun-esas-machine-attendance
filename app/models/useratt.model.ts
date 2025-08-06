import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const AttendanceModel = {
    attendance_in: (
        user_id: number,
        time_id: number,
        lat: number,
        long: number,
        image_url: string,
        time: string
    ) =>
        prisma.$executeRawUnsafe(
            `CALL UpdateAttendanceIn(?, ?, ?, ?, ?, ?)`,
            user_id,
            time_id,
            lat,
            long,
            image_url,
            time,
        ),

    attendance_out: (
        user_id: number,
        time_id: number,
        lat: number,
        long: number,
        image_url: string,
        time: string
    ) =>
        prisma.$executeRawUnsafe(
            `CALL UpdateAttendanceOut(?, ?, ?, ?, ?, ?)`,
            user_id,
            time_id,
            lat,
            long,
            image_url,
            time,
        ),
};
