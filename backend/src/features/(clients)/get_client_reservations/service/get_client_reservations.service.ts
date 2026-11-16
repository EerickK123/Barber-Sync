import Dayjs from "../../../../global/lib/dayjs";
import { getReservationsByClientModel } from "../model/get_client_reservations.model";
import { IGetClientReservationsResponse } from "../types/get_client_reservations.types";

export const getClientReservationsService = async (
  clientUuid: string,
  statusId?: number,
  page: number = 1,
  limit: number = 20,
): Promise<IGetClientReservationsResponse> => {
  const targetStatuses = statusId ? [statusId] : [1];
  const offset = (page - 1) * limit;
  const orderDirection = targetStatuses.includes(1) ? "ASC" : "DESC";

  const result = await getReservationsByClientModel(
    clientUuid,
    targetStatuses,
    limit,
    offset,
    orderDirection,
  );

  const mappedReservations = result.rows.map((res: any) => ({
    id: res.reservation_id,
    datetime: Dayjs.utc(res.reservation_datetime).tz().format("YYYY-MM-DD HH:mm"),
    
    status: {
      id: res.Status?.status_id!,
      name: res.Status?.status!,
    },
    barbershop: {
      id: res.Barbershop?.barbershop_id!,
      name: res.Barbershop?.barbershop_name!,
      address: res.Barbershop?.barbershop_address!,
      avatar: res.Barbershop?.barbershop_profile_url ?? null,
    },
    service: {
      id: res.ServiceDetails?.sxb_id!,
      name: res.ServiceDetails?.sxb_service_name!,
      price: Number(res.ServiceDetails?.sxb_price!),
    },
    employee: {
      uuid: res.Employee?.User?.uuid!,
      name: res.Employee?.User?.user_name!,
      lastName: res.Employee?.User?.user_lastname!,
      avatar: res.Employee?.User?.user_avatar ?? null,
    },
  }));

  return {
    reservations: mappedReservations,
    pagination: {
      total_items: result.count,
      total_pages: Math.ceil(result.count / limit),
      current_page: page,
      limit: limit,
    },
  };
};