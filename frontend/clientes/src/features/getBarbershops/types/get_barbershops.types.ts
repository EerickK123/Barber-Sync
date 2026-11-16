export interface BarbershopItem {
  barbershop_name: string;
  barbershop_code: string;
  barbershop_cover_url: string;
  barbershop_profile_url: string;
}

export interface BarbershopsResponseResult {
  barbershops: BarbershopItem[];
}

export interface GetBarbershopsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export interface GetBarbershopsBodyProps {
  barbershops: BarbershopItem[];
  searchQuery: string;
  error?: string;
  onOpenJoinModal: () => void;
  onOpenBarbershop: (code: string) => void;
}


export interface JoinBarbershopModalProps {
  visible: boolean;
  onClose: () => void;
}
