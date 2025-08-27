import { PrismaClient } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

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

  async getTodayAttendance(userId: number) {
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    return prisma.user_attendances.findMany({
      where: {
        user_id: userId,
        time_in: { not: null },
        type_in: { not: null },
        created_at: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });
  },

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
