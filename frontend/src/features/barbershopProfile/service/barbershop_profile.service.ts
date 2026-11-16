import { AxiosError } from 'axios';
import { privateApi, API_ROUTES } from '@/global/api';
import { ApiResponse } from '@/global/types/global.types';
import { BarbershopProfileResult } from '../types/barbershop_profile.types';

export const getBarbershopProfileByCodeRequest = async (
  code: string,
): Promise<BarbershopProfileResult> => {
  try {
    const response = await privateApi.post<ApiResponse<BarbershopProfileResult>>(
      API_ROUTES.PRIVATE.GET_BARBERSHOP_PROFILE,
      { barbershop_code: code },
    );
    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'No fue posible cargar el perfil de la barbería',
      );
    }
    throw error;
  }
};