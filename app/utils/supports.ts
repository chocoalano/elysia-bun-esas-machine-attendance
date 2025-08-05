import moment, { now } from 'moment'
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

moment.locale('id') // optional: set default locale ke Indonesia

export function randomNumbersByDatetime(): string {
    return moment(now()).format('YYYYMMDDHHmmss')
}

export function formatDate(date: Date): string {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function formatDateTime(date: Date | null): string | null {
    if (!date) return null
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
}

export function normalizeData(obj: any): any {
    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (obj instanceof Date) {
        return formatDate(obj); // format ke MySQL style
    }

    if (Array.isArray(obj)) {
        return obj.map(normalizeData);
    }

    if (obj !== null && typeof obj === 'object') {
        return Object.fromEntries(
            Object.entries(obj).map(([key, val]) => [key, normalizeData(val)])
        );
    }

    return obj;
}

export function response(success: boolean, msg: string, data: object = {}, statusCode: number = 200) {
    return new Response(
        JSON.stringify({
            success,
            message: msg,
            data
        }),
        {
            status: statusCode,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

export async function uploadToSpace(
    directory: string,
    file: Blob,
    filename: string,
    contentType = 'application/octet-stream'
): Promise<string> {
    try {
        // Pastikan file bukan null
        if (!file || typeof file.arrayBuffer !== 'function') {
            throw new Error('Invalid file or missing arrayBuffer method');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const dir = process.env.APP_DEBUG ? 'deployment' : 'production'
        const command = new PutObjectCommand({
            Bucket: process.env.SPACES_BUCKET!,
            Key: `${process.env.SPACES_MAIN_DIRECTORY}/${dir}/${directory}/${filename}`,
            Body: buffer,
            ACL: 'public-read',
            ContentType: contentType,
        });

        await s3.send(command);

        return `${directory}/${filename}`;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error; // perbaikan dari `return throw error`
    }
}

export async function deleteFromSpace(key: string) {
    try {
        const dir = process.env.APP_DEBUG ? 'deployment' : 'production'
        const command = new DeleteObjectCommand({
            Bucket: process.env.SPACES_BUCKET!,
            Key: `${process.env.SPACES_MAIN_DIRECTORY}/${dir}/${key}`, // contoh: 'uploads/my-image.png'
        })
        await s3.send(command)
        return true
    } catch (error) {
        return false
    }
}