import React, { PropsWithChildren } from 'react';
import { BaseLayout } from '@/global/layouts/base/base.layout';

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <BaseLayout
      scrollable={true}
      keyboard={true}
      safeArea={true}
      padding="sm"
      keyboardOffset={10}>
      {children}
    </BaseLayout>
  );
};
