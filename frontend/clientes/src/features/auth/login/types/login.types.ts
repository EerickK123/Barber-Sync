export interface LoginRequestDTO {
  email: string;
  password: string;
}

export type LoginPayload = LoginRequestDTO;

export interface LoginResponseData {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}

export interface LoginFormProps {
  onSubmit: (payload: LoginPayload) => void;
  isPending: boolean;
  errorMessage?: string;
  onClearError: () => void;
}

export interface RenderFormFieldsProps {
  form: LoginPayload;
  isPending: boolean;
  onInputChange: (field: keyof LoginPayload) => (value: string) => void;
}

export interface RenderFormActionsProps {
  isPending: boolean;
  errorMessage?: string;
  onFormSubmit: () => void;
  onClearError: () => void;
}
