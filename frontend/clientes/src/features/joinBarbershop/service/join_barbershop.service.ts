import { AxiosError } from 'axios';

import { API_ROUTES, privateApi } from '@/global/api';

import { ApiResponse } from '@/global/types/global.types';

interface JoinBarbershopResponse {
  joined: boolean;
}

export const joinBarbershopByCodeRequest = async (
    
  code: string
): Promise<JoinBarbershopResponse> => {
  try {
    const response = await privateApi.post<ApiResponse<JoinBarbershopResponse>>(
      API_ROUTES.PRIVATE.JOIN_BARBERSHOP,
      {
        barbershop_code: code,
      }
    );

    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'server.ERROR.UNKNOWN'
      );
    }

    throw error;
  }
};