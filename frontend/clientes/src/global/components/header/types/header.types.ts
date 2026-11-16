import { ReactNode } from 'react';

export interface PrefabHeaderProps {
  title: string;

  subtitle?: string;

  leftComponent?: ReactNode;

  rightComponent?: ReactNode;

  className?: string;

  translate?: boolean;
}