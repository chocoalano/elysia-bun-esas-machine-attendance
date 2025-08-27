type AnyRecord = Record<string, any>;

type ToLaravelOptions = {
  locale?: 'en' | 'id';
  defaultMessage?: string; // override default "The given data was invalid."
};

export class ValidationFormatter {
  static toArr(err: AnyRecord, opts: ToLaravelOptions = {}) {
    const locale = opts.locale ?? 'en';
    const message = opts.defaultMessage ?? (locale === 'id'
      ? 'Data yang diberikan tidak valid.'
      : 'The given data was invalid.');

    // 1) Kumpulkan issues dari berbagai kemungkinan struktur error Elysia
    const issues = this.collectIssues(err);

    // 2) Jika tidak ada issues, coba deteksi "required" berdasarkan schema.required & value
    const inferred = this.inferRequiredIssues(err);

    // Gabungkan & bangun map field -> array pesan
    const all = [...issues, ...inferred];
    const errors: Record<string, string[]> = {};

    for (const iss of all) {
      const path = this.normalizePath(iss.path);
      const rule = iss.rule ?? this.guessRuleFromMessage(iss.message);
      const text = this.buildMessage(path, rule, iss.message, locale);

      if (!path) continue; // skip jika tanpa path

      if (!errors[path]) errors[path] = [];
      if (!errors[path].includes(text)) errors[path].push(text);
    }

    return { message, errors };
  }

  // -------- helpers --------

  private static collectIssues(err: AnyRecord): Array<{ path: string | string[]; message: string; rule?: string }> {
    const candidates =
      (Array.isArray(err?.all) ? err.all : null) ??
      (Array.isArray(err?.issues) ? err.issues : null) ??
      (Array.isArray(err?.errors) ? err.errors : null) ??
      (Array.isArray(err?.cause?.issues) ? err.cause.issues : null) ??
      [];

    // Normalisasi ke {path, message}
    return candidates
      .map((e: AnyRecord) => ({
        path: e?.path ?? e?.instancePath ?? e?.schemaPath ?? '',
        message: e?.message ?? 'Invalid value',
        rule: e?.keyword ?? e?.rule, // zod/ajv/typebox kadang punya keyword/rule
      }))
      .filter(Boolean);
  }

  private static inferRequiredIssues(err: AnyRecord): Array<{ path: string; message: string; rule: string }> {
    const out: Array<{ path: string; message: string; rule: string }> = [];
    const schema = err?.validator?.schema;
    const value = (err?.value ?? {}) as AnyRecord;

    if (!schema || !Array.isArray(schema?.required)) return out;

    const hasIssuesArray =
      Array.isArray(err?.all) ||
      Array.isArray(err?.issues) ||
      Array.isArray(err?.errors) ||
      Array.isArray(err?.cause?.issues);

    // Kalau sudah ada issues detail, tidak usah tebak lagi.
    if (hasIssuesArray) return out;

    for (const field of schema.required as string[]) {
      // field dianggap kosong jika undefined/null/'' (string kosong)
      const v = value[field];
      const empty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
      if (empty) {
        out.push({
          path: field,
          message: 'is required',
          rule: 'required',
        });
      }
    }

    // Validasi "enum"/anyOf sederhana (contoh field "type")
    for (const [prop, def] of Object.entries<any>(schema.properties ?? {})) {
      const v = value[prop];
      if (v == null) continue;

      if (Array.isArray(def.anyOf)) {
        // kumpulkan allowed const
        const allowed = def.anyOf
          .map((a: any) => (typeof a?.const !== 'undefined' ? String(a.const) : undefined))
          .filter((x: any) => x !== undefined);

        if (allowed.length > 0 && !allowed.includes(String(v))) {
          out.push({
            path: prop,
            message: 'is invalid',
            rule: 'in',
          });
        }
      }
    }

    return out;
  }

  private static normalizePath(path: any): string {
    if (!path) return '';
    if (Array.isArray(path)) return path.join('.');
    if (typeof path === 'string') {
      // ajv/typebox bisa memberi instancePath: "/body/field"
      const cleaned = path.replace(/^\//, '').replace(/\//g, '.');
      return cleaned;
    }
    return String(path);
  }

  private static guessRuleFromMessage(msg?: string): string {
    const m = (msg ?? '').toLowerCase();
    if (m.includes('required')) return 'required';
    if (m.includes('invalid') || m.includes('not valid')) return 'in';
    if (m.includes('too short')) return 'min';
    if (m.includes('too long')) return 'max';
    if (m.includes('must be number') || m.includes('should be number')) return 'numeric';
    return 'invalid';
  }

  private static buildMessage(field: string, rule: string, fallback: string, locale: 'en' | 'id'): string {
    // Pesan-pesan ringkas ala Laravel
    const en = {
      required: `The ${field} field is required.`,
      in: `The selected ${field} is invalid.`,
      numeric: `The ${field} must be a number.`,
      invalid: `The ${field} is invalid.`,
    } as const;

    const id = {
      required: `Kolom ${field} wajib diisi.`,
      in: `Nilai ${field} tidak valid.`,
      numeric: `${field} harus berupa angka.`,
      invalid: `${field} tidak valid.`,
    } as const;

    const dict = locale === 'id' ? id : en;
    const key = (['required', 'in', 'numeric'].includes(rule) ? rule : 'invalid') as keyof typeof dict;

    return dict[key] ?? (fallback || dict.invalid);
  }
}