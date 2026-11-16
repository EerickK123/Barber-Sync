export interface JoinBarbershopScreenProps {
  onSuccess?: () => void;

  showDescription?: boolean;
}

export interface JoinBarbershopBodyProps {
  showDescription: boolean;

  descriptionText: string;

  code: string;

  isPending: boolean;

  error: string | null;

  onChangeCode: (text: string) => void;

  onSubmit: () => void;

  onClearError: () => void;

  onOpenScanner: () => void;
}

export interface QRScannerProps {
  onRead: (value: string) => void;

  onClose: () => void;
}