// utils/datetime.ts
import moment from "moment-timezone";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

/* =========================
 * Date formatting
 * ========================= */
export function randomNumbersByDatetime(): string {
  return moment().format("YYYYMMDDHHmmss");
}

export function formatDateNow(): string {
  return moment().format("YYYY-MM-DD HH:mm:ss");
}

export function timeAfterNow(seconds: number): string {
  return moment().add(seconds, "seconds").format("YYYY-MM-DD HH:mm:ss");
}

export function formatDate(date: Date | string | number): string {
  console.log(date);
  
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

export function formatDateTime(date: Date | string | number | null): string | null {
  if (!date) return null;
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

/* =========================
 * Normalizer helpers
 * ========================= */

// Pola nama key yang dianggap field tanggal
const DEFAULT_DATE_KEY_MATCHERS: (string | RegExp)[] = [
  /(_at|_date|_on|_time|_timestamp)$/i, // created_at, updated_at, expires_at, for_presence, dll.
  /^date$/i,
];

function isDateKey(key?: string, matchers: (string | RegExp)[] = DEFAULT_DATE_KEY_MATCHERS) {
  if (!key) return false;
  return matchers.some((m) => (typeof m === "string" ? key === m : m.test(key)));
}

function isDateLikeValue(v: unknown): Date | null {
  if (v instanceof Date && !isNaN(v.getTime())) return v;

  if (typeof v === "string") {
    const s = v.trim();
    if (s.length < 8) return null;
    const looksLikeDate =
      /^\d{4}-\d{2}-\d{2}(?:[ T]\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(s) ||
      /^\d{2}\/\d{2}\/\d{4}$/.test(s);
    if (!looksLikeDate) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  if (typeof v === "number" && isFinite(v)) {
    // Anggap timestamp jika dalam rentang wajar (1970–2100), deteksi detik vs milidetik
    const sec = v > 1e11 ? Math.floor(v / 1000) : Math.floor(v);
    if (sec >= 0 && sec < 4102444800) {
      const d = new Date(sec * 1000);
      return isNaN(d.getTime()) ? null : d;
    }
  }
  return null;
}

/* =========================
 * NORMALIZER & RESPONSE
 * ========================= */

type NormalizeOptions = {
  dateKeyMatchers?: (string | RegExp)[];
};

export function normalizeData(obj: any, opts: NormalizeOptions = {}, keyForThis?: string): any {
  if (typeof obj === "bigint") return obj.toString();

  const dateCandidate = isDateLikeValue(obj);
  if (dateCandidate && isDateKey(keyForThis, opts.dateKeyMatchers || DEFAULT_DATE_KEY_MATCHERS)) {
    return formatDate(dateCandidate);
  }

  // String/number/Date biasa: jangan dipaksa menjadi tanggal
  if (typeof obj === "string" || typeof obj === "number" || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((v) => normalizeData(v, opts));
  }

  if (obj !== null && typeof obj === "object") {
    const entries = Object.entries(obj).map(([k, v]) => [k, normalizeData(v, opts, k)]);
    return Object.fromEntries(entries);
  }

  return obj;
}

// Replacer agar BigInt aman saat JSON.stringify
function jsonReplacer(_: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
}

export function response(success: boolean, msg: string, data: object = {}, statusCode = 200) {
  // kamu bisa pilih: mau kirim data apa adanya tapi dengan replacer,
  // atau kirim data yang sudah di-normalize (mis. normalizeData(data))
  const body = JSON.stringify({ success, message: msg, data }, jsonReplacer);
  return new Response(body, {
    status: statusCode,
    headers: { "Content-Type": "application/json" },
  });
}

/* =========================
 * DO Spaces helpers
 * ========================= */

export async function uploadToSpace(
  directory: string,
  file: Blob,
  filename: string,
  contentType = "application/octet-stream"
): Promise<string> {
  try {
    if (!file || typeof (file as any).arrayBuffer !== "function") {
      throw new Error("Invalid file or missing arrayBuffer method");
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const stage = process.env.APP_DEBUG ? "deployment" : "production";
    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET!,
      Key: `${process.env.SPACES_MAIN_DIRECTORY}/${stage}/${directory}/${filename}`,
      Body: buffer,
      ACL: "public-read",
      ContentType: contentType,
    });
    await s3.send(command);
    return `${directory}/${filename}`;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function deleteFromSpace(key: string) {
  try {
    const stage = process.env.APP_DEBUG ? "deployment" : "production";
    const command = new DeleteObjectCommand({
      Bucket: process.env.SPACES_BUCKET!,
      Key: `${process.env.SPACES_MAIN_DIRECTORY}/${stage}/${key}`,
    });
    await s3.send(command);
    return true;
  } catch {
    return false;
  }
}
