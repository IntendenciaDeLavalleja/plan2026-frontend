import { getAdminOk } from './apiClient';
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
  captcha: () => getAdminOk<{ question: string; answer: number }>({ url: '/admin/auth/captcha' }),
  login: (payload: { email: string; password: string; captcha: string }) =>
    getAdminOk<{ requires_2fa: boolean; preview: string }>({
      url: '/admin/auth/login',
      method: 'POST',
      data: payload,
    }),
  verify2FA: (code: string) =>
    getAdminOk<{ user: AdminUser }>({ url: '/admin/auth/verify-2fa', method: 'POST', data: { code } }),
  logout: () => getAdminOk<{ ok: boolean }>({ url: '/admin/auth/logout', method: 'POST' }),
  me: () => getAdminOk<{ user: AdminUser }>({ url: '/admin/auth/me' }),

  // -- Dashboard --
  dashboard: () => getAdminOk<AdminDashboardResponse>({ url: '/admin/dashboard' }),

  // -- Tributes --
  listTributes: (params?: { page?: number; per_page?: number; q?: string; include_inactive?: boolean }) =>
    getAdminOk<PaginatedResponse<TributeType>>({
      url: '/admin/tribute-types',
      params: { page: 1, per_page: 100, ...(params ?? {}) },
    }),
  createTribute: (payload: Record<string, unknown>) =>
    getAdminOk<TributeType>({ url: '/admin/tribute-types', method: 'POST', data: payload }),
  updateTribute: (id: number, payload: Record<string, unknown>) =>
    getAdminOk<TributeType>({ url: `/admin/tribute-types/${id}`, method: 'PATCH', data: payload }),
  deleteTribute: (id: number) =>
    getAdminOk<{ deleted?: boolean; soft_deleted?: boolean; id: number }>({
      url: `/admin/tribute-types/${id}`,
      method: 'DELETE',
    }),

  // -- Availability rules --
  listRules: (params?: { page?: number; per_page?: number }) =>
    getAdminOk<PaginatedResponse<AvailabilityRule>>({
      url: '/admin/availability/rules',
      params: { page: 1, per_page: 50, ...(params ?? {}) },
    }),
  createRule: (payload: Record<string, unknown>) =>
    getAdminOk<AvailabilityRule>({ url: '/admin/availability/rules', method: 'POST', data: payload }),
  updateRule: (id: number, payload: Record<string, unknown>) =>
    getAdminOk<AvailabilityRule>({ url: `/admin/availability/rules/${id}`, method: 'PATCH', data: payload }),
  deleteRule: (id: number) =>
    getAdminOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/rules/${id}`, method: 'DELETE' }),
  generateRuleSlots: (id: number, overwrite = false) =>
    getAdminOk<{ created_slots: number }>({
      url: `/admin/availability/rules/${id}/generate-slots`,
      method: 'POST',
      params: { overwrite: overwrite ? 'true' : 'false' },
    }),

  // -- Slots --
  bulkGenerateSlots: (payload: Record<string, unknown>) =>
    getAdminOk<{ created_slots: number }>({
      url: '/admin/availability/slots/bulk-generate',
      method: 'POST',
      data: payload,
    }),
  listSlots: (params?: Record<string, unknown>) =>
    getAdminOk<PaginatedResponse<Slot>>({
      url: '/admin/availability/slots',
      params: { page: 1, per_page: 50, ...(params ?? {}) },
    }),
  updateSlot: (id: number, payload: Record<string, unknown>) =>
    getAdminOk<Slot>({ url: `/admin/availability/slots/${id}`, method: 'PATCH', data: payload }),
  deleteSlot: (id: number) =>
    getAdminOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/slots/${id}`, method: 'DELETE' }),
  blockSlots: (payload: { date: string; tribute_type_id?: number; reason?: string }) =>
    getAdminOk<{ blocked: number }>({ url: '/admin/availability/slots/block', method: 'POST', data: payload }),

  // -- Holidays --
  listHolidays: () => getAdminOk<Holiday[]>({ url: '/admin/availability/holidays' }),
  createHoliday: (payload: Record<string, unknown>) =>
    getAdminOk<Holiday>({ url: '/admin/availability/holidays', method: 'POST', data: payload }),
  deleteHoliday: (id: number) =>
    getAdminOk<{ deleted: boolean; id: number }>({ url: `/admin/availability/holidays/${id}`, method: 'DELETE' }),

  // -- Locations --
  listLocations: () => getAdminOk<LocationOffice[]>({ url: '/admin/locations' }),
  createLocation: (payload: Record<string, unknown>) =>
    getAdminOk<LocationOffice>({ url: '/admin/locations', method: 'POST', data: payload }),
  updateLocation: (id: number, payload: Record<string, unknown>) =>
    getAdminOk<LocationOffice>({ url: `/admin/locations/${id}`, method: 'PATCH', data: payload }),
  deleteLocation: (id: number) =>
    getAdminOk<{ deleted: boolean; id: number }>({ url: `/admin/locations/${id}`, method: 'DELETE' }),

  // -- Appointments --
  listAppointments: (params?: Record<string, unknown>) =>
    getAdminOk<PaginatedResponse<AppointmentPublic>>({
      url: '/admin/appointments',
      params: { page: 1, per_page: 30, ...(params ?? {}) },
    }),
  getAppointment: (id: number) =>
    getAdminOk<AppointmentPublic>({ url: `/admin/appointments/${id}` }),
  updateAppointment: (id: number, payload: { status?: AppointmentStatus; internal_notes?: string }) =>
    getAdminOk<AppointmentPublic>({ url: `/admin/appointments/${id}`, method: 'PATCH', data: payload }),
  cancelAppointment: (id: number) =>
    getAdminOk<AppointmentPublic>({ url: `/admin/appointments/${id}/cancel`, method: 'POST' }),
  rescheduleAppointment: (id: number, slot_id: number) =>
    getAdminOk<AppointmentPublic>({
      url: `/admin/appointments/${id}/reschedule`,
      method: 'POST',
      data: { slot_id },
    }),

};
