import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientProfile, IRNImageFile, IUpdateProfileFrontend, UpdateProfileMutationParams } from '../types/client_profile.types';
import { getClientProfile, updateClientProfile } from '../service/client_profile.service';



export const useGetClientProfile = () => {
  return useQuery<clientProfile, Error>({
    queryKey: ['get_client_profile'],
    queryFn: getClientProfile,
  });
};

export const useUpdateClientProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, UpdateProfileMutationParams>({
    mutationFn: ({ profileData, avatarFile }) => updateClientProfile(profileData, avatarFile),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get_client_profile'],
      });
    },
    onError: (error) => {
      console.error('[USE_UPDATE_PROFILE_ERROR]', error.message);
    },
  });
};
