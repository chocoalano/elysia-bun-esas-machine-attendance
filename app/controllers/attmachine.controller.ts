// src/controllers/attmachine.controller.ts

import { CompanyModel } from "../models/company.model";
import { DepartementModel } from "../models/departement.model";
import { QrPresenceModel } from "../models/qrpresence.model";
import { TimeworkModel } from "../models/timework.model";
import { UserModel } from "../models/user.model";
import { AttendanceModel } from "../models/useratt.model";
import { Prisma } from '@prisma/client';

import type { FormFacePayload, FormFaceSubmitPayload, FormQRPayload, FormQRSubmitPayload } from "../types/attmachine/form.type";
import { normalizeData, randomNumbersByDatetime, response, uploadToSpace } from "../utils/supports";

export const AttmachineController = {
    qr_form: async (query: typeof FormQRPayload.static) => {
        const { company_id, departement_id } = query;

        const [company, departement, timework] = await Promise.all([
            CompanyModel.all(),
            company_id != null ? DepartementModel.findBy(company_id) : DepartementModel.all(),
            (company_id != null && departement_id != null) ? TimeworkModel.findBy(company_id, departement_id) : TimeworkModel.all(),
        ]);

        return response(
            true,
            'List data form QR dimuat',
            normalizeData({
                company: company,
                departement: departement,
                shifts: timework,
                types: [
                    {
                        name: "Masuk",
                        value: "in"
                    },
                    {
                        name: "Pulang",
                        value: "out"
                    }
                ]
            }),
            200
        );
    },

    qr_submit: async (data: typeof FormQRSubmitPayload.static) => {
        const save = await QrPresenceModel.create(data)
        console.log(save);
        
        return response(true, 'QR Code berhasil dibuat', save, 200);
    },

    face_form: async (query: typeof FormFacePayload.static) => {
        const { company_id, departement_id } = query;

        const [company, departement, timework, users] = await Promise.all([
            CompanyModel.all(),
            company_id != null ? DepartementModel.findBy(company_id) : DepartementModel.all(),
            (company_id != null && departement_id != null) ? TimeworkModel.findBy(company_id, departement_id) : TimeworkModel.all(),
            (company_id != null && departement_id != null) ? UserModel.findByCompanyDept(company_id, departement_id) : UserModel.all(),
        ]);

        return response(
            true,
            'List data form Face Detector dimuat',
            normalizeData({
                company: company,
                departement: departement,
                shifts: timework,
                users: users,
                types: [
                    {
                        name: "Masuk",
                        value: "in"
                    },
                    {
                        name: "Pulang",
                        value: "out"
                    }
                ]
            }),
            200
        );
    },

    face_submit: async (data: typeof FormFaceSubmitPayload.static) => {
        // 1) Validasi input dasar
        const file = data.image
        if (!(file instanceof File) || file.size === 0) {
            return response(false, 'File tidak valid', {}, 400)
        }

        const userId = Number(data.user_id)
        const timeId = Number(data.time_id)
        const lat = Number(data.lat)
        const lng = Number(data.long)
        const when = data.time

        if (!Number.isFinite(userId) || !Number.isFinite(timeId)) {
            return response(false, 'Parameter tidak valid', {}, 422)
        }
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
            return response(false, 'Koordinat tidak valid', {}, 422)
        }
        // 2) Pastikan user ada
        const user = await UserModel.find(userId)
        if (!user) {
            return response(false, 'Pengguna tidak ditemukan', {}, 404)
        }

        try {
            if (data.type === 'in') {
                // 3) Cek sudah absen masuk hari ini? (ARRAY → cek length)
                const today = await AttendanceModel.getTodayAttendance(userId)
                if (Array.isArray(today) ? today.length > 0 : !!today) {
                    // sudah ada check-in
                    return response(false, 'Anda sudah melakukan absensi masuk untuk hari ini', {}, 409)
                }
                console.log(today);

                // 4) Baru upload & simpan bila lolos validasi
                const fileName = `${user.nip}-${randomNumbersByDatetime()}.jpg`
                const imageUrl = await uploadToSpace('attendances', file, fileName)

                await AttendanceModel.attendance_in(
                    userId, timeId, lat, lng, imageUrl, when
                )

                return response(true, 'Absensi masuk berhasil', {}, 201)
            }
            const fileName = `${user.nip}-${randomNumbersByDatetime()}.jpg`
            const imageUrl = await uploadToSpace('attendances', file, fileName)

            await AttendanceModel.attendance_out(
                userId, timeId, lat, lng, imageUrl, when
            )

            return response(true, 'Absensi keluar berhasil', {}, 200)
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return response(false, 'Terjadi kesalahan basis data', { code: error.code, meta: error.meta }, 400)
            }
            return response(false, 'Gagal menjalankan absensi', {}, 500)
        }
    }

};