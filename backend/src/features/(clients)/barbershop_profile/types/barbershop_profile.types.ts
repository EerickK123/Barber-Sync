export interface ISchedule {
  schedule_day_of_week: number;
  schedule_open_time: string;
  schedule_close_time: string;
}

export interface IBarbershopService {
  sxb_id: number;
  sxb_service_name: string; 
  sxb_service_duration: string;
  sxb_price: string | number;
}

export interface IBarbershopGallery {
  gallery_id: number;
  gallery_url: string; 
}

export interface IEmployeeSkill {
  sxe_id: number;
  ServiceDetails?: {
    sxb_id: number;
    sxb_service_name: string;
    sxb_service_duration: string;
    sxb_price: string | number;
  };
}

export interface IReservationDetail {
  reservation_id: number;
  reservation_service: number;
  reservation_datetime: string;
  reservation_start_slot: number;
  reservation_occupied_slots: number;
  Client?: {
    uuid: string;
  };
  Status?: {
    status: string;
  };
  ServiceDetails?: {
    sxb_id: number;
    sxb_service_name: string;
    sxb_service_duration: string;
    sxb_price: string | number;
  };
}

export interface IEmployeeDetail {
  employee_id: number;
  employee_is_active: number;
  User?: {
    uuid: string;
    user_name: string;
    user_lastname: string;
    user_avatar: string | null;
  };
  EmployeeServices: IEmployeeSkill[];
  Reservations: IReservationDetail[];
}

export interface IBarbershopFullResponse {
  barbershop_id: number;
  barbershop_name: string;
  barbershop_phone: string;
  barbershop_address: string;
  barbershop_code: string;
  barbershop_description: string | null;
  barbershop_tier: number;
  barbershop_cover_url: string | null;
  barbershop_profile_url: string | null;
  Schedules: ISchedule[];
  BarbershopServices: IBarbershopService[];
  Employees: IEmployeeDetail[];
  Gallery?: IBarbershopGallery[];
}

// ==========================================
// TRANSFORMED API OUTPUTS (V3)
// ==========================================

export interface IBarbershopInfoOutput {
  id: number;
  name: string;
  phone: string;
  address: string;
  code: string;
  description: string | null;
  tier: number;
  cover: string | null;
  avatar: string | null;
  gallery: string[]; // 🔴 Array de strings ordenados de URLs directo en info
}

export interface ICalendarReservation {
  employee_uuid: string;
  start_slot: number;
  occupied_slots: number;
  status: string;
  mine: boolean;
  service_info?: {
    id: number;
    name: string;
    duration: string;
    price: number;
  };
}

export interface ICalendarDayOutput {
  date: string;
  day_name: string;
  day_number: number;
  working_day: boolean;
  open: string | null;
  close: string | null;
  total_slots: number;
  reservations: ICalendarReservation[];
  is_past: boolean;
}

export interface IServiceOutput {
  id: number;
  name: string;
  duration: string;
  price: number;
}

export interface ISkillOutput {
  skill_id: number;
  skill_name: string;
  duration: string;
  price: number;
}

export interface IEmployeeOutput {
  uuid: string;
  name: string;
  lastName: string;
  avatar: string | null; // 🔴 Traído del User
  skills: ISkillOutput[];
}

export interface IFullProfileOutput {
  barbershop_info: IBarbershopInfoOutput;
  calendar: ICalendarDayOutput[];
  services: IServiceOutput[];
  employees: IEmployeeOutput[];
}