'use client';

import { memo } from 'react';
import { Center } from 'react-layout-kit';
import { useTranslation } from 'react-i18next';

import PageTitle from '@/components/PageTitle';

const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('common');

  return (
    <Center>
      <PageTitle title={t('tab.mindfulness')} />
      {children}
    </Center>
  );
});

Layout.displayName = 'MindfulnessLayout';

export default Layout;