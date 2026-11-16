import Dayjs from "../../../../global/lib/dayjs";
import {
  findEmployeeByUserUuid,
  findEmployeeAgenda,
} from "../model/get_employee_schedule.model";
import { throwErrorHelper } from "../../../../global/helpers";
import { GetAgendaQuery } from "../types/get_employee_schedule.types";

const DEFAULT_STATUS_ID = 1;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

export const getEmployeeAgendaService = async (
  employee_uuid: string,
  query: GetAgendaQuery,
) => {
  const employee = await findEmployeeByUserUuid(employee_uuid);
  if (!employee) throwErrorHelper("ERROR.EMPLOYEE.NOT_FOUND", 404);

  const { startDateTime, endDateTime } = resolveDateRange(
    query.startDate,
    query.endDate,
  );

  const status_id = query.status ?? DEFAULT_STATUS_ID;
  const page = query.page ?? DEFAULT_PAGE;
  const limit = query.limit ?? DEFAULT_LIMIT;

  const result = await findEmployeeAgenda({
    employee_id: (employee as any).employee_id,
    status_id,
    startDateTime,
    endDateTime,
    page,
    limit,
  });

  const mappedReservations = result.rows.map((res: any) => ({
    id: res.reservation_id,
    datetime: Dayjs.utc(res.reservation_datetime)
      .tz()
      .format("YYYY-MM-DD HH:mm"),
    startSlot: res.reservation_start_slot,
    occupiedSlots: res.reservation_occupied_slots,
    statusId: res.reservation_status,
    client: {
      uuid: res.client?.uuid!,
      name: res.client?.user_name!,
      lastName: res.client?.user_lastname!,
      phone: res.client?.user_phone!,
      avatar: res.client?.user_avatar ?? null,
    },
    service: {
      id: res.service?.sxb_id!,
      name: res.service?.sxb_service_name!,
      duration: res.service?.sxb_service_duration!,
      price: Number(res.service?.sxb_price!),
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

const resolveDateRange = (startDate?: string, endDate?: string) => {
  const baseStart = startDate ? Dayjs.tz(startDate) : Dayjs.tz();
  const startDateTime = baseStart.startOf("day").toDate();
  const baseEndStr = endDate ?? startDate;
  const baseEnd = baseEndStr ? Dayjs.tz(baseEndStr) : Dayjs.tz(baseStart);
  const endDateTime = baseEnd.endOf("day").toDate();
  return { startDateTime, endDateTime };
};
