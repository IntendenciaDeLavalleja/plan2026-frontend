import { useEffect, useMemo } from 'react';
import {
  Body1,
  Body1Strong,
  Checkbox,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Subtitle1,
  Text,
} from '@fluentui/react-components';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TributeType } from '@/types/api';
import { createCitizenSchema, type CitizenFormValues } from '@/lib/citizenFormValidation';

interface Props {
  tributeType: TributeType;
  defaultEmail?: string;
  legalNotice: string;
  onSubmit: (data: CitizenFormValues) => void | Promise<void>;
  onValidityChange?: (isValid: boolean) => void;
  initialValues?: Partial<CitizenFormValues>;
  submitting?: boolean;
  errorMessage?: string | null;
}

export function CitizenDataStep({
  tributeType,
  defaultEmail,
  legalNotice,
  onSubmit,
  onValidityChange,
  initialValues,
  submitting,
  errorMessage,
}: Props) {
  const schema = useMemo(() => createCitizenSchema(tributeType), [tributeType]);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CitizenFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      citizen_name: initialValues?.citizen_name ?? '',
      citizen_document: initialValues?.citizen_document ?? '',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? defaultEmail ?? '',
      reference_value: initialValues?.reference_value ?? '',
      comments: initialValues?.comments ?? '',
      accept_terms: initialValues?.accept_terms ?? false,
    },
  });

  const referenceLabel = useMemo(() => {
    if (tributeType.requires_padron) return 'Padrón / código municipal';
    if (tributeType.requires_matricula) return 'Matrícula / chapa';
    return 'Referencia (opcional)';
  }, [tributeType]);
  const requiresReference = tributeType.requires_padron || tributeType.requires_matricula;

  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <form id="citizen-data-form" onSubmit={handleSubmit(onSubmit)} className="af-stack-lg">
      <div className="af-stack">
        <Subtitle1>3. Datos del vecino</Subtitle1>
        <Text className="af-muted">
          Verificá que los datos sean correctos. Los campos marcados con * son
          obligatorios.
        </Text>
      </div>
      {errorMessage && (
        <MessageBar intent="error">
          <MessageBarBody>
            <MessageBarTitle>No pudimos registrar la reserva</MessageBarTitle>
            <Body1>{errorMessage}</Body1>
          </MessageBarBody>
        </MessageBar>
      )}
      <div
        className="af-grid"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
      >
        <Controller
          control={control}
          name="citizen_name"
          render={({ field }) => (
            <Field
              label="Nombre completo *"
              validationState={errors.citizen_name ? 'error' : undefined}
              validationMessage={errors.citizen_name?.message}
            >
              <Input {...field} placeholder="Ej: María González" autoComplete="name" />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="citizen_document"
          render={({ field }) => (
            <Field
              label="Cédula de identidad *"
              validationState={errors.citizen_document ? 'error' : undefined}
              validationMessage={errors.citizen_document?.message}
            >
              <Input {...field} placeholder="Ej: 1.234.567-8" autoComplete="off" />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="phone"
          render={({ field }) => (
            <Field
              label="Teléfono de contacto *"
              validationState={errors.phone ? 'error' : undefined}
              validationMessage={errors.phone?.message}
            >
              <Input {...field} placeholder="Ej: 099 123 456" autoComplete="tel" />
            </Field>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Field
              label="Email (opcional)"
              validationState={errors.email ? 'error' : undefined}
              validationMessage={errors.email?.message}
              hint="Recibirás una copia del comprobante si lo informás."
            >
              <Input {...field} type="email" placeholder="su@correo.com" autoComplete="email" />
            </Field>
          )}
        />
        {requiresReference && (
          <Controller
            control={control}
              name="reference_value"
              render={({ field }) => (
                <Field
                  label={`${referenceLabel} *`}
                validationState={errors.reference_value ? 'error' : undefined}
                validationMessage={errors.reference_value?.message}
              >
                <Input {...field} placeholder="Ingresá el valor solicitado" />
              </Field>
            )}
          />
        )}
        <Controller
          control={control}
          name="comments"
          render={({ field }) => (
            <Field label="Comentarios (opcional)" style={{ gridColumn: '1 / -1' }}>
              <Input {...field} placeholder="Información adicional que ayude al equipo a prepararse." />
            </Field>
          )}
        />
      </div>
      <div className="af-stack">
        <Controller
          control={control}
          name="accept_terms"
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onChange={(_, data) => field.onChange(data.checked)}
              label={
                <Body1>
                  Acepto los términos de uso y autorizo el tratamiento de mis
                  datos personales conforme a la legislación vigente.
                </Body1>
              }
            />
          )}
        />
        {errors.accept_terms && (
          <MessageBar intent="error">
            <MessageBarBody>
              <Body1>{errors.accept_terms.message}</Body1>
            </MessageBarBody>
          </MessageBar>
        )}
      </div>
      <MessageBar intent="info">
        <MessageBarBody>
          <MessageBarTitle>Aviso legal</MessageBarTitle>
          <Body1>{legalNotice}</Body1>
        </MessageBarBody>
      </MessageBar>
      <div className="af-row" style={{ justifyContent: 'flex-end' }}>
        <Body1Strong>Listo para enviar: {isValid ? '✔' : 'completá los campos obligatorios'}</Body1Strong>
      </div>
      {submitting && <Text className="af-muted">Procesando reserva…</Text>}
    </form>
  );
}
