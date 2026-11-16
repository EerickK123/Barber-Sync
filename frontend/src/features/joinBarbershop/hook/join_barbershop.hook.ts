import { useMutation } from '@tanstack/react-query';

import { joinBarbershopByCodeRequest } from '../service/join_barbershop.service';

export const useJoinBarbershopByCode = () => {
  return useMutation({
    mutationFn: joinBarbershopByCodeRequest,
  });
};