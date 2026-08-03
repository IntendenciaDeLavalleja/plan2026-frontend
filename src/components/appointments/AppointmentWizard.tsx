import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Body1Strong,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbDivider,
  Button,
  MessageBar,
  MessageBarBody,
  Subtitle1,
  Text,
  Title2,
  tokens,
} from '@fluentui/react-components';
import { ArrowLeft24Regular, ArrowRight24Regular, LockClosed24Regular } from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';
import { TributeTypeStep } from './TributeTypeStep';
import { CalendarAvailability } from './CalendarAvailability';
import { CitizenDataStep } from './CitizenDataStep';
import { ConfirmationSummary } from './ConfirmationSummary';
import { AppointmentSuccess } from './AppointmentSuccess';
import { publicApi } from '@/services/publicApi';
import { ApiError } from '@/services/apiClient';
import { LoadingState } from '@/components/common/LoadingState';
import { AGENDA_CONFIG } from '@/config/agendaConfig';
import type { CitizenFormValues } from '@/lib/citizenFormValidation';
import type { AppointmentPublic, Slot, TributeType } from '@/types/api';
import dayjs from 'dayjs';

const STEPS = [
  { id: 1, label: 'Tributo' },
  { id: 2, label: 'Fecha y hora' },
  { id: 3, label: 'Datos' },
  { id: 4, label: 'Confirmar' },
];

interface AppointmentWizardProps {
  breadcrumbItems?: string[];
  title?: string;
  description?: string;
  cancelTo?: string;
  cancelLabel?: string;
  successReturnTo?: string;
  successReturnLabel?: string;
}

