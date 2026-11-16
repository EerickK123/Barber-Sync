import Dayjs from "../../../../global/lib/dayjs";
import { throwErrorHelper } from "../../../../global/helpers";
import { getFullBarbershopDataByCode } from "../model/barbershop_profile.model";
import {
  IFullProfileOutput,
  ISchedule,
  IBarbershopService,
  IEmployeeDetail,
  IEmployeeSkill,
  IBarbershopInfoOutput,
  IServiceOutput,
  IEmployeeOutput,
  ISkillOutput,
  ICalendarDayOutput,
  ICalendarReservation,
  IBarbershopFullResponse,
} from "../types/barbershop_profile.types";

const getCalendarStartDate = () => {
  const today = Dayjs.tz().startOf("day");
  return today.subtract((today.day() + 6) % 7, "day");
};

export const getAllBarbershopInfoService = async (
  barbershop_code: string,
  userUuid: string,
): Promise<IFullProfileOutput> => {
  const startDateObj = getCalendarStartDate();
  const dateStart = startDateObj.format("YYYY-MM-DD");
  const dateEnd = startDateObj.add(20, "day").format("YYYY-MM-DD");

  const data = await getFullBarbershopDataByCode(barbershop_code, dateStart, dateEnd);

  if (!data) {
    throwErrorHelper("ERROR.BARBERSHOP.NOT_FOUND", 404);
  }

  const barbershopData = data as IBarbershopFullResponse;
  const schedulesMap = buildSchedulesMap(barbershopData.Schedules);
  const calendar = buildCalendar(startDateObj, schedulesMap);

  attachReservationsToCalendar(calendar, barbershopData.Employees, userUuid);

  return {
    barbershop_info: formatBarbershopInfo(barbershopData),
    calendar: Object.values(calendar),
    services: formatServices(barbershopData.BarbershopServices),
    employees: formatEmployees(barbershopData.Employees),
  };
};

const formatBarbershopInfo = (
  data: IBarbershopFullResponse,
): IBarbershopInfoOutput => ({
  id: data.barbershop_id,
  name: data.barbershop_name,
  phone: data.barbershop_phone,
  address: data.barbershop_address,
  code: data.barbershop_code,
  description: data.barbershop_description,
  tier: data.barbershop_tier,
  cover: data.barbershop_cover_url,
  avatar: data.barbershop_profile_url,
  gallery: mapGalleryUrls(data.Gallery),
});

const mapGalleryUrls = (gallery: IBarbershopFullResponse["Gallery"] = []): string[] =>
  gallery.map((item) => item.gallery_url);

const calculateSlots = (open: string, close: string): number =>
  Dayjs(close, "HH:mm").diff(Dayjs(open, "HH:mm"), "minute") / 5;

const buildSchedulesMap = (schedules: ISchedule[] = []) =>
  Object.fromEntries(
    schedules.map((schedule) => {
      const open = normalizeTime(schedule.schedule_open_time);
      const close = normalizeTime(schedule.schedule_close_time);

      return [
        schedule.schedule_day_of_week,
        {
          open,
          close,
          total_slots: calculateSlots(open, close),
        },
      ];
    }),
  );

const normalizeTime = (value: string): string => value.slice(0, 5);

const buildCalendar = (
  startDate: Dayjs.Dayjs,
  schedulesMap: Record<number, any>,
): Record<string, ICalendarDayOutput> => {
  // Corregido: Obtenemos el "hoy" real de Bogotá de forma segura
  const today = Dayjs.tz().startOf("day");
  const calendar: Record<string, ICalendarDayOutput> = {};

  for (let i = 0; i < 21; i++) {
    const currentDate = startDate.add(i, "day");
    const dayNumber = currentDate.day();
    const schedule = schedulesMap[dayNumber];
    const dateKey = currentDate.format("YYYY-MM-DD");

    calendar[dateKey] = {
      date: dateKey,
      day_name: currentDate.format("dddd"),
      day_number: dayNumber,
      working_day: !!schedule,
      open: schedule?.open ?? null,
      close: schedule?.close ?? null,
      total_slots: schedule?.total_slots ?? 0,
      is_past: currentDate.isBefore(today),
      reservations: [],
    };
  }

  return calendar;
};

const attachReservationsToCalendar = (
  calendar: Record<string, ICalendarDayOutput>,
  employees: IEmployeeDetail[] = [],
  clientUuid: string,
) => {
  for (const employee of employees) {
    for (const reservation of employee.Reservations) {
      
      const dateKey = Dayjs.utc(reservation.reservation_datetime).tz().format("YYYY-MM-DD");
      
      const calendarDay = calendar[dateKey];
      if (!calendarDay) continue;

      const isMine = reservation.Client?.uuid === clientUuid;

      const reservationData: ICalendarReservation = {
        employee_uuid: employee.User?.uuid!,
        start_slot: reservation.reservation_start_slot,
        occupied_slots: reservation.reservation_occupied_slots,
        status: reservation.Status?.status!,
        mine: isMine,
      };

      if (isMine) {
        reservationData.service_info = {
          id: reservation.ServiceDetails?.sxb_id!,
          name: reservation.ServiceDetails?.sxb_service_name!,
          duration: reservation.ServiceDetails?.sxb_service_duration!,
          price: Number(reservation.ServiceDetails?.sxb_price!),
        };
      }

      calendarDay.reservations.push(reservationData);
    }
  }
};

const formatServices = (
  services: IBarbershopService[] = [],
): IServiceOutput[] =>
  services.map((service) => ({
    id: service.sxb_id,
    name: service.sxb_service_name,
    duration: service.sxb_service_duration,
    price: Number(service.sxb_price),
  }));

const formatEmployeeSkills = (skills: IEmployeeSkill[] = []): ISkillOutput[] =>
  skills.map((skill) => ({
    skill_id: skill.ServiceDetails?.sxb_id!,
    skill_name: skill.ServiceDetails?.sxb_service_name!,
    duration: skill.ServiceDetails?.sxb_service_duration!,
    price: Number(skill.ServiceDetails?.sxb_price!),
  }));

const formatEmployees = (
  employees: IEmployeeDetail[] = [],
): IEmployeeOutput[] =>
  employees.map((employee) => ({
    uuid: employee.User?.uuid!,
    name: employee.User?.user_name!,
    lastName: employee.User?.user_lastname!,
    avatar: employee.User?.user_avatar ?? "",
    skills: formatEmployeeSkills(employee.EmployeeServices),
  }));