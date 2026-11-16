export interface FindAgendaParams {
  employee_id: number;
  status_id: number;
  startDateTime: Date;
  endDateTime: Date;
  page: number;
  limit: number;
}


export interface GetAgendaQuery {
  startDate?: string;
  endDate?: string;
  status?: number;
  page?: number;
  limit?: number;
}