'use client';

import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import React, { CSSProperties } from 'react';
import { Flexbox } from 'react-layout-kit';

import Loading from '@/components/Loading/BrandTextLoading';
import { SettingsTabs } from '@/store/global/initialState';

const componentMap = {
  [SettingsTabs.TTS]: dynamic(() => import('../tts'), {
    loading: () => <Loading />,
  }),
  [SettingsTabs.About]: dynamic(() => import('../about'), {
    loading: () => <Loading />,
  }),
  [SettingsTabs.Hotkey]: dynamic(() => import('../hotkey'), {
    loading: () => <Loading />,
  }),
  [SettingsTabs.Proxy]: dynamic(() => import('../proxy'), {
    loading: () => <Loading />,
  }),
  [SettingsTabs.Storage]: dynamic(() => import('../storage'), {
    loading: () => <Loading />,
  })
};

interface SettingsContentProps {
  activeTab?: string;
  mobile?: boolean;
  showLLM?: boolean;
}

const SettingsContent = ({ mobile, activeTab, showLLM = true }: SettingsContentProps) => {
  // 简化的渲染函数
  const renderComponent = (tab: string) => {
    const Component = componentMap[tab as keyof typeof componentMap];
    if (!Component) return null;

    const componentProps: { mobile?: boolean } = {};
    if ([SettingsTabs.About].includes(tab as any)) {
      componentProps.mobile = mobile;
    }

    return <Component {...componentProps} />;
  };

  if (mobile) {
    return activeTab ? renderComponent(activeTab) : renderComponent(SettingsTabs.Hotkey);
  }

  const getDisplayStyle = (tabName: string): CSSProperties => ({
    alignItems: 'center',
    display: activeTab === tabName ? 'flex' : 'none',
    flexDirection: 'column',
    gap: 64,
    height: '100%',
    paddingBlock: mobile ? 0 : 24,
      paddingInline: mobile ? 0 : 32,
    width: '100%',
  });

  return (
    <Flexbox height={'100%'} width={'100%'}>
      {Object.keys(componentMap).map((tabKey) => (
        <div key={tabKey} style={getDisplayStyle(tabKey)}>
          {activeTab === tabKey && renderComponent(tabKey)}
        </div>
      ))}
    </Flexbox>
  );
};

export default SettingsContent;
