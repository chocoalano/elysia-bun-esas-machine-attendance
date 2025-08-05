// src/types/prisma.types.ts
// Sesuaikan path file ini sesuai struktur folder Anda

import { t } from "elysia";

// Enums
export const BugReportPlatform = t.Enum({ android: 'android', ios: 'ios', web: 'web' });
export const PermitApprovesUserType = t.Enum({ line: 'line', manager: 'manager', hr: 'hr' });
export const PermitApprovesUserApprove = t.Enum({ w: 'w', y: 'y', n: 'n' });
export const QrPresenceType = t.Enum({ in: 'in', out: 'out' });
export const UserAddressIdentityType = t.Enum({ ktp: 'ktp', sim: 'sim', passport: 'passport' });
export const UserAttendanceType = t.Enum({ qrcode: 'qrcode', fingerprint: 'fingerprint', image: 'image', manual: 'manual' });
export const UserAttendanceStatus = t.Enum({ normal: 'normal', late: 'late' });
export const UserDetailsGender = t.Enum({ m: 'm', f: 'f' });
export const UserDetailsBlood = t.Enum({ A: 'A', B: 'B', AB: 'AB', O: 'O' });
export const UserDetailsMaritalStatus = t.Enum({ single: 'single', married: 'married', divorced: 'divorced' });
export const UserDetailsReligion = t.Enum({ islam: 'islam', kristen: 'kristen', katolik: 'katolik', hindu: 'hindu', buddha: 'buddha', konghucu: 'konghucu' });
export const UserFamiliesRelationship = t.Enum({ wife: 'wife', husband: 'husband', child: 'child', father: 'father', mother: 'mother', other: 'other' });
export const UserFormalEducationStatus = t.Enum({ lulus: 'lulus', tidak_lulus: 'tidak_lulus', masih_sekolah: 'masih_sekolah' });
export const UserInformalEducationType = t.Enum({ day: 'day', hour: 'hour', week: 'week' });
export const UserInformalEducationStatus = t.Enum({ lulus: 'lulus', tidak_lulus: 'tidak_lulus', masih_mengikuti: 'masih_mengikuti' });
export const UserSalariesPaymentType = t.Enum({ daily: 'daily', weekly: 'weekly', monthly: 'monthly' });

// Skema ElysiaJS untuk setiap model
export const Announcements = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  user_id: t.BigInt(),
  title: t.String(),
  status: t.Boolean(),
  content: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const BugReports = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  user_id: t.BigInt(),
  title: t.String(),
  status: t.Boolean(),
  message: t.String(),
  platform: BugReportPlatform,
  image: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Cache = t.Object({
  key: t.String(),
  value: t.String(),
  expiration: t.Number(),
});

export const CacheLocks = t.Object({
  key: t.String(),
  owner: t.String(),
  expiration: t.Number(),
});

