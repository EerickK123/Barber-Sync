import { useQuery } from '@tanstack/react-query';

import { getBarbershopsRequest } from '../service/get_barbershops.service';
import { BarbershopsResponseResult } from '../types/get_barbershops.types';

export const useGetBarbershops = () => {
  return useQuery<BarbershopsResponseResult, Error>({
    queryKey: ["get_barbershops"],
    queryFn: getBarbershopsRequest,
  });
};