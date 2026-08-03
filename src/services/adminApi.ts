import { getOk } from './apiClient';
import type {
  AdminUser,
  AppointmentPublic,
  AppointmentStatus,
  AvailabilityRule,
  DashboardMetrics,
  Holiday,
  LocationOffice,
  PaginatedResponse,
  Slot,
  TributeType,
} from '@/types/api';

interface AdminDashboardResponse {
  metrics: DashboardMetrics;
  upcoming_appointments: AppointmentPublic[];
}

export const adminApi = {
  // -- Auth --
  captcha: () => getOk<{ question: string; answer: number }>({ url: '/admin/auth/captcha' }),
  login: (payload: { email: string; password: string; captcha: string }) =>
    getOk<{ requires_2fa: boolean; preview: string }>({
      url: '/admin/auth/login',
      method: 'POST',
      data: payload,
    }),
  verify2FA: (code: string) =>
    getOk<{ user: AdminUser }>({ url: '/admin/auth/verify-2fa', method: 'POST', data: { code } }),
  logout: () => getOk<{ ok: boolean }>({ url: '/admin/auth/logout', method: 'POST' }),
  me: () => getOk<{ user: AdminUser }>({ url: '/admin/auth/me' }),

  // -- Dashboard --
  dashboard: () => getOk<AdminDashboardResponse>({ url: '/admin/dashboard' }),

  // -- Tributes --
  listTributes: (params?: { page?: number; per_page?: number; q?: string; include_inactive?: boolean }) =>
    getOk<PaginatedResponse<TributeType>>({
      url: '/admin/tribute-types',
      params: { page: 1, per_page: 100, ...(params ?? {}) },
    }),
  createTribute: (payload: Record<string, unknown>) =>
    getOk<TributeType>({ url: '/admin/tribute-types', method: 'POST', data: payload }),
  updateTribute: (id: number, payload: Record<string, unknown>) =>
    getOk<TributeType>({ url: `/admin/tribute-types/${id}`, method: 'PATCH', data: payload }),
  deleteTribute: (id: number) =>
    getOk<{ deleted?: boolean; soft_deleted?: boolean; id: number }>({
      url: `/admin/tribute-types/${id}`,
      method: 'DELETE',
    }),

  // -- Availability rules --
  listRules: (params?: { page?: number; per_page?: number }) =>
    getOk<PaginatedResponse<AvailabilityRule>>({
      url: '/admin/availability/rules',
      params: { page: 1, per_page: 50, ...(params ?? {}) },
    }),
  createRule: (payload: Record<string, unknown>) =>
    getOk<AvailabilityRule>({ url: '/admin/availability/rules', method: 'POST', data: payload }),
  updateRule: (id: number, payload: Record<string, unknown>) =>
    getOk<AvailabilityRule>({ url: `/admin/availability/rules/${id}`, method: 'PATCH', data: payload }),
  deleteRule: (id: number) =>
    getOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/rules/${id}`, method: 'DELETE' }),
  generateRuleSlots: (id: number, overwrite = false) =>
    getOk<{ created_slots: number }>({
      url: `/admin/availability/rules/${id}/generate-slots`,
      method: 'POST',
      params: { overwrite: overwrite ? 'true' : 'false' },
    }),

  // -- Slots --
  bulkGenerateSlots: (payload: Record<string, unknown>) =>
    getOk<{ created_slots: number }>({
      url: '/admin/availability/slots/bulk-generate',
      method: 'POST',
      data: payload,
    }),
  listSlots: (params?: Record<string, unknown>) =>
    getOk<PaginatedResponse<Slot>>({
      url: '/admin/availability/slots',
      params: { page: 1, per_page: 50, ...(params ?? {}) },
    }),
  updateSlot: (id: number, payload: Record<string, unknown>) =>
    getOk<Slot>({ url: `/admin/availability/slots/${id}`, method: 'PATCH', data: payload }),
  deleteSlot: (id: number) =>
    getOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/slots/${id}`, method: 'DELETE' }),
  blockSlots: (payload: { date: string; tribute_type_id?: number; reason?: string }) =>
    getOk<{ blocked: number }>({ url: '/admin/availability/slots/block', method: 'POST', data: payload }),

  // -- Holidays --
  listHolidays: () => getOk<Holiday[]>({ url: '/admin/availability/holidays' }),
  createHoliday: (payload: Record<string, unknown>) =>
    getOk<Holiday>({ url: '/admin/availability/holidays', method: 'POST', data: payload }),
  deleteHoliday: (id: number) =>
    getOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/holidays/${id}`, method: 'DELETE' }),

  // -- Locations --
  listLocations: () => getOk<LocationOffice[]>({ url: '/admin/locations' }),
  createLocation: (payload: Record<string, unknown>) =>
    getOk<LocationOffice>({ url: '/admin/locations', method: 'POST', data: payload }),
  updateLocation: (id: number, payload: Record<string, unknown>) =>
    getOk<LocationOffice>({ url: `/admin/locations/${id}`, method: 'PATCH', data: payload }),
  deleteLocation: (id: number) =>
    getOk<{ deleted: boolean; id: number }>({ url: `/admin/locations/${id}`, method: 'DELETE' }),

  // -- Appointments --
  listAppointments: (params?: Record<string, unknown>) =>
    getOk<PaginatedResponse<AppointmentPublic>>({
      url: '/admin/appointments',
      params: { page: 1, per_page: 30, ...(params ?? {}) },
    }),
  getAppointment: (id: number) =>
    getOk<AppointmentPublic>({ url: `/admin/appointments/${id}` }),
  updateAppointment: (id: number, payload: { status?: AppointmentStatus; internal_notes?: string }) =>
    getOk<AppointmentPublic>({ url: `/admin/appointments/${id}`, method: 'PATCH', data: payload }),
  cancelAppointment: (id: number) =>
    getOk<AppointmentPublic>({ url: `/admin/appointments/${id}/cancel`, method: 'POST' }),
  rescheduleAppointment: (id: number, slot_id: number) =>
    getOk<AppointmentPublic>({
      url: `/admin/appointments/${id}/reschedule`,
      method: 'POST',
      data: { slot_id },
    }),

};
