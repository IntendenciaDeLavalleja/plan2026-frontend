// Shared API types for the Amnistia Financiera system

export interface ApiOk<T> {
  ok: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
    errors?: Record<string, string[]>;
  };
}

export type ApiResponse<T> = ApiOk<T> | ApiError;

export interface TributeType {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  requirements_text: string;
  default_duration_minutes: number;
  requires_padron: boolean;
  requires_matricula: boolean;
  requires_document: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface LocationOffice {
  id: number;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
}

export interface AvailableDate {
  date: string; // YYYY-MM-DD
  remaining: number;
  weekday: string;
}

export interface Slot {
  id: number;
  tribute_type_id: number | null;
  location_id: number | null;
  location_name: string | null;
  date: string;
  start_time: string; // HH:MM
  end_time: string;
  capacity: number;
  reserved_count: number;
  remaining: number;
  is_blocked: boolean;
  block_reason: string;
  notes: string;
}

export interface AppointmentPublic {
  id: number;
  reservation_code: string;
  status: AppointmentStatus;
  tribute_type: { id: number; name: string; icon_key: string } | null;
  location: { id: number; name: string; address: string } | null;
  citizen: {
    name: string;
    document: string;
    phone: string;
    email: string;
    reference_value: string;
  };
  comments: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string | null;
  email_delivery?: 'sent' | 'failed' | 'not_requested';
}

export type AppointmentStatus =
  | 'reserved'
  | 'confirmed'
  | 'attended'
  | 'cancelled'
  | 'no_show';

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  last_login_at: string | null;
  created_at: string | null;
}

export interface AvailabilityRule {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  weekdays: number[];
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  capacity_per_slot: number;
  location_id: number | null;
  location_name: string | null;
  team: string | null;
  applies_to_all: boolean;
  tribute_type_ids: number[];
  is_active: boolean;
}

export interface Holiday {
  id: number;
  date: string;
  reason: string;
  is_full_day: boolean;
  start_time: string | null;
  end_time: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

export interface DashboardMetrics {
  today: number;
  upcoming: number;
  pending: number;
  cancelled: number;
  weekly_capacity: number;
  active_tributes: number;
  no_show: number;
  attended: number;
  confirmed: number;
}
