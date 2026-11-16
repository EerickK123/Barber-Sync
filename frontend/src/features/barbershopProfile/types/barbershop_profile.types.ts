export interface ServiceInfo {
  id: number;
  name: string;
  duration: string;
  price: number;
}

export interface Reservation {
  employee_uuid: string;
  start_slot: number;
  occupied_slots: number;
  status: string;
  mine: boolean;
  service_info?: ServiceInfo;
}

export interface CalendarDay {
  date: string;
  day_name: string;
  day_number: number;
  working_day: boolean;
  open: string | null;
  close: string | null;
  total_slots: number;
  is_past: boolean;
  reservations: Reservation[];
}

export interface EmployeeSkill {
  skill_id: number;
  skill_name: string;
  duration: string;
  price: number;
}

export interface Employee {
  uuid: string;
  name: string;
  lastName: string;
  avatar: string;
  skills: EmployeeSkill[];
}

export interface BarbershopInfo {
  id: number;
  name: string;
  phone: string;
  address: string;
  code: string;
  description: string;
  tier: number;
  cover: string;
  avatar: string;
  gallery: string[];
}

export interface BarbershopProfileData {
  barbershop_info: BarbershopInfo;
  calendar: CalendarDay[];
  services: ServiceInfo[];
  employees: Employee[];
}

export interface BarbershopProfileResult {
  data: BarbershopProfileData;
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface BarbershopHeroProps {
  info: BarbershopInfo;
}

export interface BarbershopTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

export interface BarbershopInfoSectionProps {
  barbershopInfo: BarbershopInfo;
}

export interface BarbershopAgendaProps {
  calendar: CalendarDay[];
  selectedDate: string | null;
  selectedDay: CalendarDay | null;
  onSelectDate: (date: string) => void;
}

export interface BarbershopServicesProps {
  services: ServiceInfo[];
}

export interface BarbershopTeamProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export interface EmployeeModalProps {
  employee: Employee | null;
  visible: boolean;
  onClose: () => void;
}

export interface ReservationDetailModalProps {
  reservation: Reservation | null;
  visible: boolean;
  onClose: () => void;
}