export function AppointmentWizard({
  breadcrumbItems = ['Inicio', 'Reservar turno'],
  title = 'Reservá tu turno',
  description = 'Seleccioná el tributo, elegí día y hora, completá tus datos y confirmá. La reserva es inmediata y te enviaremos un comprobante.',
  cancelTo = '/',
  cancelLabel = 'Cancelar y volver',
  successReturnTo = '/',
  successReturnLabel = 'Volver al inicio',
}: AppointmentWizardProps = {}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [tributeId, setTributeId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [formValues, setFormValues] = useState<CitizenFormValues | null>(null);
  const [citizenFormIsValid, setCitizenFormIsValid] = useState(false);
  const [result, setResult] = useState<AppointmentPublic | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tributesQuery = useQuery({
    queryKey: ['tribute-types'],
    queryFn: () => publicApi.tributeTypes(),
  });

  const tribute: TributeType | undefined = useMemo(
    () => (tributesQuery.data ?? []).find((t) => t.id === tributeId),
    [tributesQuery.data, tributeId],
  );

  const createAppointment = useMutation({
    mutationFn: (payload: Record<string, unknown>) => publicApi.createAppointment(payload),
    onSuccess: (data) => {
      setResult(data);
      setStep(5);
    },
    onError: (err) => {
      const message = err instanceof ApiError ? err.message : 'Error inesperado al registrar la reserva';
      setErrorMessage(message);
    },
  });

  const handleSubmitForm = async (data: CitizenFormValues) => {
    if (!tribute || !selectedSlot) return;
    setErrorMessage(null);
    setFormValues(data);
    setCitizenFormIsValid(true);
    setStep(4);
  };

  const confirmReservation = () => {
    if (!tribute || !selectedSlot || !formValues) return;
    createAppointment.mutate({
      tribute_type_id: tribute.id,
      slot_id: selectedSlot.id,
      citizen_name: formValues.citizen_name,
      citizen_document: formValues.citizen_document,
      phone: formValues.phone,
      email: formValues.email || null,
      reference_value: formValues.reference_value || null,
      comments: formValues.comments || null,
      accept_terms: formValues.accept_terms,
    });
  };

  if (result) {
    return (
      <AppointmentSuccess
        appointment={result}
        receiptFooter={AGENDA_CONFIG.receiptFooter}
        returnTo={successReturnTo}
        returnLabel={successReturnLabel}
      />
    );
  }

  if (tributesQuery.isLoading) {
    return <LoadingState label="Cargando…" />;
  }
  if (tributesQuery.isError) {
    return (
      <MessageBar intent="error">
        <MessageBarBody>
          <Text>No pudimos cargar los tributos disponibles. Reintentá en unos minutos.</Text>
        </MessageBarBody>
      </MessageBar>
    );
  }

  return (
    <div className="af-stack-lg af-fade-in" style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      {breadcrumbItems.length > 0 && (
        <div className="af-row" style={{ gap: 8, flexWrap: 'wrap' }}>
          <Breadcrumb>
            {breadcrumbItems.map((item, index) => (
              <>
                {index > 0 && <BreadcrumbDivider />}
                <BreadcrumbItem key={`${item}-${index}`}>{item}</BreadcrumbItem>
              </>
            ))}
          </Breadcrumb>
        </div>
      )}
      <div className="af-stack" style={{ gap: 8, maxWidth: 920 }}>
        <Title2 style={{ margin: 0, display: 'block', lineHeight: 1.1 }}>
          {title}
        </Title2>
        <Text className="af-muted" style={{ display: 'block', lineHeight: 1.55, maxWidth: 860 }}>
          {description}
        </Text>
      </div>

      <Stepper currentStep={step} />

      {step === 1 && (
        <div className="af-stack-lg">
          <TributeTypeStep
            selectedId={tributeId}
            onSelect={(id) => {
              setTributeId(id);
              setSelectedDate(null);
              setSelectedSlot(null);
              setFormValues(null);
              setCitizenFormIsValid(false);
              setErrorMessage(null);
              setStep(2);
            }}
          />
        </div>
      )}

      {step === 2 && tribute && (
        <div className="af-stack-lg">
          <div className="af-row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <CalendarAvailability
                tributeTypeId={tribute.id}
                selectedDate={selectedDate}
                selectedSlotId={selectedSlot?.id ?? null}
                onSelectDate={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot(null);
                  setFormValues(null);
                  setCitizenFormIsValid(false);
                  setErrorMessage(null);
                }}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setFormValues(null);
                setCitizenFormIsValid(false);
                setErrorMessage(null);
              }}
              />
            </div>
            <aside style={{ flex: 1, minWidth: 280, maxWidth: 360 }}>
              <SelectedSummary
                tribute={tribute}
                slot={selectedSlot}
                date={selectedDate}
              />
            </aside>
          </div>
          <div className="af-row" style={{ justifyContent: 'space-between' }}>
            <Button
              icon={<ArrowLeft24Regular />}
              appearance="subtle"
              onClick={() => setStep(1)}
            >
              Cambiar tributo
            </Button>
            <Button
              iconPosition="after"
              icon={<ArrowRight24Regular />}
              appearance="primary"
              disabled={!selectedSlot}
              onClick={() => setStep(3)}
            >
              Continuar con mis datos
            </Button>
          </div>
        </div>
      )}

      {step === 3 && tribute && (
        <div className="af-stack-lg">
          <div className="af-row" style={{ gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <CitizenDataStep
                tributeType={tribute}
                legalNotice={AGENDA_CONFIG.legalNotice}
                onSubmit={handleSubmitForm}
                onValidityChange={setCitizenFormIsValid}
                initialValues={formValues ?? undefined}
                submitting={createAppointment.isPending}
                errorMessage={errorMessage}
              />
            </div>
            <aside style={{ flex: 1, minWidth: 280, maxWidth: 360 }}>
              <SelectedSummary
                tribute={tribute}
                slot={selectedSlot}
                date={selectedDate}
                citizenName={formValues?.citizen_name}
              />
            </aside>
          </div>
          <div className="af-row" style={{ justifyContent: 'space-between' }}>
            <Button
              icon={<ArrowLeft24Regular />}
              appearance="subtle"
              onClick={() => setStep(2)}
            >
              Cambiar horario
            </Button>
            <ReviewStepButton canReview={citizenFormIsValid} submitting={createAppointment.isPending} />
          </div>
        </div>
      )}

      {step === 4 && tribute && selectedSlot && formValues && (
        <div className="af-stack-lg">
          <ConfirmationSummary tributeType={tribute} slot={selectedSlot} citizenName={formValues.citizen_name} />
          {errorMessage && (
            <MessageBar intent="error">
              <MessageBarBody>
                <Text>{errorMessage}</Text>
              </MessageBarBody>
            </MessageBar>
          )}
          <div className="af-row" style={{ justifyContent: 'space-between' }}>
            <Button
              icon={<ArrowLeft24Regular />}
              appearance="subtle"
              onClick={() => setStep(3)}
            >
              Editar datos
            </Button>
            <Button
              appearance="primary"
              icon={<LockClosed24Regular />}
              disabled={createAppointment.isPending}
              onClick={confirmReservation}
            >
              {createAppointment.isPending ? 'Procesando…' : 'Confirmar reserva'}
            </Button>
          </div>
        </div>
      )}
      <div className="af-row" style={{ justifyContent: 'center' }}>
        <Button appearance="subtle" onClick={() => navigate(cancelTo)}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`,
        gap: 8,
        listStyle: 'none',
        padding: 0,
        margin: 0,
      }}
    >
      {STEPS.map((s) => {
        const isDone = currentStep > s.id;
        const isActive = currentStep === s.id;
        return (
          <li
            key={s.id}
            style={{
              padding: '12px 14px',
              borderRadius: 12,
              background: isActive
                ? 'linear-gradient(135deg,#1f3a8a,#4338ca)'
                : isDone
                  ? 'rgba(4,120,87,0.08)'
                  : 'var(--af-surface)',
              border: `1px solid ${isActive ? 'transparent' : 'var(--af-border)'}`,
              color: isActive ? '#fff' : isDone ? 'var(--af-success)' : 'var(--af-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: isActive
                  ? 'rgba(255,255,255,0.18)'
                  : isDone
                    ? 'var(--af-success)'
                    : 'rgba(15,23,42,0.06)',
                color: isActive ? '#fff' : isDone ? '#fff' : 'var(--af-muted)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
              }}
            >
              {isDone ? '✓' : s.id}
            </span>
            <span style={{ fontWeight: 600 }}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

function SelectedSummary({
  tribute,
  slot,
  date,
  citizenName,
}: {
  tribute: TributeType;
  slot: Slot | null;
  date: string | null;
  citizenName?: string;
}) {
  return (
    <div
      style={{
        position: 'sticky',
        top: 96,
        background: 'var(--af-surface)',
        borderRadius: 16,
        border: '1px solid var(--af-border)',
        padding: 20,
        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
      }}
      className="af-fade-in"
    >
      <Subtitle1>Tu reserva</Subtitle1>
      <div className="af-stack" style={{ marginTop: 12, gap: 8 }}>
        <Row label="Tributo" value={tribute.name} />
        {date && (
          <Row
            label="Fecha"
            value={dayjs(date).format('dddd D MMM')}
          />
        )}
        {slot && (
          <Row label="Hora" value={`${slot.start_time} – ${slot.end_time}`} />
        )}
        {slot?.location_name && <Row label="Sede" value={slot.location_name} />}
        {citizenName && <Row label="Titular" value={citizenName} />}
        <Row
          label="Duración"
          value={`${tribute.default_duration_minutes} min`}
        />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="af-detail-row">
      <Text className="af-detail-label" style={{ minWidth: 80 }}>
        {label}
      </Text>
      <Body1Strong className="af-detail-value" style={{ fontWeight: 500 }}>{value}</Body1Strong>
    </div>
  );
}

export function ReviewStepButton({ canReview, submitting }: { canReview: boolean; submitting: boolean }) {
  return (
    <Button
      type="submit"
      form="citizen-data-form"
      appearance="primary"
      icon={<ArrowRight24Regular />}
      iconPosition="after"
      disabled={!canReview || submitting}
    >
      Revisar y confirmar
    </Button>
  );
}

// We import tokens so tree shaking keeps the dependency but it is not used
// here directly. This silences eslint warnings on certain builds.
void tokens;
