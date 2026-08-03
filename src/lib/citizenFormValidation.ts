import { z } from 'zod';
import type { TributeType } from '@/types/api';

export function createCitizenSchema(tributeType: TributeType) {
  const requiresReference = tributeType.requires_padron || tributeType.requires_matricula;
  const referenceValue = requiresReference
    ? z.string().trim().min(1, 'Ingresá el valor solicitado').max(80)
    : z.string().trim().max(80).optional().or(z.literal('').transform(() => undefined));

  return z.object({
    citizen_name: z.string().trim().min(3, 'Ingresá tu nombre completo').max(160),
    citizen_document: z
      .string()
      .trim()
      .min(6, 'Cédula inválida')
      .max(12, 'Cédula inválida')
      .regex(/^[\d.-]+$/, 'Sólo números, puntos o guiones'),
    phone: z
      .string()
      .trim()
      .min(6, 'Teléfono inválido')
      .max(30, 'Teléfono inválido')
      .regex(/^[\d\s+()-]+$/, 'Sólo números y símbolos válidos'),
    email: z
      .string()
      .trim()
      .email('Email inválido')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    reference_value: referenceValue,
    comments: z.string().trim().max(1000).optional().or(z.literal('').transform(() => undefined)),
    accept_terms: z.boolean().refine((value) => value === true, {
      message: 'Debés aceptar los términos para continuar',
    }),
  });
}

export type CitizenFormValues = z.infer<ReturnType<typeof createCitizenSchema>>;
