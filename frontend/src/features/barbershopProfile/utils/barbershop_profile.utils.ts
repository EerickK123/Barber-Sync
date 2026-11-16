import { Reservation } from '../types/barbershop_profile.types';

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);

export const formatDuration = (duration: string): string => {
  const [h, m] = duration.split(':');
  return `${Number(h) * 60 + Number(m)} min`;
};

export const generateTimelineHours = (openTime: string, closeTime: string): string[] => {
  if (!openTime || !closeTime) return [];
  const startH = parseInt(openTime.split(':')[0], 10);
  const endH = parseInt(closeTime.split(':')[0], 10);
  const hours: string[] = [];
  for (let i = startH; i <= endH; i++) {
    hours.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return hours;
};

export interface MergedBusyBlock {
  start_slot: number;
  occupied_slots: number;
  mine: false;
}

export interface MineBlock extends Reservation {
  mine: true;
  service_info: NonNullable<Reservation['service_info']>;
}

export const mergeReservations = (
  reservations: Reservation[],
): { mergedBusy: MergedBusyBlock[]; mineReservations: MineBlock[] } => {
  if (!reservations || reservations.length === 0) {
    return { mergedBusy: [], mineReservations: [] };
  }

  const mineReservations = reservations.filter(
    (r): r is MineBlock => r.mine === true && !!r.service_info,
  );

  const busyIntervals = reservations
    .filter((r) => !r.mine)
    .map((r) => ({ start: r.start_slot, end: r.start_slot + r.occupied_slots }))
    .sort((a, b) => a.start - b.start);

  const mergedBusy: MergedBusyBlock[] = [];

  if (busyIntervals.length > 0) {
    let current = { ...busyIntervals[0] };
    for (let i = 1; i < busyIntervals.length; i++) {
      if (busyIntervals[i].start <= current.end) {
        current.end = Math.max(current.end, busyIntervals[i].end);
      } else {
        mergedBusy.push({
          start_slot: current.start,
          occupied_slots: current.end - current.start,
          mine: false,
        });
        current = { ...busyIntervals[i] };
      }
    }
    mergedBusy.push({
      start_slot: current.start,
      occupied_slots: current.end - current.start,
      mine: false,
    });
  }

  return { mergedBusy, mineReservations };
};