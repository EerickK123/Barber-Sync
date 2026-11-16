
export interface Status {
  id: number;
  name: string;
}

export interface Barbershop {
  id: number;
  name: string;
  address: string;
  avatar: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
}

export interface Employee {
  uuid: string;
  name: string;
  lastName: string;
  avatar: string;
}

export interface Reservation {
  id: number;
  datetime: string; // Formato: "YYYY-MM-DD HH:mm"
  status: Status;
  barbershop: Barbershop;
  service: Service;
  employee: Employee;
}

export interface Pagination {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

export interface ClientReservationsResponseResult {
  reservations: Reservation[];
  pagination: Pagination;
}

// Interfaz para los filtros que enviaremos a Axios
export interface GetClientReservationsParams {
  page?: number;
  status_id?: number;
}