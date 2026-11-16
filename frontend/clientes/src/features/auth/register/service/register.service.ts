import { AxiosError } from 'axios';
import { publicApi, API_ROUTES } from '@/global/api';
import { RegisterFormState, RegisterResponseData } from '../types/register.types';
import { ApiResponse } from '@/global/types/global.types';

export const registerRequest = async (payload: RegisterFormState) => {
  try {
    const formData = new FormData();

    if (payload.user_avatar) {
      formData.append('user_avatar', {
        uri: payload.user_avatar.uri,
        type: payload.user_avatar.mimeType ?? 'image/jpeg',
        name: payload.user_avatar.fileName ?? 'avatar.jpg',
      } as any);
    }

    formData.append(
      'data',
      JSON.stringify({
        create_client_data: {
          user_name: payload.user_name,
          user_lastname: payload.user_lastname,
          user_email: payload.user_email,
          user_password: payload.user_password,
          user_phone: payload.user_phone,
        },
      })
    );

    const response = await publicApi.post<ApiResponse<RegisterResponseData>>(
      API_ROUTES.PUBLIC.REGISTER,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message ?? 'SERVER.CONNECTION.REFUSE');
    }

    throw error;
  }
};
