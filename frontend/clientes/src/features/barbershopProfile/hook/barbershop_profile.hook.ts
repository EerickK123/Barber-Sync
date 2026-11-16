import { useMutation } from '@tanstack/react-query';
import { getBarbershopProfileByCodeRequest } from '../service/barbershop_profile.service';
import { BarbershopProfileResult } from '../types/barbershop_profile.types';
import { useBarbershopProfileStore } from '@/global/stores/barbershop/barbershop.store';

export const useGetBarbershopProfile = () => {
  const setBarbershopProfile = useBarbershopProfileStore((state) => state.setBarbershopProfile);

  return useMutation<BarbershopProfileResult, Error, string>({
    mutationKey: ['get_barbershop_profile_mutation'],
    mutationFn: getBarbershopProfileByCodeRequest,
    onSuccess: (response) => {
      try {
        setBarbershopProfile(response.data);
      } catch (error) {
        console.error('[useGetBarbershopProfile] Error guardando el perfil en Zustand:', error);
      }
    },
  });
};