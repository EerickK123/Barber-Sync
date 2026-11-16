import { AxiosError } from 'axios';
import { privateApi, API_ROUTES } from '@/global/api';
import { ApiResponse } from '@/global/types/global.types';
import { CreateReservationData } from '../types/create_reservation.types';

export const createReservationRequest = async (
  data: CreateReservationData,
): Promise<{ iscreated: boolean, message: string }> => {
  try {
    const response = await privateApi.post<ApiResponse<{ iscreated: boolean }>>(
      API_ROUTES.PRIVATE.CREATE_RESERVATION,
      data,
    );
    return {
      iscreated: response.data.result.iscreated,
      message: response.data.message
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
    throw error;
  }
};