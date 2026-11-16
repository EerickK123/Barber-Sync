export interface BarbershopAttributes {
  barbershop_id?: number;
  barbershop_admin: number;
  barbershop_name: string;
  barbershop_phone: string;
  barbershop_code: string;
  barbershop_private_code: string;
  barbershop_address: string;
  barbershop_description?: string | null;
  barbershop_cover_url?: string | null;
  barbershop_profile_url?: string | null;
  barbershop_tier?: number;
  barbershop_is_active?: boolean;
}
