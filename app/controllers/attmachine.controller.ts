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
        return response(true, 'QR Code berhasil dibuat', normalizeData(save), 200);
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
        const file = data.image;
        if (!file || !(file instanceof File) || file.size === 0) {
            return response(false, 'File tidak valid', {}, 400);
        }
        const user = await UserModel.find(Number(data.user_id));
        if (!user) {
            return response(false, 'Pengguna tidak ditemukan', {}, 404);
        }
        const fileName = `${user.nip}-${randomNumbersByDatetime()}.jpg`;
        const imageUrl = await uploadToSpace('attendances', file, fileName);

        try {
            if (data.type === 'in') {
                await AttendanceModel.attendance_in(
                    Number(data.user_id),
                    Number(user.company_id),
                    Number(data.lat),
                    Number(data.long),
                    imageUrl,
                    data.time
                );
            } else {
                await AttendanceModel.attendance_out(
                    Number(data.user_id),
                    Number(user.company_id),
                    Number(data.lat),
                    Number(data.long),
                    imageUrl,
                    data.time
                );
            }

            return response(true, 'Absensi berhasil dibuat', {}, 200);
        } catch (error) {
            // console.error('❌ Stored Procedure Error:', error);
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return response(false, 'terjadi kesalahan', error.meta, 400);
            }
            return response(false, 'Gagal menjalankan absensi', {}, 500);
        }
    }

};