export interface RegisterRequestDTO {
  user_name: string;
  user_lastname: string;
  user_email: string;
  user_password: string;
  user_phone: string;
}

export interface RegisterFormState extends RegisterRequestDTO {
  confirm_password: string;
  user_avatar?: {
    uri: string;
    mimeType?: string;
    fileName?: string;
  };
}

export interface RegisterResponseData {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormState) => void;
  isPending: boolean;
  errorMessage?: string;
  onClearError: () => void;
}
