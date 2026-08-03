import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SSRProvider } from '@fluentui/react-components';
import { describe, expect, it } from 'vitest';
import { ReviewStepButton } from '../components/appointments/AppointmentWizard';
import { createCitizenSchema } from './citizenFormValidation';
import type { TributeType } from '../types/api';

const tributeWithPadron: TributeType = {
  id: 1,
  name: 'Contribución Inmobiliaria Urbana',
  slug: 'ciu',
  description: '',
  icon_key: 'home',
  requirements_text: '',
  default_duration_minutes: 30,
  requires_padron: true,
  requires_matricula: false,
  requires_document: true,
  is_active: true,
  sort_order: 1,
};

const validPayload = {
  citizen_name: 'Ramiro García',
  citizen_document: '4.548.541-3',
  phone: '095975766',
  email: 'ramiro@example.com',
  reference_value: '30000',
  comments: '',
  accept_terms: true,
};

describe('validación de datos del vecino', () => {
  it('acepta los mismos datos válidos que requiere la reserva con padrón', () => {
    expect(createCitizenSchema(tributeWithPadron).safeParse(validPayload).success).toBe(true);
  });

  it('exige padrón cuando el tributo lo requiere', () => {
    expect(createCitizenSchema(tributeWithPadron).safeParse({ ...validPayload, reference_value: '' }).success).toBe(false);
  });

  it('rechaza longitudes que el backend no acepta para documento y teléfono', () => {
    expect(createCitizenSchema(tributeWithPadron).safeParse({ ...validPayload, citizen_document: '1.234.567.890' }).success).toBe(false);
    expect(createCitizenSchema(tributeWithPadron).safeParse({ ...validPayload, phone: '1234567890123456789012345678901' }).success).toBe(false);
  });

  it('asocia el botón de revisar con el formulario y sólo lo habilita cuando corresponde', () => {
    const enabled = renderToStaticMarkup(createElement(SSRProvider, null, createElement(ReviewStepButton, { canReview: true, submitting: false })));
    const disabled = renderToStaticMarkup(createElement(SSRProvider, null, createElement(ReviewStepButton, { canReview: false, submitting: false })));
    expect(enabled).toContain('form="citizen-data-form"');
    expect(enabled).toContain('type="submit"');
    expect(enabled).not.toContain('disabled=""');
    expect(disabled).toContain('disabled=""');
  });
});
