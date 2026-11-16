// hooks/useGetClientReservations.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { getClientReservationsRequest } from '../service/getReservations.service';

export const useGetClientReservations = (statusId: number) =>
  useInfiniteQuery({
    queryKey: ['get_client_reservations', statusId],
    queryFn: ({ pageParam = 1 }) =>
      getClientReservationsRequest({ status_id: statusId, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // Usamos la metadata de tu API
      const { current_page, total_pages } = lastPage.pagination;
      return current_page < total_pages ? current_page + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5, // 5 min de caché
  });
