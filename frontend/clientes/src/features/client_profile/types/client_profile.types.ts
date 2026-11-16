export interface clientProfile {
  profile: {
    name: string;
    lastName: string;
    avatar: string;
    email: string;
    phone: string;
  };
}

export interface IUpdateProfileFrontend {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface IRNImageFile {
  uri: string;
  name: string;
  type: string;
}

export interface UpdateProfileMutationParams {
  profileData: IUpdateProfileFrontend;
  avatarFile?: IRNImageFile;
}
