// services/getClientReservations.ts
import { AxiosError } from 'axios';
import { API_ROUTES, privateApi } from '@/global/api';
import { ApiResponse } from '@/global/types/global.types';
import {
  ClientReservationsResponseResult,
  GetClientReservationsParams,
} from '../types/reservations.types';

export const getClientReservationsRequest = async (
  params: GetClientReservationsParams
): Promise<ClientReservationsResponseResult> => {
  try {
    const response = await privateApi.get<ApiResponse<ClientReservationsResponseResult>>(
      API_ROUTES.PRIVATE.GET_RESERVATIONS,
      { params }
    );

    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'SERVER.ERROR.CONNECTION.REFUSED');
    }
    throw error;
  }
};