export const Companies = t.Object({
  id: t.BigInt(),
  name: t.String(),
  latitude: t.String(),
  longitude: t.String(),
  radius: t.String(),
  full_address: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Departements = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  name: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Exports = t.Object({
  id: t.BigInt(),
  completed_at: t.Nullable(t.Date()),
  file_disk: t.String(),
  file_name: t.Nullable(t.String()),
  exporter: t.String(),
  processed_rows: t.Number(),
  total_rows: t.Number(),
  successful_rows: t.Number(),
  user_id: t.BigInt(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const FailedImportRows = t.Object({
  id: t.BigInt(),
  data: t.Any(), // t.Any() atau t.Unknown() untuk Prisma.JsonValue
  import_id: t.BigInt(),
  validation_error: t.Nullable(t.String()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const FailedJobs = t.Object({
  id: t.BigInt(),
  uuid: t.String(),
  connection: t.String(),
  queue: t.String(),
  payload: t.String(),
  exception: t.String(),
  failed_at: t.Date(),
});

export const FcmModels = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  device_token: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Imports = t.Object({
  id: t.BigInt(),
  completed_at: t.Nullable(t.Date()),
  file_name: t.String(),
  file_path: t.String(),
  importer: t.String(),
  processed_rows: t.Number(),
  total_rows: t.Number(),
  successful_rows: t.Number(),
  user_id: t.BigInt(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const JobBatches = t.Object({
  id: t.String(),
  name: t.String(),
  total_jobs: t.Number(),
  pending_jobs: t.Number(),
  failed_jobs: t.Number(),
  failed_job_ids: t.String(),
  options: t.Nullable(t.String()),
  cancelled_at: t.Nullable(t.Number()),
  created_at: t.Number(),
  finished_at: t.Nullable(t.Number()),
});

export const JobLevels = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  departement_id: t.BigInt(),
  name: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const JobPositions = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  departement_id: t.BigInt(),
  name: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Jobs = t.Object({
  id: t.BigInt(),
  queue: t.String(),
  payload: t.String(),
  attempts: t.Number(),
  reserved_at: t.Nullable(t.Number()),
  available_at: t.Number(),
  created_at: t.Number(),
});

export const Migrations = t.Object({
  id: t.Number(),
  migration: t.String(),
  batch: t.Number(),
});

export const ModelHasPermissions = t.Object({
  permission_id: t.BigInt(),
  model_type: t.String(),
  model_id: t.BigInt(),
});

export const ModelHasRoles = t.Object({
  role_id: t.BigInt(),
  model_type: t.String(),
  model_id: t.BigInt(),
});

export const Notifications = t.Object({
  id: t.String(),
  type: t.String(),
  notifiable_type: t.String(),
  notifiable_id: t.BigInt(),
  data: t.String(),
  read_at: t.Nullable(t.Date()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const PasswordResetTokens = t.Object({
  email: t.String(),
  token: t.String(),
  created_at: t.Nullable(t.Date()),
});

export const Permissions = t.Object({
  id: t.BigInt(),
  name: t.String(),
  guard_name: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const PermitApproves = t.Object({
  id: t.BigInt(),
  permit_id: t.BigInt(),
  user_id: t.BigInt(),
  user_type: PermitApprovesUserType,
  user_approve: PermitApprovesUserApprove,
  notes: t.Nullable(t.String()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const PermitTypes = t.Object({
  id: t.BigInt(),
  type: t.String(),
  is_payed: t.Boolean(),
  approve_line: t.Boolean(),
  approve_manager: t.Boolean(),
  approve_hr: t.Boolean(),
  with_file: t.Boolean(),
  show_mobile: t.Boolean(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Permits = t.Object({
  id: t.BigInt(),
  permit_numbers: t.String(),
  user_id: t.BigInt(),
  permit_type_id: t.BigInt(),
  user_timework_schedule_id: t.BigInt(),
  timein_adjust: t.Nullable(t.Date()),
  timeout_adjust: t.Nullable(t.Date()),
  current_shift_id: t.Nullable(t.BigInt()),
  adjust_shift_id: t.Nullable(t.BigInt()),
  start_date: t.Nullable(t.Date()),
  end_date: t.Nullable(t.Date()),
  start_time: t.Nullable(t.Date()),
  end_time: t.Nullable(t.Date()),
  notes: t.Nullable(t.String()),
  file: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const PersonalAccessTokens = t.Object({
  id: t.BigInt(),
  tokenable_type: t.String(),
  tokenable_id: t.BigInt(),
  name: t.String(),
  token: t.String(),
  abilities: t.Nullable(t.String()),
  last_used_at: t.Nullable(t.Date()),
  expires_at: t.Nullable(t.Date()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const QrPresenceTransactions = t.Object({
  id: t.BigInt(),
  qr_presence_id: t.BigInt(),
  user_attendance_id: t.BigInt(),
  token: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const QrPresences = t.Object({
  id: t.BigInt(),
  type: QrPresenceType,
  departement_id: t.BigInt(),
  timework_id: t.BigInt(),
  token: t.String(),
  for_presence: t.Date(),
  expires_at: t.Date(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const RoleHasPermissions = t.Object({
  permission_id: t.BigInt(),
  role_id: t.BigInt(),
});

export const Roles = t.Object({
  id: t.BigInt(),
  name: t.String(),
  guard_name: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Sessions = t.Object({
  id: t.String(),
  user_id: t.Nullable(t.BigInt()),
  ip_address: t.Nullable(t.String()),
  user_agent: t.Nullable(t.String()),
  payload: t.String(),
  last_activity: t.Number(),
});

export const Settings = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  attendance_image_geolocation: t.Boolean(),
  attendance_qrcode: t.Boolean(),
  attendance_fingerprint: t.Boolean(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const TimeWorkes = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  departemen_id: t.BigInt(),
  name: t.String(),
  in: t.Date(),
  out: t.Date(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserAddress = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  identity_type: UserAddressIdentityType,
  identity_numbers: t.String(),
  province: t.String(),
  city: t.String(),
  citizen_address: t.String(),
  residential_address: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserAttendances = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  user_timework_schedule_id: t.Nullable(t.BigInt()),
  time_in: t.Nullable(t.Date()),
  time_out: t.Nullable(t.Date()),
  type_in: t.Nullable(UserAttendanceType),
  type_out: t.Nullable(UserAttendanceType),
  lat_in: t.Nullable(t.String()),
  lat_out: t.Nullable(t.String()),
  long_in: t.Nullable(t.String()),
  long_out: t.Nullable(t.String()),
  image_in: t.Nullable(t.String()),
  image_out: t.Nullable(t.String()),
  status_in: UserAttendanceStatus,
  status_out: UserAttendanceStatus,
  created_by: t.Nullable(t.BigInt()),
  updated_by: t.Nullable(t.BigInt()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserDetails = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  phone: t.String(),
  placebirth: t.String(),
  datebirth: t.Date(),
  gender: UserDetailsGender,
  blood: t.Nullable(UserDetailsBlood),
  marital_status: t.Nullable(UserDetailsMaritalStatus),
  religion: t.Nullable(UserDetailsReligion),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserEmployes = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  departement_id: t.Nullable(t.BigInt()),
  job_position_id: t.Nullable(t.BigInt()),
  job_level_id: t.Nullable(t.BigInt()),
  approval_line_id: t.Nullable(t.BigInt()),
  approval_manager_id: t.Nullable(t.BigInt()),
  join_date: t.Date(),
  sign_date: t.Date(),
  resign_date: t.Nullable(t.Date()),
  bank_name: t.Nullable(t.String()),
  bank_number: t.Nullable(t.String()),
  bank_holder: t.Nullable(t.String()),
  saldo_cuti: t.Nullable(t.Number()),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserFamilies = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  fullname: t.String(),
  relationship: UserFamiliesRelationship,
  birthdate: t.Date(),
  marital_status: t.Nullable(UserDetailsMaritalStatus),
  job: t.String(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserFormalEducations = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  institution: t.String(),
  majors: t.String(),
  score: t.Any(), // t.Any() untuk Prisma.Decimal
  start: t.Nullable(t.Number()),
  finish: t.Nullable(t.Number()),
  status: UserFormalEducationStatus,
  certification: t.Boolean(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserInformalEducations = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  institution: t.String(),
  start: t.Nullable(t.Number()),
  finish: t.Nullable(t.Number()),
  type: UserInformalEducationType,
  duration: t.Number(),
  status: UserInformalEducationStatus,
  certification: t.Boolean(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserSalaries = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  basic_salary: t.Any(), // t.Any() untuk Prisma.Decimal
  payment_type: UserSalariesPaymentType,
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserTimeworkSchedules = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  time_work_id: t.BigInt(),
  work_day: t.Date(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const UserWorkExperiences = t.Object({
  id: t.BigInt(),
  user_id: t.BigInt(),
  company_name: t.String(),
  start: t.Nullable(t.Number()),
  finish: t.Nullable(t.Number()),
  position: t.Nullable(t.String()),
  certification: t.Boolean(),
  created_at: t.Nullable(t.Date()),
  updated_at: t.Nullable(t.Date()),
});

export const Users = t.Object({
  id: t.BigInt(),
  company_id: t.BigInt(),
  name: t.String(),
  nip: t.String(),
  email: t.String(),
  email_verified_at: t.Nullable(t.Date()),
  password: t.String(),
});