import { AxiosError } from 'axios';
import { publicApi, API_ROUTES } from '../../../../global/api';
import { LoginRequestDTO, LoginResponseData } from '../types/login.types';
import { ApiResponse } from '../../../../global/types/global.types';

export const loginRequest = async ({ email, password }: LoginRequestDTO) => {
  try {
    const response = await publicApi.post<ApiResponse<LoginResponseData>>(API_ROUTES.PUBLIC.LOGIN, {
      email: email,
      password: password,
    });

    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || `${publicApi.defaults.baseURL}`);
    }
    throw error;
  }
};
