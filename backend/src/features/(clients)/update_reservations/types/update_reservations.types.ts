export interface IUpdateReservationData {
  reservation_id: number;
  reservation_barbershop?: number;
  reservation_employee?: string;
  reservation_service?: number;
  reservation_datetime?: string;
  reservation_status?: number;
}

export interface IUpdateTargets {
  reservation_id: number;
  barbershop_id: number;
  employee_uuid: string;
  service_id: number;
  datetime_str: string;
  day_of_week: number;
  date_only: string;
}

export interface IDBUpdatePayload {
  reservation_status?: number;
  reservation_datetime?: string;
  reservation_barbershop?: number;
  reservation_service?: number;
  reservation_employee?: number;
  reservation_start_slot?: number;
  reservation_occupied_slots?: number;
}