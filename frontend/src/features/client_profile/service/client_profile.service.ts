import { AxiosError } from 'axios';
import { privateApi, API_ROUTES } from '@/global/api';
import { ApiResponse } from '@/global/types/global.types';
import { clientProfile, IRNImageFile, IUpdateProfileFrontend } from '../types/client_profile.types';


// =========================================================
// SERVICIOS
// =========================================================

export const getClientProfile = async (): Promise<clientProfile> => {
  try {
    const response = await privateApi.get<ApiResponse<clientProfile>>(
      API_ROUTES.PRIVATE.GET_CLIENT_PROFILE
    );
    return response.data.result;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || 'No fue posible cargar el perfil del usuario'
      );
    }
    throw error;
  }
};


export const updateClientProfile = async (
  profileData: IUpdateProfileFrontend,
  avatarFile?: IRNImageFile
): Promise<boolean> => {
  try {
    const formData = new FormData();
    const payloadObject = {
      'update-profile': {
        profile_info: profileData,
      },
    };
    formData.append('data', JSON.stringify(payloadObject));
    if (avatarFile) {
      formData.append('user_avatar', avatarFile as any);
    }


    const response = await privateApi.patch<ApiResponse<{ updated: boolean }>>(
      API_ROUTES.PRIVATE.UPDATE_CLIENT_PROFILE,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data.result.updated;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'No fue posible actualizar el perfil');
    }
    throw error;
  }
};
