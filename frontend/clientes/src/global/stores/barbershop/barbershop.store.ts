import { create } from 'zustand';
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

export const useBarbershopProfileStore = create<BarbershopProfileState>((set) => ({
  barbershopInfo: null,
  services: [],
  employees: [],
  calendar: [],

  setBarbershopProfile: (profile) => set({ 
    barbershopInfo: profile.barbershop_info,
    services: profile.services,
    employees: profile.employees,
    calendar: profile.calendar,
  }),

  clearProfile: () => set({ 
    barbershopInfo: null,
    services: [],
    employees: [],
    calendar: [],
  }),
}));