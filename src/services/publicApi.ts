import { getPublicOk } from './apiClient';
import type {
  AppointmentPublic,
  AvailableDate,
  LocationOffice,
  Slot,
  TributeType,
} from '@/types/api';

export const publicApi = {
  tributeTypes: () => getPublicOk<TributeType[]>({ url: '/public/tribute-types' }),
  locations: () => getPublicOk<LocationOffice[]>({ url: '/public/locations' }),
  availability: (tributeTypeId: number, days = 30) =>
    getPublicOk<{
      tribute_type_id: number;
      from: string;
      to: string;
      dates: AvailableDate[];
    }>({
      url: '/public/availability',
      params: { tribute_type_id: tributeTypeId, days },
    }),
  slots: (tributeTypeId: number, date: string) =>
    getPublicOk<{
      date: string;
      tribute_type_id: number;
      is_blocked: boolean;
      block_reason: string;
      slots: Slot[];
    }>({
      url: '/public/slots',
      params: { tribute_type_id: tributeTypeId, date },
    }),
  createAppointment: (payload: Record<string, unknown>) =>
    getPublicOk<AppointmentPublic>({ url: '/public/appointments', method: 'POST', data: payload }),
  lookupAppointment: (code: string) =>
    getPublicOk<AppointmentPublic>({
      url: `/public/appointments/${encodeURIComponent(code)}`,
    }),
  cancelAppointment: (code: string, document: string) =>
    getPublicOk<{ cancelled: boolean; reservation_code: string }>({
      url: `/public/appointments/${encodeURIComponent(code)}/cancel`,
      method: 'POST',
      data: { document },
    }),
};
