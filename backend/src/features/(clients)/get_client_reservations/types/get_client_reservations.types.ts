export interface IClientReservationFilter {
  status_id?: number;
  page?: number;
  limit?: number;
}

export interface IReservationBarbershopInfo {
  id: number;
  name: string;
  address: string;
  avatar: string | null;
}

export interface IReservationServiceInfo {
  id: number;
  name: string;
  price: number;
}

export interface IReservationEmployeeInfo {
  uuid: string;
  name: string;
  lastName: string;
  avatar: string | null;
}

export interface IClientReservationOutput {
  id: number;
  datetime: string;
  status: {
    id: number;
    name: string;
  };
  barbershop: IReservationBarbershopInfo;
  service: IReservationServiceInfo;
  employee: IReservationEmployeeInfo;
}

export interface IPaginationMeta {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

export interface IGetClientReservationsResponse {
  reservations: IClientReservationOutput[];
  pagination: IPaginationMeta;
}