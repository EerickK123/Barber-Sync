import { AxiosError } from 'axios';

import { API_ROUTES, privateApi } from '@/global/api';

import { ApiResponse } from '@/global/types/global.types';

import { BarbershopsResponseResult } from '../types/get_barbershops.types';

export const getBarbershopsRequest = async (): Promise<BarbershopsResponseResult> => {
  try {
    const response = await privateApi.get<ApiResponse<BarbershopsResponseResult>>(
      API_ROUTES.PRIVATE.GET_BARBERSHOPS
    );

    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'SERVER.ERROR.CONNECTION.REFUSED');
    }

    throw error;
  }
};
