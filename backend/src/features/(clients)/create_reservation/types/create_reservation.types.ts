export interface ICreateReservationData {
  reservation_client?: string; 
  reservation_employee: string; 
  reservation_service: number; 
  reservation_barbershop: number;
  reservation_datetime: string;
  reservation_start_slot?: number;
  reservation_occupied_slots?: number;
}