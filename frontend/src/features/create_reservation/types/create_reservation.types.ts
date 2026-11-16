export interface ReservationInfoDTO {
  reservation_employee: string;
  reservation_service: number;
  reservation_barbershop: number;
  reservation_datetime: string; // "YYYY-MM-DD HH:mm"
}

export interface CreateReservationData {
  reservation_info: ReservationInfoDTO;
}

export interface SelectedTime {
  hour: number;
  minute: number;
}