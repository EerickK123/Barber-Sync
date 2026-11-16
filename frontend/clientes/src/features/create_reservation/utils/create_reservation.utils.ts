import { CalendarDay, Reservation } from '@/features/barbershopProfile/types/barbershop_profile.types';

export const parseDurationToMinutes = (duration: string): number => {
  const [h, m] = duration.split(':').map(Number);
  return h * 60 + m;
};

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);

/**
 * Valida si la hora seleccionada por el usuario es válida dentro de la jornada y no se cruza
 * con otras citas del barbero seleccionado. Se ejecuta en el Submit general.
 */
export const validateReservationTime = (
  day: CalendarDay,
  employeeUuid: string,
  serviceDuration: string,
  selectedHour: number,
  selectedMinute: number
): { isValid: boolean; errorMsg?: string } => {
  if (!day.open || !day.close || !day.working_day) {
    return { isValid: false, errorMsg: 'El día seleccionado no es laborable.' };
  }

  // Convertimos las horas de apertura y la hora seleccionada a minutos totales desde las 00:00
  const [openH, openM] = day.open.split(':').map(Number);
  const openMinutesTotal = openH * 60 + openM;
  const selectedMinutesTotal = selectedHour * 60 + selectedMinute;

  // Calculamos el inicio en base a "slots" de 5 minutos, que es la métrica de la base de datos
  const startSlot = (selectedMinutesTotal - openMinutesTotal) / 5;
  const occupiedSlots = parseDurationToMinutes(serviceDuration) / 5;

  // 1. Validar que la cita esté dentro del horario comercial del día
  if (startSlot < 0) {
    return { isValid: false, errorMsg: 'La hora seleccionada es antes de la apertura de la barbería.' };
  }
  if (startSlot + occupiedSlots > day.total_slots) {
    return { isValid: false, errorMsg: 'El tiempo del servicio excede el horario de cierre de la barbería.' };
  }

  // 2. Validar que no se solape con reservas del barbero específico (ignorando canceladas si aplica)
  const employeeReservations: Reservation[] = day.reservations.filter(
    (r) => r.employee_uuid === employeeUuid && r.status !== 'cancelled'
  );

  const hasOverlap = employeeReservations.some((r) => {
    const existingEnd = r.start_slot + r.occupied_slots;
    const requestedEnd = startSlot + occupiedSlots;
    // Condición matemática de solapamiento: (InicioA < FinB) && (InicioB < FinA)
    return startSlot < existingEnd && requestedEnd > r.start_slot;
  });

  if (hasOverlap) {
    return { isValid: false, errorMsg: 'El barbero ya tiene una cita ocupando ese bloque de tiempo. Por favor, intenta con otra hora.' };
  }

  return { isValid: true };
};