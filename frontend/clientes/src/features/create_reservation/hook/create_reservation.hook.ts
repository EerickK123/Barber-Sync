import { useMutation } from '@tanstack/react-query';
import { createReservationRequest } from '../service/create_reservation.service';

export const useCreateReservation = () => {
  return useMutation({
    mutationFn: createReservationRequest,
  });
};