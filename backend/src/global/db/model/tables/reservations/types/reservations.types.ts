export interface ReservationAttributes {
  reservation_id?: number;
  reservation_client: string;
  reservation_employee: number;
  reservation_service: number;
  reservation_barbershop: number;
  reservation_datetime: Date;
  reservation_start_slot: number;
  reservation_occupied_slots: number;
  reservation_status: number;
  reservation_created_at?: Date;
}