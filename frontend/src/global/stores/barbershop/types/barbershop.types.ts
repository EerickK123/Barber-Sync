import { 
  BarbershopProfileData, 
  ServiceInfo, 
  Employee, 
  CalendarDay, 
  BarbershopInfo 
} from "@/features/barbershopProfile/types/barbershop_profile.types";

export interface BarbershopProfileState {
  barbershopInfo: BarbershopInfo | null;
  services: ServiceInfo[];
  employees: Employee[];
  calendar: CalendarDay[];

  setBarbershopProfile: (profile: BarbershopProfileData) => void;
  clearProfile: () => void;
}