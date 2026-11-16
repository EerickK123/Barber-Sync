import { PrefabAvatarSize } from '../types/avatar.types';

export const getAvatarVariants = (size: PrefabAvatarSize) => {
  const mappings: Record<PrefabAvatarSize, string> = {
    sm: 'h-10 w-10 rounded-lg',
    md: 'h-14 w-14 rounded-xl',
    lg: 'h-20 w-20 rounded-2xl',
  };

  return mappings[size];
};
